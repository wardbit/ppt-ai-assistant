// ============================================
// AI Provider Types
// ============================================

export type ProviderType = 
  | 'openai' 
  | 'gemini' 
  | 'glm' 
  | 'kimi' 
  | 'minimax' 
  | 'jimeng'
  | 'dashscope'
  | 'openrouter'
  | 'volcano'
  | 'ollama';

export interface ProviderConfig {
  type: ProviderType;
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  provider?: ProviderType;
  model?: string;
  tokens?: number;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ChatCompletionResponse {
  id: string;
  model: string;
  choices: {
    message: ChatMessage;
    finishReason: 'stop' | 'length' | 'content_filter';
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  id: string;
  choices: {
    delta: Partial<ChatMessage>;
    finishReason?: string;
  }[];
}

// ============================================
// Presentation Types
// ============================================

export interface PresentationSlide {
  id: string;
  title: string;
  content: SlideContent[];
  layout: SlideLayout;
  speakerNotes?: string;
  images?: ImageSuggestion[];
}

export type SlideContent = 
  | { type: 'bullet'; text: string; }
  | { type: 'text'; text: string; }
  | { type: 'image'; url: string; alt?: string; };

export type SlideLayout = 
  | 'title'
  | 'title-content'
  | 'two-content'
  | 'blank'
  | 'custom';

export interface ImageSuggestion {
  keywords: string[];
  description?: string;
}

export interface Presentation {
  id: string;
  title: string;
  slides: PresentationSlide[];
  template?: string;
  language: string;
  createdAt: number;
  updatedAt: number;
}

export interface GenerationRequest {
  prompt: string;
  slides?: number;
  template?: string;
  language?: string;
  includeNotes?: boolean;
  knowledgeBaseId?: string;
}

// ============================================
// Knowledge Base Types
// ============================================

export type KnowledgeBaseType = 'qdrant' | 'dify' | 'ragflow';

export interface KnowledgeBaseConfig {
  type: KnowledgeBaseType;
  name: string;
  config: QdrantConfig | DifyConfig | RAGflowConfig;
  enabled: boolean;
}

export interface QdrantConfig {
  host: string;
  port: number;
  apiKey?: string;
  collectionName: string;
  vectorSize: number;
}

export interface DifyConfig {
  apiEndpoint: string;
  apiKey: string;
  datasetId: string;
}

export interface RAGflowConfig {
  apiEndpoint: string;
  apiKey: string;
  knowledgebaseId: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: number;
  chunks?: number;
  status: 'processing' | 'ready' | 'error';
}

export interface RetrievalResult {
  documentId: string;
  chunk: string;
  score: number;
  metadata?: Record<string, unknown>;
}

// ============================================
// Settings Types
// ============================================

export interface AppSettings {
  general: GeneralSettings;
  providers: ProviderConfig[];
  knowledgeBases: KnowledgeBaseConfig[];
  appearance: AppearanceSettings;
  storage: StorageSettings;
}

export interface GeneralSettings {
  defaultProvider: ProviderType;
  defaultModel: string;
  language: string;
  startMinimized: boolean;
  autoStart: boolean;
  checkUpdates: boolean;
}

export interface AppearanceSettings {
  theme | 'dark': 'light' | 'system';
  fontSize: number;
}

export interface StorageSettings {
  dataPath: string;
  maxHistory: number;
  cacheEnabled: boolean;
  cacheSize: number;
  autoBackup: boolean;
  backupCount: number;
}

// ============================================
// Office Plugin Types
// ============================================

export interface OfficeApp {
  type: 'powerpoint' | 'wps';
  version: string;
  installed: boolean;
  pluginInstalled: boolean;
}

export interface PluginStatus {
  powerpoint: OfficeApp;
  wps: OfficeApp;
}

export interface RibbonAction {
  id: string;
  label: string;
  icon?: string;
  action: 'chat' | 'translate' | 'summarize' | 'proofread' | 'layout' | 'settings' | 'help';
}

// ============================================
// IPC Types
// ============================================

export type IpcChannel = 
  | 'app:ready'
  | 'app:quit'
  | 'window:minimize'
  | 'window:maximize'
  | 'window:close'
  | 'tray:show'
  | 'tray:hide'
  | 'settings:get'
  | 'settings:set'
  | 'provider:chat'
  | 'provider:stream'
  | 'provider:validate'
  | 'ppt:generate'
  | 'ppt:export'
  | 'kb:add-document'
  | 'kb:query'
  | 'plugin:install'
  | 'plugin:uninstall'
  | 'plugin:status';

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface UsageStats {
  provider: ProviderType;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
  period: string;
}
