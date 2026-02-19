// fal.ai provider implementation
import { AbstractImageProvider, type ImageProviderOptions } from '../base/provider';
import type { ImageGenerationRequest, ImageGenerationResponse, ImageProviderType } from '@ppt-ai/types';

const FALAI_MODELS = [
  'leonardo-Phoenix',
  'stable-diffusion-xl-1024-v1-0',
  'playground-v2-1024px-aesthetic',
  'pix2pix',
  'depth-to-image',
  'img2img'
];

const FALAI_BASE_URL = 'https://queue.fal.run';

export class FalAIProvider extends AbstractImageProvider {
  readonly type: ImageProviderType = 'falai';
  readonly name = 'fal.ai';
  readonly defaultModel = 'stable-diffusion-xl-1024-v1-0';
  
  private baseUrl: string;
  
  constructor(options: ImageProviderOptions) {
    super(options);
    this.baseUrl = options.baseUrl || FALAI_BASE_URL;
  }
  
  async generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // fal.ai uses a queue-based system
    const response = await fetch(`${this.baseUrl}/${this.model}`, {
      method: 'POST',
      headers: {
        ...this.buildHeaders(),
        'Authorization': `Key ${this.apiKey}`,
      },
      body: JSON.stringify({
        prompt: request.prompt,
        num_images: request.number || 1,
        ...(request.negativePrompt && { negative_prompt: request.negativePrompt }),
        ...(request.size && { size: request.size }),
        ...(request.quality && { quality: request.quality }),
        ...(request.style && { style: request.style }),
      }),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`fal.ai API error: ${response.status} - ${error}`);
    }
    
    const data = await response.json();
    
    // For async requests, fal.ai returns a request ID
    // In a real implementation, you'd need to poll for the result
    return {
      id: data.request_id || `falai-${Date.now()}`,
      created: Date.now(),
      model: this.model,
      images: data.images?.map((img: { url: string }) => ({
        url: img.url,
        revisedPrompt: data.revised_prompt || request.prompt
      })) || [],
      pending: data.request_id ? true : false,
      requestId: data.request_id
    };
  }
  
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/user/information`, {
        headers: {
          'Authorization': `Key ${apiKey}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  getAvailableModels(): string[] {
    return FALAI_MODELS;
  }
}
