import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import {
  AIProvider,
  AIProviderConfig,
  AIChatRequest,
  AIChatResponse,
  AIChatResponseChunk,
  AIMessage,
  AITool,
  AIModel,
} from '../interfaces/ai-provider.interface';

@Injectable()
export class AnthropicProvider implements AIProvider {
  private readonly logger = new Logger(AnthropicProvider.name);
  private client: Anthropic | null = null;
  readonly name = 'anthropic';

  constructor(@Optional() private readonly configService: ConfigService) {
    this.initializeClient();
  }

  private initializeClient(): void {
    const config = this.getConfig();
    if (!config.apiKey) {
      this.logger.warn('Anthropic API key not configured. Provider will be unavailable.');
      return;
    }

    try {
      this.client = new Anthropic({
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
        timeout: config.timeout ?? 60000,
        maxRetries: config.maxRetries ?? 3,
      });
    } catch (error) {
      this.logger.error('Failed to initialize Anthropic client', error);
    }
  }

  private getConfig(): AIProviderConfig {
    return {
      apiKey: this.configService?.get<string>('ANTHROPIC_API_KEY') ?? '',
      baseUrl: this.configService?.get<string>('ANTHROPIC_BASE_URL'),
      defaultModel: this.configService?.get<string>('ANTHROPIC_DEFAULT_MODEL') ?? 'claude-3-5-sonnet-20241022',
      timeout: this.configService?.get<number>('ANTHROPIC_TIMEOUT') ?? 60000,
      maxRetries: this.configService?.get<number>('ANTHROPIC_MAX_RETRIES') ?? 3,
    };
  }

  async chat(request: AIChatRequest): Promise<any> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Please configure ANTHROPIC_API_KEY.');
    }
    
    const model = request.model ?? this.getConfig().defaultModel ?? 'claude-3-5-sonnet-20241022';
    
    const systemMessage = request.messages.find((m: any) => m.role === 'system');
    const messages = request.messages
      .filter((m: any) => m.role !== 'system')
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    const response = await this.client.messages.create({
      model,
      system: systemMessage?.content,
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 4096,
      tools: request.tools?.map(this.mapTool),
      tool_choice: this.mapToolChoice(request.toolChoice) as any,
      stream: false,
    });

    return this.mapResponse(response);
  }

  async streamChat(request: AIChatRequest): Promise<AsyncIterable<any>> {
    if (!this.client) {
      throw new Error('Anthropic client not initialized. Please configure ANTHROPIC_API_KEY.');
    }
    
    const model = request.model ?? this.getConfig().defaultModel ?? 'claude-3-5-sonnet-20241022';
    
    const systemMessage = request.messages.find((m: any) => m.role === 'system');
    const messages = request.messages
      .filter((m: any) => m.role !== 'system')
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    const stream = await this.client.messages.stream({
      model,
      system: systemMessage?.content,
      messages,
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 4096,
      tools: request.tools?.map(this.mapTool),
      tool_choice: this.mapToolChoice(request.toolChoice) as any,
    });

    return this.streamToAsyncIterable(stream);
  }

  private async *streamToAsyncIterable(stream: any): AsyncIterable<any> {
    for await (const chunk of stream) {
      yield this.mapChunk(chunk);
    }
  }

  async getModels(): Promise<any[]> {
    if (!this.client) return [];
    return [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        maxTokens: 200000,
        supportsTools: true,
        supportsStreaming: true,
      },
      {
        id: 'claude-3-5-haiku-20241022',
        name: 'Claude 3.5 Haiku',
        provider: 'anthropic',
        maxTokens: 200000,
        supportsTools: true,
        supportsStreaming: true,
      },
      {
        id: 'claude-3-opus-20240229',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        maxTokens: 200000,
        supportsTools: true,
        supportsStreaming: true,
      },
    ];
  }

  async validateConfig(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }],
      });
      return true;
    } catch (error) {
      this.logger.error('Anthropic config validation failed', error);
      return false;
    }
  }

  private mapTool(tool: any) {
    return {
      name: tool.function.name,
      description: tool.function.description,
      input_schema: tool.function.parameters,
    };
  }

  private mapToolChoice(choice?: string | { name: string }) {
    if (!choice) return { type: 'auto' };
    if (typeof choice === 'string') {
      if (choice === 'none') return { type: 'none' };
      if (choice === 'auto') return { type: 'auto' };
      return { type: 'tool', name: choice };
    }
    if (choice.name) return { type: 'tool', name: choice.name };
    return { type: 'auto' };
  }

  private mapResponse(response: any): any {
    const toolCalls = response.content
      .filter((block: any) => block.type === 'tool_use')
      .map((block: any) => ({
        id: block.id,
        type: 'function' as const,
        function: {
          name: block.name,
          arguments: JSON.stringify(block.input),
        },
      }));

    return {
      id: response.id,
      model: response.model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: response.content
              .filter((block: any) => block.type === 'text')
              .map((b: any) => b.text)
              .join(''),
            toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
          },
          finishReason: response.stop_reason === 'tool_use' ? 'tool_calls' : response.stop_reason ?? 'stop',
        },
      ],
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
      created: Math.floor(Date.now() / 1000),
    };
  }

  private mapChunk(chunk: any): any {
    let delta: any = {};
    let finishReason: string | null = null;

    if (chunk.type === 'content_block_delta') {
      if (chunk.delta.type === 'text_delta') {
        delta = { content: chunk.delta.text };
      } else if (chunk.delta.type === 'input_json_delta') {
        delta = { toolCalls: [{ function: { arguments: chunk.delta.partial_json } }] };
      }
    } else if (chunk.type === 'message_delta') {
      finishReason = chunk.delta.stop_reason === 'tool_use' ? 'tool_calls' : chunk.delta.stop_reason;
    }

    return {
      id: 'chunk',
      model: 'claude',
      choices: [{ index: 0, delta, finishReason }],
    };
  }
}
