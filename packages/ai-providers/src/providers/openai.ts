// OpenAI provider implementation
import { AbstractProvider, type ProviderOptions } from '../base/provider';
import type { ChatCompletionRequest, ChatCompletionResponse, ProviderType } from '@ppt-ai/types';

const OPENAI_MODELS = [
  'gpt-4-turbo-preview',
  'gpt-4',
  'gpt-4-32k',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k'
];

const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export class OpenAIProvider extends AbstractProvider {
  readonly type: ProviderType = 'openai';
  readonly name = 'OpenAI';
  readonly defaultModel = 'gpt-4';
  readonly supportsStreaming = true;
  
  private baseUrl: string;
  
  constructor(options: ProviderOptions) {
    super(options);
    this.baseUrl = options.baseUrl || OPENAI_BASE_URL;
  }
  
  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        ...this.buildHeaders(),
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(this.buildRequestBody(request)),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    
    return response.json();
  }
  
  async *stream(request: ChatCompletionRequest): AsyncGenerator<{ delta: string; done: boolean }> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        ...this.buildHeaders(),
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ ...this.buildRequestBody(request), stream: true }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${error}`);
    }
    
    if (!response.body) {
      throw new Error('No response body');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        
        const data = trimmed.slice(6);
        if (data === '[DONE]') {
          yield { delta: '', done: true };
          return;
        }
        
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            yield { delta: content, done: false };
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
  
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  getAvailableModels(): string[] {
    return OPENAI_MODELS;
  }
}
