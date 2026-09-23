import { Injectable, Logger, Optional } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
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
export class OpenAIProvider implements AIProvider {
  private readonly logger = new Logger(OpenAIProvider.name);
  private client: OpenAI | null = null;
  readonly name = 'openai';

  constructor(@Optional() private readonly configService: ConfigService) {
    this.initializeClient();
  }

  private initializeClient(): void {
    const config = this.getConfig();
    if (!config.apiKey) {
      this.logger.warn('OpenAI API key not configured. Provider will be unavailable.');
      return;
    }

    try {
      this.client = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl,
        organization: config.organizationId,
        timeout: config.timeout ?? 60000,
        maxRetries: config.maxRetries ?? 3,
      });
    } catch (error) {
      this.logger.error('Failed to initialize OpenAI client', error);
    }
  }

  private getConfig(): AIProviderConfig {
    return {
      apiKey: this.configService?.get<string>('OPENAI_API_KEY') ?? '',
      baseUrl: this.configService?.get<string>('OPENAI_BASE_URL'),
      organizationId: this.configService?.get<string>('OPENAI_ORG_ID'),
      defaultModel: this.configService?.get<string>('OPENAI_DEFAULT_MODEL') ?? 'gpt-4o',
      timeout: this.configService?.get<number>('OPENAI_TIMEOUT') ?? 60000,
      maxRetries: this.configService?.get<number>('OPENAI_MAX_RETRIES') ?? 3,
    };
  }

  async chat(request: AIChatRequest): Promise<any> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please configure OPENAI_API_KEY.');
    }
    
    const model = request.model ?? this.getConfig().defaultModel ?? 'gpt-4o';
    
    const response = await this.client.chat.completions.create({
      model,
      messages: this.mapMessages(request.messages),
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens,
      tools: request.tools ? this.mapTools(request.tools) : undefined,
      tool_choice: this.mapToolChoice(request.toolChoice),
      stream: false,
    });

    return this.mapResponse(response);
  }

  async streamChat(request: AIChatRequest): Promise<AsyncIterable<any>> {
    if (!this.client) {
      throw new Error('OpenAI client not initialized. Please configure OPENAI_API_KEY.');
    }
    
    const model = request.model ?? this.getConfig().defaultModel ?? 'gpt-4o';
    
    const stream = await this.client.chat.completions.create({
      model,
      messages: this.mapMessages(request.messages),
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens,
      tools: request.tools ? this.mapTools(request.tools) : undefined,
      tool_choice: this.mapToolChoice(request.toolChoice),
      stream: true,
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
    const models = await this.client.models.list();
    return models.data
      .filter((model) => model.id.startsWith('gpt'))
      .map((model) => ({
        id: model.id,
        name: model.id,
        provider: 'openai',
        maxTokens: this.getModelMaxTokens(model.id),
        supportsTools: this.supportsTools(model.id),
        supportsStreaming: true,
      }));
  }

  async validateConfig(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.models.list();
      return true;
    } catch (error) {
      this.logger.error('OpenAI config validation failed', error);
      return false;
    }
  }

  private mapMessages(messages: any[]) {
    return messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
      tool_calls: msg.toolCalls?.map((tc: any) => ({
        id: tc.id,
        type: tc.type,
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      })),
      tool_call_id: msg.toolCallId,
      name: msg.name,
    }));
  }

  private mapTools(tools: any[]) {
    return tools.map((tool) => ({
      type: 'function' as const,
      function: {
        name: tool.function.name,
        description: tool.function.description,
        parameters: tool.function.parameters,
      },
    }));
  }

  private mapToolChoice(choice?: string | { name: string }): any {
    if (!choice) return 'auto';
    if (typeof choice === 'string') {
      if (choice === 'none') return 'none';
      if (choice === 'auto') return 'auto';
      return { type: 'function', function: { name: choice } };
    }
    if (choice.name) return { type: 'function', function: { name: choice.name } };
    return 'auto';
  }

  private mapResponse(response: any): any {
    return {
      id: response.id,
      model: response.model,
      choices: response.choices.map((choice: any) => ({
        index: choice.index,
        message: {
          role: choice.message.role,
          content: choice.message.content,
          toolCalls: choice.message.tool_calls?.map((tc: any) => ({
            id: tc.id,
            type: tc.type,
            function: {
              name: tc.function.name,
              arguments: tc.function.arguments,
            },
          })),
        },
        finishReason: choice.finish_reason,
      })),
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
      created: response.created,
    };
  }

  private mapChunk(chunk: any): any {
    return {
      id: chunk.id,
      model: chunk.model,
      choices: chunk.choices.map((choice: any) => ({
        index: choice.index,
        delta: {
          role: choice.delta?.role,
          content: choice.delta?.content,
          toolCalls: choice.delta?.tool_calls?.map((tc: any) => ({
            id: tc.id,
            type: tc.type,
            function: {
              name: tc.function.name,
              arguments: tc.function.arguments,
            },
          })),
        },
        finishReason: choice.finish_reason ?? null,
      })),
    };
  }

  private getModelMaxTokens(modelId: string): number {
    const limits: Record<string, number> = {
      'gpt-4o': 128000,
      'gpt-4o-mini': 128000,
      'gpt-4-turbo': 128000,
      'gpt-4': 8192,
      'gpt-3.5-turbo': 16385,
    };
    return limits[modelId] ?? 4096;
  }

  private supportsTools(modelId: string): boolean {
    return modelId.startsWith('gpt-4') || modelId.includes('gpt-3.5-turbo');
  }
}
