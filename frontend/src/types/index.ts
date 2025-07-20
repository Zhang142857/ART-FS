export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  messages: Message[];
  model?: string;
  stream?: boolean;
  max_tokens?: number;
  session_id?: string;
}

export interface ChatResponse {
  content: string;
  model: string;
  finish_reason?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description?: string;
  category?: string;
}

export interface ProviderConfig {
  name: string;
  api_key: string;
  base_url: string;
  models: string[];
}

export interface Settings {
  current_provider: string;
  current_model: string;
  max_tokens?: number;
  providers: Record<string, ProviderConfig>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}