// src/ai/services/ai-provider.service.ts
//
// Single abstraction every AI feature service calls through. Feature
// services never import '@anthropic-ai/sdk' or 'openai' directly —
// they inject AiProviderService. Swapping providers is a config change,
// not a code change.
//
// API keys are read from ConfigService (server-side env only) and never
// reach a controller response or the frontend.

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AICompletionRequest,
  AICompletionResult,
} from '../interfaces/ai.interfaces';

interface AIProvider {
  readonly name: string;
  complete(request: AICompletionRequest): Promise<AICompletionResult>;
}

@Injectable()
export class AiProviderService {
  private readonly logger = new Logger(AiProviderService.name);
  private provider: AIProvider;

  constructor(private readonly config: ConfigService) {
    const providerName = this.config.get<string>('AI_PROVIDER', 'anthropic');

    if (providerName === 'openai' && this.config.get('OPENAI_API_KEY')) {
      this.provider = this.buildOpenAIProvider();
    } else if (providerName === 'nvidia' && this.config.get('NVIDIA_API_KEY')) {
      this.provider = this.buildNvidiaProvider();
    } else if (providerName === 'anthropic' && this.config.get('ANTHROPIC_API_KEY')) {
      this.provider = this.buildAnthropicProvider();
    } else if (this.config.get('NODE_ENV') === 'production') {
      // Fail fast on misconfigured production instead of serving mock data.
      throw new InternalServerErrorException(
        `AI_PROVIDER="${providerName}" is not configured. Set its API key (ANTHROPIC_API_KEY / OPENAI_API_KEY / NVIDIA_API_KEY).`,
      );
    } else {
      // Dev/test: prefer any other provider that IS configured, else mock.
      if (this.config.get('ANTHROPIC_API_KEY')) {
        this.provider = this.buildAnthropicProvider();
      } else if (this.config.get('OPENAI_API_KEY')) {
        this.provider = this.buildOpenAIProvider();
      } else if (this.config.get('NVIDIA_API_KEY')) {
        this.provider = this.buildNvidiaProvider();
      } else {
        this.logger.warn(
          `No AI API key configured (AI_PROVIDER="${providerName}") — using mock provider. ` +
            'Set ANTHROPIC_API_KEY, OPENAI_API_KEY or NVIDIA_API_KEY for real completions.',
        );
        this.provider = this.buildMockProvider();
      }
    }
  }

  async complete(request: AICompletionRequest): Promise<AICompletionResult> {
    return this.provider.complete(request);
  }

  get providerName(): string {
    return this.provider.name;
  }

  // -- Mock (dev fallback) -------------------------------------------------

  private buildMockProvider(): AIProvider {
    return {
      name: 'mock',
      complete: async () => ({
        text:
          'This is a mock AI response. Configure ANTHROPIC_API_KEY, OPENAI_API_KEY ' +
          'or NVIDIA_API_KEY for real completions.',
        toolCalls: [],
        usage: { inputTokens: 0, outputTokens: 0 },
        stopReason: 'end_turn',
      }),
    };
  }

  // -- Anthropic ----------------------------------------------------------

  private buildAnthropicProvider(): AIProvider {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) throw new InternalServerErrorException('ANTHROPIC_API_KEY is not set.');

    const resolveModel = (tier: AICompletionRequest['tier']) =>
      ({
        cheap: 'claude-haiku-4-5-20251001',
        standard: 'claude-sonnet-5',
        advanced: 'claude-sonnet-5',
      })[tier];

