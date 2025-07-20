import { create } from 'zustand';
import { ApiService as api } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: any) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  checkAdminStatus: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async (data) => {
    // Login logic here
    return false;
  },
  register: async (data) => {
    try {
      set({ isLoading: true });
      const response = await api.post('/auth/register', data);
      const result = response.data;
      set({ user: result.user, token: result.access_token, isAuthenticated: true, isAdmin: result.user.role === 'admin' });
      localStorage.setItem('neuralchat_token', result.access_token);
      localStorage.setItem('neuralchat_user', JSON.stringify(result.user));
      return true;
    } catch (error) {
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  logout: () => {
    // Logout logic here
  },
  checkAdminStatus: async () => {
    try {
      const response = await api.get('/auth/check-admin');
      return response.data.is_admin;
    } catch (error) {
      return false;
    }
  },
}));
