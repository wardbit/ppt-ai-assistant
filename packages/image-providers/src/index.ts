// Image Providers package - exports
export { AbstractImageProvider, ImageProviderRegistry, type BaseImageProvider, type ImageProviderOptions } from './base/provider';
export { FalAIProvider } from './providers/falai';
export { OpenAIImageProvider } from './providers/openai';

import { FalAIProvider } from './providers/falai';
import { OpenAIImageProvider } from './providers/openai';
import { ImageProviderRegistry, type BaseImageProvider, type ImageProviderOptions } from './base/provider';
import type { ImageProviderType } from '@ppt-ai/types';

// Image provider factory function
export function createImageProvider(type: ImageProviderType, options: ImageProviderOptions): BaseImageProvider {
  switch (type) {
    case 'falai':
      return new FalAIProvider(options);
    case 'openai-image':
      return new OpenAIImageProvider(options);
    // Add more providers as needed
    // case 'google-image':
    //   return new GoogleImageProvider(options);
    default:
      throw new Error(`Unknown image provider type: ${type}`);
  }
}

// Create a pre-configured registry
export function createImageProviderRegistry(): ImageProviderRegistry {
  const registry = new ImageProviderRegistry();
  return registry;
}

// Provider metadata for UI display
export const IMAGE_PROVIDER_METADATA: Record<ImageProviderType, { name: string; logo?: string; description: string }> = {
  openai: {
    name: 'OpenAI DALL-E',
    description: 'DALL-E 3, DALL-E 2'
  },
  falai: {
    name: 'fal.ai',
    description: 'Leonardo, Stable Diffusion XL, Playground v2'
  },
  'google-image': {
    name: 'Google Imagen',
    description: 'Imagen 3, Imagen 2'
  },
  anthropic: {
    name: 'Anthropic Images',
    description: 'Anthropic image generation'
  },
  'custom-image': {
    name: 'Custom Image API',
    description: 'Any OpenAI-compatible image API'
  }
};
