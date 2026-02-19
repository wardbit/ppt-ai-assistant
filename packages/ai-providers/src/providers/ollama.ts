// Ollama provider for local models
import { AbstractProvider, type ProviderOptions } from '../base/provider';
import type { ChatCompletionRequest, ChatCompletionResponse, ProviderType } from '@ppt-ai/types';

const OLLAMA_BASE_URL = 'http://localhost:11434';

export class OllamaProvider extends AbstractProvider {
  readonly type: ProviderType = 'ollama';
  readonly name = 'Ollama (Local)';
  readonly defaultModel = 'llama2';
  readonly supportsStreaming = true;
  
  private baseUrl: string;
  
  constructor(options: ProviderOptions) {
    super(options);
    this.baseUrl = options.baseUrl || OLLAMA_BASE_URL;
  }
  
  async chat(request: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    const model = request.model || this.model;
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: request.messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: false,
        options: {
          temperature: request.temperature || this.temperature,
          top_p: request.topP || this.topP,
          num_predict: request.maxTokens || this.maxTokens,
        }
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    
    return {
      id: `ollama-${Date.now()}`,
      model: data.model || model,
      choices: [{
        message: {
          id: data.id,
          role: 'assistant',
          content: data.message?.content || '',
          timestamp: Date.now(),
          provider: this.type,
          model: data.model
        },
        finishReason: data.done ? 'stop' : 'length'
      }],
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
      }
    };
  }
  
  async *stream(request: ChatCompletionRequest): AsyncGenerator<{ delta: string; done: boolean }> {
    const model = request.model || this.model;
    
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: request.messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: true,
        options: {
          temperature: request.temperature || this.temperature,
          top_p: request.topP || this.topP,
          num_predict: request.maxTokens || this.maxTokens,
        }
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Ollama API error: ${response.status} - ${error}`);
    }
    
    if (!response.body) {
      throw new Error('No response body');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const lines = decoder.decode(value, { stream: true }).split('\n');
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          const data = JSON.parse(line);
          const content = data.message?.content || '';
          if (content || data.done) {
            yield { delta: content, done: data.done || false };
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
  
  async validateApiKey(_apiKey: string): Promise<boolean> {
    // Ollama doesn't require API key, just check if server is running
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }
  
  async getAvailableModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [this.defaultModel];
      
      const data = await response.json();
      return data.models?.map((m: { name: string }) => m.name) || [this.defaultModel];
    } catch {
      return [this.defaultModel];
    }
  }
  
  getAvailableModelsSync(): string[] {
    // Sync version returns default, use async for actual list
    return [this.defaultModel, 'mistral', 'codellama', 'vicuna'];
  }
}
