import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
}

// 聊天消息类型
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
  provider?: string;
}

// 模型类型
export interface Model {
  id: string;
  name: string;
  provider: string;
  category: string;
  description?: string;
}

// 供应商类型
export interface Provider {
  key: string;
  name: string;
  base_url: string;
  configured: boolean;
}

// 应用状态类型
interface AppState {
  // 用户状态
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  // 聊天状态
  messages: ChatMessage[];
  isTyping: boolean;
  currentModel: string;
  currentProvider: string;
  
  // 模型数据
  models: Model[];
  providers: Provider[];
  modelCategories: Record<string, number>;
  
  // UI状态
  sidebarOpen: boolean;
  settingsOpen: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setTyping: (isTyping: boolean) => void;
  
  setModels: (models: Model[]) => void;
  setProviders: (providers: Provider[]) => void;
  setCurrentModel: (model: string) => void;
  setCurrentProvider: (provider: string) => void;
  
  setSidebarOpen: (open: boolean) => void;
  setSettingsOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      isAuthenticated: false,
      token: null,
      
      messages: [],
      isTyping: false,
      currentModel: 'deepseek-ai/DeepSeek-V2.5',
      currentProvider: 'siliconflow',
      
      models: [],
      providers: [],
      modelCategories: {},
      
      sidebarOpen: true,
      settingsOpen: false,
      isLoading: false,
      error: null,
      
      // 用户相关Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false,
        messages: [],
      }),
      
      // 聊天相关Actions
      addMessage: (message) => {
        const { messages } = get();
        set({ messages: [...messages, message] });
      },
      clearMessages: () => set({ messages: [] }),
      setTyping: (isTyping) => set({ isTyping }),
      
      // 模型相关Actions
      setModels: (models) => {
        // 统计类别
        const categories = models.reduce((acc, model) => {
          const category = model.category || 'Other';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        set({ models, modelCategories: categories });
      },
      setProviders: (providers) => set({ providers }),
      setCurrentModel: (currentModel) => set({ currentModel }),
      setCurrentProvider: (currentProvider) => set({ currentProvider }),
      
      // UI相关Actions
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        currentModel: state.currentModel,
        currentProvider: state.currentProvider,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// 便捷的选择器函数
export const useAuth = () => {
  const { user, isAuthenticated, token, login, logout } = useAppStore();
  return { user, isAuthenticated, token, login, logout };
};

export const useChat = () => {
  const { 
    messages, 
    isTyping, 
    currentModel, 
    currentProvider,
    addMessage, 
    clearMessages, 
    setTyping,
    setCurrentModel,
    setCurrentProvider 
  } = useAppStore();
  
  return { 
    messages, 
    isTyping, 
    currentModel,
    currentProvider,
    addMessage, 
    clearMessages, 
    setTyping,
    setCurrentModel,
    setCurrentProvider
  };
};

export const useModels = () => {
  const { models, providers, modelCategories, setModels, setProviders } = useAppStore();
  return { models, providers, modelCategories, setModels, setProviders };
};

export const useUI = () => {
  const { 
    sidebarOpen, 
    settingsOpen, 
    isLoading, 
    error,
    setSidebarOpen, 
    setSettingsOpen, 
    setLoading, 
    setError 
  } = useAppStore();
  
  return { 
    sidebarOpen, 
    settingsOpen, 
    isLoading, 
    error,
    setSidebarOpen, 
    setSettingsOpen, 
    setLoading, 
    setError 
  };
};