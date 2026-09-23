import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProviderService } from './ai-provider.service';
import {
  AIChatRequest,
  AIChatResponse,
  AITool,
} from '../interfaces/ai-provider.interface';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private defaultProvider: string;

  constructor(
    @Inject('AI_PROVIDER_FACTORY')
    private readonly providers: Record<string, any>,
    private readonly configService: ConfigService,
    private readonly aiProviderService: AiProviderService,
  ) {
    this.defaultProvider = this.configService.get<string>('AI_DEFAULT_PROVIDER') ?? 'openai';
  }

  private getProvider(name: string) {
    if (!this.providers[name]) {
      throw new Error(`AI provider "${name}" not available`);
    }
    return this.providers[name];
  }

  async chat(request: AIChatRequest, providerName?: string): Promise<any> {
    // Default path: the single provider abstraction (AiProviderService).
    // Explicit legacy provider overrides still go through the factory.
    if (!providerName || providerName === this.aiProviderService.providerName) {
      this.logger.log(`Chat request via ${this.aiProviderService.providerName} abstraction`, {
        model: request.model,
      });

      const result = await this.aiProviderService.complete({
        messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
        tier:
          request.model?.includes('mini') || request.model?.includes('haiku')
            ? 'cheap'
            : 'standard',
        maxTokens: request.maxTokens,
        tools: request.tools?.map((t: AITool) => ({
          name: t.function.name,
          description: t.function.description,
          parameters: t.function.parameters,
        })),
      });

      const legacyToolCalls = result.toolCalls.map((tc) => ({
        id: tc.id,
        type: 'function' as const,
        function: { name: tc.name, arguments: JSON.stringify(tc.input ?? {}) },
      }));

      const response: AIChatResponse & { response: string } = {
        id: `ai-${Date.now()}`,
        model: this.aiProviderService.providerName,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: result.text,
              toolCalls: legacyToolCalls,
            },
            finishReason:
              result.stopReason === 'tool_use'
                ? 'tool_calls'
                : result.stopReason === 'max_tokens'
                  ? 'length'
                  : 'stop',
          },
        ],
        usage: {
          promptTokens: result.usage.inputTokens,
          completionTokens: result.usage.outputTokens,
          totalTokens: result.usage.inputTokens + result.usage.outputTokens,
        },
        created: Date.now(),
        // `response` mirrors the text so clients (frontend AICopilot) can
        // read the answer without digging into choices[0].message.content.
        response: result.text,
      };

      return response;
    }

    const provider = this.getProvider(providerName);
    this.logger.log(`Chat request to ${providerName}`, { model: request.model });
    return provider.chat(request);
  }

  async streamChat(request: AIChatRequest, providerName?: string): Promise<AsyncIterable<any>> {
    const provider = this.getProvider(providerName ?? this.defaultProvider);
    return provider.streamChat(request);
  }

  async getModels(providerName?: string) {
    const provider = this.getProvider(providerName ?? this.defaultProvider);
    return provider.getModels();
  }

  async validateProvider(name: string): Promise<boolean> {
    const provider = this.getProvider(name);
    return provider.validateConfig();
  }

  getDefaultProvider(): string {
    return this.defaultProvider;
  }

  getAvailableProviders(): string[] {
    return Object.keys(this.providers);
  }
}
