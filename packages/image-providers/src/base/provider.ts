// Base image provider interface for all AI image generation providers
import type { ImageGenerationRequest, ImageGenerationResponse, ImageProviderType } from '@ppt-ai/types';

export interface BaseImageProvider {
  readonly type: ImageProviderType;
  readonly name: string;
  readonly defaultModel: string;
  
  generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
  
  validateApiKey(apiKey: string): Promise<boolean>;
  
  getAvailableModels(): string[];
}

export interface ImageProviderOptions {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}

export abstract class AbstractImageProvider implements BaseImageProvider {
  abstract readonly type: ImageProviderType;
  abstract readonly name: string;
  abstract readonly defaultModel: string;
  
  protected apiKey: string;
  protected baseUrl?: string;
  protected model: string;
  
  constructor(options: ImageProviderOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl;
    this.model = options.model || this.defaultModel;
  }
  
  abstract generate(request: ImageGenerationRequest): Promise<ImageGenerationResponse>;
  abstract validateApiKey(apiKey: string): Promise<boolean>;
  abstract getAvailableModels(): string[];
  
  protected buildHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
    };
  }
}

// Image provider registry
export class ImageProviderRegistry {
  private providers: Map<ImageProviderType, BaseImageProvider> = new Map();
  
  register(provider: BaseImageProvider): void {
    this.providers.set(provider.type, provider);
  }
  
  get(type: ImageProviderType): BaseImageProvider | undefined {
    return this.providers.get(type);
  }
  
  has(type: ImageProviderType): boolean {
    return this.providers.has(type);
  }
  
  list(): BaseImageProvider[] {
    return Array.from(this.providers.values());
  }
  
  unregister(type: ImageProviderType): void {
    this.providers.delete(type);
  }
}
