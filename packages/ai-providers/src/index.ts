// AI Providers package - exports
export { AbstractProvider, ProviderRegistry, type BaseProvider, type ProviderOptions } from './base/provider';
export { OpenAIProvider } from './providers/openai';
export { GLMProvider } from './providers/glm';
export { OllamaProvider } from './providers/ollama';
// Export other providers as they are implemented
// export { GeminiProvider } from './providers/gemini';
// export { KimiProvider } from './providers/kimi';
// export { MinimaxProvider } from './providers/minimax';

import { OpenAIProvider } from './providers/openai';
import { GLMProvider } from './providers/glm';
import { OllamaProvider } from './providers/ollama';
import { ProviderRegistry, type BaseProvider, type ProviderOptions } from './base/provider';
import type { ProviderType } from '@ppt-ai/types';

// Provider factory function
export function createProvider(type: ProviderType, options: ProviderOptions): BaseProvider {
  switch (type) {
    case 'openai':
      return new OpenAIProvider(options);
    case 'glm':
      return new GLMProvider(options);
    case 'ollama':
      return new OllamaProvider(options);
    // case 'gemini':
    //   return new GeminiProvider(options);
    // case 'kimi':
    //   return new KimiProvider(options);
    // case 'minimax':
    //   return new MinimaxProvider(options);
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

// Create a pre-configured registry with all available providers
export function createProviderRegistry(): ProviderRegistry {
  const registry = new ProviderRegistry();
  
  // Register providers with empty config (users need to configure them)
  // The actual provider instances are created when user configures them
  
  return registry;
}

// Provider metadata for UI display
export const PROVIDER_METADATA: Record<ProviderType, { name: string; logo?: string; description: string }> = {
  openai: {
    name: 'OpenAI',
    description: 'GPT-4, GPT-3.5 models'
  },
  glm: {
    name: '智谱 GLM',
    description: 'GLM-4, GLM-3-Turbo'
  },
  gemini: {
    name: 'Google Gemini',
    description: 'Gemini Pro, Ultra'
  },
  kimi: {
    name: 'Moonshot Kimi',
    description: 'Kimi k1.5, Kimi k2'
  },
  minimax: {
    name: 'Minimax',
    description: 'MoE models'
  },
  jimeng: {
    name: '即梦 AI',
    description: 'Image generation'
  },
  dashscope: {
    name: '阿里云 DashScope',
    description: 'Qwen, LLaMA'
  },
  openrouter: {
    name: 'OpenRouter',
    description: 'Unified API for multiple models'
  },
  volcano: {
    name: '火山引擎',
    description: 'Douyin models'
  },
  ollama: {
    name: 'Ollama (本地)',
    description: 'Local models (Llama, Mistral, etc.)'
  }
};
