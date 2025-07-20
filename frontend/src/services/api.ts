import axios from 'axios';
import { ChatRequest, ChatResponse, ModelInfo, Settings, ApiResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 添加请求拦截器以自动包含认证token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('neuralchat_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器处理token过期
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // 尝试刷新token
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`/api/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token } = response.data;
          localStorage.setItem('neuralchat_token', access_token);
          
          // 重新发送原始请求
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // 刷新失败，清除token并跳转到登录页
          localStorage.removeItem('neuralchat_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('neuralchat_user');
          window.location.reload();
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export class ApiService {
  // 聊天相关
  static async chat(request: ChatRequest): Promise<ChatResponse> {
    const response = await apiClient.post<ChatResponse>('/api/chat/', request);
    return response.data;
  }

  static async chatStream(request: ChatRequest): Promise<ReadableStream> {
    const token = localStorage.getItem('neuralchat_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`/api/chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.body!;
  }

  // 模型相关
  static async getModels(): Promise<ModelInfo[]> {
    const response = await apiClient.get<ModelInfo[]>('/api/chat/models');
    return response.data;
  }

  static async reloadConfig(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/api/chat/reload');
    return response.data;
  }

  // 设置相关
  static async getSettings(): Promise<Settings> {
    const response = await apiClient.get<Settings>('/api/settings/');
    return response.data;
  }

  static async updateSettings(settings: Partial<Settings> & { api_key?: string; base_url?: string }): Promise<ApiResponse> {
    const response = await apiClient.put<ApiResponse>('/api/settings/', settings);
    return response.data;
  }

  static async getProviders(): Promise<ApiResponse> {
    const response = await apiClient.get<ApiResponse>('/api/settings/providers');
    return response.data;
  }

  static async testConnection(): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse>('/api/settings/test');
    return response.data;
  }

  // 健康检查
  static async healthCheck(): Promise<any> {
    const response = await apiClient.get('/health');
    return response.data;
  }

  // 聊天会话管理
  static async createChatSession(title?: string): Promise<any> {
    const response = await apiClient.post('/api/auth/sessions/', {
      title: title || '新的对话',
    });
    return response.data;
  }

  static async getChatSessions(): Promise<any[]> {
    const response = await apiClient.get('/api/auth/sessions/');
    return response.data;
  }

  static async getChatSession(sessionId: string): Promise<any> {
    const response = await apiClient.get(`/api/auth/sessions/${sessionId}`);
    return response.data;
  }

  static async updateChatSession(sessionId: string, data: { title?: string }): Promise<any> {
    const response = await apiClient.put(`/api/auth/sessions/${sessionId}`, data);
    return response.data;
  }

  static async deleteChatSession(sessionId: string): Promise<any> {
    const response = await apiClient.delete(`/api/auth/sessions/${sessionId}`);
    return response.data;
  }
}