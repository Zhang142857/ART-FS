import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 主题类型定义
export interface Theme {
  name: 'light' | 'dark';
  colors: {
    // 背景色
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
      modal: string;
    };
    // 文本色
    text: {
      primary: string;
      secondary: string;
      muted: string;
      inverse: string;
    };
    // 边框色
    border: {
      primary: string;
      secondary: string;
      focus: string;
    };
    // 状态色
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    // 品牌色
    brand: {
      primary: string;
      secondary: string;
      accent: string;
    };
    // 代码高亮
    code: {
      background: string;
      text: string;
      highlight: string;
    };
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
    modal: string;
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
}

// 亮色主题
const lightTheme: Theme = {
  name: 'light',
  colors: {
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      modal: 'rgba(0, 0, 0, 0.5)',
    },
    text: {
      primary: '#1e293b',
      secondary: '#475569',
      muted: '#64748b',
      inverse: '#ffffff',
    },
    border: {
      primary: '#e2e8f0',
      secondary: '#cbd5e1',
      focus: '#3b82f6',
    },
    status: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    brand: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#8b5cf6',
    },
    code: {
      background: '#f8fafc',
      text: '#334155',
      highlight: '#e0e7ff',
    },
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.15)',
    large: '0 10px 25px rgba(0, 0, 0, 0.2)',
    modal: '0 20px 60px rgba(0, 0, 0, 0.3)',
  },
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
};

// 暗色主题
const darkTheme: Theme = {
  name: 'dark',
  colors: {
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      modal: 'rgba(0, 0, 0, 0.8)',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#e2e8f0',
      muted: '#94a3b8',
      inverse: '#0f172a',
    },
    border: {
      primary: '#374151',
      secondary: '#4b5563',
      focus: '#60a5fa',
    },
    status: {
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171',
      info: '#60a5fa',
    },
    brand: {
      primary: '#60a5fa',
      secondary: '#3b82f6',
      accent: '#a78bfa',
    },
    code: {
      background: '#1e1e1e',
      text: '#d4d4d4',
      highlight: '#264f78',
    },
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.4)',
    large: '0 10px 25px rgba(0, 0, 0, 0.5)',
    modal: '0 20px 60px rgba(0, 0, 0, 0.7)',
  },
  transitions: {
    fast: 'all 0.15s ease',
    normal: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
};

// 主题状态接口
interface ThemeState {
  isDarkMode: boolean;
  currentTheme: Theme;
  toggleTheme: () => void;
  setDarkMode: (isDark: boolean) => void;
}

// 主题状态管理
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      currentTheme: lightTheme,
      
      toggleTheme: () => {
        const { isDarkMode } = get();
        const newIsDarkMode = !isDarkMode;
        set({
          isDarkMode: newIsDarkMode,
          currentTheme: newIsDarkMode ? darkTheme : lightTheme,
        });
      },
      
      setDarkMode: (isDark: boolean) => {
        set({
          isDarkMode: isDark,
          currentTheme: isDark ? darkTheme : lightTheme,
        });
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);

// 主题工具函数
export const getTheme = () => useThemeStore.getState().currentTheme;
export const isDarkMode = () => useThemeStore.getState().isDarkMode;