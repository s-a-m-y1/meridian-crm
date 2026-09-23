export interface AIProvider {
  name: string;
  chat(request: AIChatRequest): Promise<AIChatResponse>;
  streamChat(request: AIChatRequest): Promise<AsyncIterable<AIChatResponseChunk>>;
  getModels(): Promise<AIModel[]>;
  validateConfig(): Promise<boolean>;
}

export interface AIChatRequest {
  messages: AIMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: AITool[];
  toolChoice?: 'auto' | 'none' | { name: string };
  stream?: boolean;
  userId?: string;
  organizationId?: string;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: AIToolCall[];
  toolCallId?: string;
  name?: string;
}

export interface AIChatResponse {
  id: string;
  model: string;
  choices: AIChatChoice[];
  usage: AIUsage;
  created: number;
}

export interface AIChatChoice {
  index: number;
  message: AIMessage;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'content_filter';
}

export interface AIChatResponseChunk {
  id: string;
  model: string;
  choices: AIChatChoiceChunk[];
}

export interface AIChatChoiceChunk {
  index: number;
  delta: Partial<AIMessage>;
  finishReason: string | null;
}

export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd?: number;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  maxTokens: number;
  supportsTools: boolean;
  supportsStreaming: boolean;
  pricing?: {
    inputPer1kTokens: number;
    outputPer1kTokens: number;
  };
}

export interface AITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface AIToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  organizationId?: string;
  defaultModel?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface AIToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}