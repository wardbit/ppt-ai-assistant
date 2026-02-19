// Zhipu GLM provider implementation
import { AbstractProvider, type ProviderOptions } from '../base/provider';
import type { ChatCompletionRequest, ChatCompletionResponse, ProviderType } from '@ppt-ai/types';

const GLM_MODELS = [
  'glm-4',
  'glm-4-flash',
  'glm-4-plus',
  'glm-3-turbo'
];

const GLM_BASE_URL = 'https://open.bigmodel.cn/api/paas/v4';

export class GLMProvider extends AbstractProvider {
  readonly type: ProviderType = 'glm';
  readonly name = 'Zhipu GLM';
  readonly defaultModel = 'glm-4';
  readonly supportsStreaming = true;
  
  private baseUrl: string;
  
  constructor(options: ProviderOptions) {
    super(options);
    this.baseUrl = options.baseUrl || GLM_BASE_URL;
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
      throw new Error(`GLM API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    
    // Transform GLM response to OpenAI format
    return {
      id: data.id || `glm-${Date.now()}`,
      model: data.model || this.model,
      choices: [{
        message: {
          id: data.id,
          role: 'assistant',
          content: data.choices?.[0]?.message?.content || '',
          timestamp: Date.now(),
          provider: this.type,
          model: data.model
        },
        finishReason: data.choices?.[0]?.finish_reason || 'stop'
      }],
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
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
      throw new Error(`GLM API error: ${response.status} - ${error}`);
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
    return GLM_MODELS;
  }
}
