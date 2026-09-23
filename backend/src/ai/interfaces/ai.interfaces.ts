// Completion-level contracts used by AiProviderService.
//
// These intentionally live apart from the legacy shapes in
// ai-provider.interface.ts: AIService adapts between the two so existing
// callers keep working while new feature services can speak this
// provider-agnostic format directly.

export type AICompletionRole = 'system' | 'user' | 'assistant' | 'tool';

export interface AICompletionMessage {
  role: AICompletionRole;
  content: string;
}

export interface AICompletionTool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface AICompletionRequest {
  messages: AICompletionMessage[];
  /** Cost/quality tier — each provider maps it to a concrete model. */
  tier: 'cheap' | 'standard' | 'advanced';
  maxTokens?: number;
  /** Ask providers that support it for a JSON-object response. */
  jsonMode?: boolean;
  tools?: AICompletionTool[];
}

export interface AIToolCall {
  id: string;
  name: string;
  input: unknown;
}

export interface AICompletionResult {
  text: string;
  toolCalls: AIToolCall[];
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  stopReason: 'end_turn' | 'tool_use' | 'max_tokens';
}
