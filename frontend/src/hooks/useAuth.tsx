import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
  role?: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginData) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  checkAdminStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 从localStorage获取存储的token
  useEffect(() => {
    const storedToken = localStorage.getItem('neuralchat_token');
    const storedUser = localStorage.getItem('neuralchat_user');
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem('neuralchat_token');
        localStorage.removeItem('neuralchat_user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('开始登录请求...', data);
      console.log('请求URL:', '/api/auth/login');
      
      // 检查网络连接
      if (!navigator.onLine) {
        throw new Error('网络连接不可用');
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
        mode: 'cors',
        credentials: 'include'
      });

      clearTimeout(timeoutId);
      console.log('登录响应状态:', response.status);
      console.log('登录响应头:', response.headers);

      if (!response.ok) {
        let errorMessage = '登录失败';
        try {
          const errorData = await response.json();
          console.log('登录失败:', errorData);
          errorMessage = errorData.detail || '登录失赅';
        } catch (e) {
          console.error('无法解析错误响应:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('登录成功:', result);
      
      // 存储token和用户信息
      setToken(result.access_token);
      setUser(result.user);
      localStorage.setItem('neuralchat_token', result.access_token);
      localStorage.setItem('neuralchat_user', JSON.stringify(result.user));
      
      console.log('状态更新完成, isAuthenticated将为:', !!(result.user && result.access_token));
      
      return true;
    } catch (error) {
      console.error('Login error详细信息:', error);
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        if (error.name === 'AbortError') {
          console.error('请求超时');
        } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
          console.error('网络连接错误 - 可能的原因:');
          console.error('1. 后端服务器未启动');
          console.error('2. 端口被防火墙阻止');
          console.error('3. 代理设置问题');
          console.error('4. CORS配置问题');
        }
      } else {
        console.error('Unknown error type:', typeof error);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = '注册失败';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || '注册失败';
        } catch (e) {
          console.error('无法解析错误响应:', e);
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      // 存储token和用户信息
      setToken(result.access_token);
      setUser(result.user);
      localStorage.setItem('neuralchat_token', result.access_token);
      localStorage.setItem('neuralchat_user', JSON.stringify(result.user));
      
      return true;
    } catch (error) {
      console.error('Register error:', error);
      
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
      } else {
        console.error('Unknown error type:', typeof error);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('neuralchat_token');
    localStorage.removeItem('neuralchat_user');
  };

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user || !token) return false;
    
    try {
      const response = await fetch('/api/auth/check-admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.is_admin;
      }
      return false;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin',
    checkAdminStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API helper函数，自动包含认证头
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('neuralchat_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 如果URL不是完整URL，则使用相对路径
  const finalUrl = url.startsWith('http') ? url : url;

  return fetch(finalUrl, {
    ...options,
    headers,
  });
};