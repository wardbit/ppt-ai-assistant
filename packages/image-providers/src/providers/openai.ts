// OpenAI DALL-E image provider implementation
import { AbstractImageProvider, type ImageProviderOptions } from '../base/provider';
import type { ImageGenerationRequest, ImageGenerationResponse, ImageProviderType } from '@ppt-ai/types';

const OPENAI_IMAGE_MODELS = [
  'dall-e-3',
  'dall-e-2'
];

const OPENAI_IMAGE_BASE_URL = 'https://api.openai.com/v1';

export class OpenAIImageProvider extends AbstractImageProvider {
  readonly type: ImageProviderType = 'openai-image';
  readonly name = 'OpenAI DALL-E';
  readonly defaultModel = 'dall-e-3';
  
  private baseUrl: string;
  
  constructor(options: ImageProviderOptions) {
    super(options);
    this.baseUrl = options.baseUrl || OPENAI_IMAGE_BASE_URL;
  }
  
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const response = await fetch(`${this.baseUrl}/images/generations`, {
      method: 'POST',
      headers: {
        ...this.buildHeaders(),
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        prompt: request.prompt,
        n: request.number || 1,
        quality: request.quality || 'standard',
        size: request.size || '1024x1024',
        response_format: 'url',
        ...(request.negativePrompt && { negative_prompt: request.negativePrompt }),
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI Image API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    
    return {
      id: data.id || `dalle-${Date.now()}`,
      created: data.created || Math.floor(Date.now() / 1000),
      model: this.model,
      images: data.data?.map((img: { url: string; revised_prompt?: string }) => ({
        url: img.url,
        revisedPrompt: img.revised_prompt || request.prompt
      })) || []
    };
  }
  
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      // Test with a minimal request
      const response = await fetch(`${this.baseUrl}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: 'test',
          n: 1,
          size: '1024x1024'
        }),
      });
      return response.status !== 401;
    } catch {
      return false;
    }
  }
  
  getAvailableModels(): string[] {
    return OPENAI_IMAGE_MODELS;
  }
}