    return {
      name: 'anthropic',
      complete: async (request) => {
        const { default: Anthropic } = await import('@anthropic-ai/sdk');
        const client = new Anthropic({ apiKey });

        const systemMessage = request.messages.find((m) => m.role === 'system');
        const conversation = request.messages.filter((m) => m.role !== 'system');

        const response = await client.messages.create({
          model: resolveModel(request.tier),
          max_tokens: request.maxTokens ?? 1024,
          system: systemMessage?.content,
          messages: conversation.map((m) => ({
            role: m.role === 'tool' ? 'user' : (m.role as 'user' | 'assistant'),
            content: m.content,
          })),
          tools: request.tools?.map((t) => ({
            name: t.name,
            description: t.description,
            input_schema: t.parameters as any,
          })),
        });

        const toolCalls = response.content
          .filter((b): b is any => b.type === 'tool_use')
          .map((b) => ({ id: b.id, name: b.name, input: b.input }));

        const text = response.content
          .filter((b): b is any => b.type === 'text')
          .map((b) => b.text)
          .join('\n');

        return {
          text,
          toolCalls,
          usage: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
          },
          stopReason:
            response.stop_reason === 'tool_use'
              ? 'tool_use'
              : response.stop_reason === 'max_tokens'
                ? 'max_tokens'
                : 'end_turn',
        };
      },
    };
  }

  // -- OpenAI -------------------------------------------------------------

  private buildOpenAIProvider(): AIProvider {
    const apiKey = this.config.get<string>('OPENAI_API_KEY');
    if (!apiKey) throw new InternalServerErrorException('OPENAI_API_KEY is not set.');

    const resolveModel = (tier: AICompletionRequest['tier']) =>
      ({ cheap: 'gpt-4o-mini', standard: 'gpt-4o', advanced: 'gpt-4o' })[tier];

    return {
      name: 'openai',
      complete: async (request) => {
        const { default: OpenAI } = await import('openai');
        const client = new OpenAI({ apiKey });

        const response = await client.chat.completions.create({
          model: resolveModel(request.tier),
          max_tokens: request.maxTokens ?? 1024,
          response_format: request.jsonMode ? { type: 'json_object' } : undefined,
          messages: request.messages.map((m) => ({
            role: m.role === 'tool' ? 'user' : m.role,
            content: m.content,
          })) as any,
          tools: request.tools?.map((t) => ({
            type: 'function' as const,
            function: { name: t.name, description: t.description, parameters: t.parameters },
          })),
        });

        return this.mapOpenAICompatibleResponse(response);
      },
    };
  }

  // -- NVIDIA NIM (OpenAI-compatible endpoint) ----------------------------

  private buildNvidiaProvider(): AIProvider {
    const apiKey = this.config.get<string>('NVIDIA_API_KEY');
    const baseURL = this.config.get<string>(
      'NVIDIA_BASE_URL',
      'https://integrate.api.nvidia.com/v1',
    );
    const model = this.config.get<string>('NVIDIA_MODEL', 'z-ai/glm-5.3');
    if (!apiKey) throw new InternalServerErrorException('NVIDIA_API_KEY is not set.');

    return {
      name: 'nvidia',
      complete: async (request) => {
        const { default: OpenAI } = await import('openai');
        // NIM speaks the OpenAI chat-completions format, so the OpenAI SDK
        // works unmodified — just point it at NVIDIA's base URL instead.
        const client = new OpenAI({ apiKey, baseURL });

        const response = await client.chat.completions.create({
          // NIM endpoints typically serve one pinned model — same model for every tier
          model,
          max_tokens: request.maxTokens ?? 1024,
          messages: request.messages.map((m) => ({
            role: m.role === 'tool' ? 'user' : m.role,
            content: m.content,
          })) as any,
          tools: request.tools?.map((t) => ({
            type: 'function' as const,
            function: { name: t.name, description: t.description, parameters: t.parameters },
          })),
        });

        return this.mapOpenAICompatibleResponse(response);
      },
    };
  }

  // Shared mapper for OpenAI-shaped responses (OpenAI + NVIDIA NIM).
  // `tool_calls[].function.arguments` is a JSON *string* — parse defensively.
  private mapOpenAICompatibleResponse(response: any): AICompletionResult {
    const choice = response.choices[0];
    const toolCalls = (choice.message.tool_calls ?? []).map((tc: any) => ({
      id: tc.id,
      name: tc.function.name,
      input: (() => {
        try {
          return JSON.parse(tc.function.arguments);
        } catch {
          return {};
        }
      })(),
    }));

    return {
      text: choice.message.content ?? '',
      toolCalls,
      usage: {
        inputTokens: response.usage?.prompt_tokens ?? 0,
        outputTokens: response.usage?.completion_tokens ?? 0,
      },
      stopReason:
        choice.finish_reason === 'tool_calls'
          ? 'tool_use'
          : choice.finish_reason === 'length'
            ? 'max_tokens'
            : 'end_turn',
    };
  }
}
