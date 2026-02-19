// Base provider interface for all AI providers
import type { 
  ChatMessage, 
  ChatCompletionRequest, 
  ChatCompletionResponse,
  ProviderType 
} from '@ppt-ai/types';

export interface BaseProvider {
  readonly type: ProviderType;
  readonly name: string;
  readonly defaultModel: string;
  readonly supportsStreaming: boolean;
  
  chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  
  stream?(request: ChatCompletionRequest): AsyncGenerator<{
    delta: string;
    done: boolean;
  }>;
  
  validateApiKey(apiKey: string): Promise<boolean>;
  
  getAvailableModels(): string[];
}

export interface ProviderOptions {
  apiKey: string;
  baseUrl?: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

export abstract class AbstractProvider implements BaseProvider {
  abstract readonly type: ProviderType;
  abstract readonly name: string;
  abstract readonly defaultModel: string;
  abstract readonly supportsStreaming: boolean = true;
  
  protected apiKey: string;
  protected baseUrl?: string;
  protected model: string;
  protected maxTokens?: number;
  protected temperature?: number;
  protected topP?: number;
  
  constructor(options: ProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl;
    this.model = options.model || this.defaultModel;
    this.maxTokens = options.maxTokens;
    this.temperature = options.temperature;
    this.topP = options.topP;
  }
  
  abstract chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
  abstract validateApiKey(apiKey: string): Promise<boolean>;
  abstract getAvailableModels(): string[];
  
  protected buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }
  
  protected buildRequestBody(request: ChatCompletionRequest): Record<string, unknown> {
    const body: Record<string, unknown> = {
      model: request.model || this.model,
      messages: request.messages.map(m => ({
        role: m.role,
        content: m.content
      })),
    };
    
    if (request.temperature || this.temperature) {
      body.temperature = request.temperature || this.temperature;
    }
    if (request.maxTokens || this.maxTokens) {
      body.max_tokens = request.maxTokens || this.maxTokens;
    }
    if (request.topP || this.topP) {
      body.top_p = request.topP || this.topP;
    }
    if (request.stream) {
      body.stream = true;
    }
    
    return body;
  }
}

// Provider registry for managing multiple providers
export class ProviderRegistry {
  private providers: Map<ProviderType, BaseProvider> = new Map();
  
  register(provider: BaseProvider): void {
    this.providers.set(provider.type, provider);
  }
  
  get(type: ProviderType): BaseProvider | undefined {
    return this.providers.get(type);
  }
  
  has(type: ProviderType): boolean {
    return this.providers.has(type);
  }
  
  list(): BaseProvider[] {
    return Array.from(this.providers.values());
  }
  
  unregister(type: ProviderType): void {
    this.providers.delete(type);
  }
}
