import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const axiosInstance = axios.create({
  baseURL: '/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const ApiService = {
  post: axiosInstance.post,
  get: axiosInstance.get,
  getChatSession: (sessionId: string) => {
    return axiosInstance.get(`/chat/sessions/${sessionId}`);
  },
  createChatSession: (title?: string) => {
    return axiosInstance.post('/chat/sessions', { title });
  },
  chatStream: (request: any) => {
    return axiosInstance.post('/chat/stream', request, { responseType: 'stream' });
  },
  getSettings: () => {
    return axiosInstance.get('/settings');
  },
  getModels: () => {
    return axiosInstance.get('/models');
  },
  getProviders: () => {
    return axiosInstance.get('/providers');
  },
  updateSettings: (updates: any) => {
    return axiosInstance.put('/settings', updates);
  },
  testConnection: () => {
    return axiosInstance.post('/settings/test');
  },
  reloadConfig: () => {
    return axiosInstance.post('/settings/reload');
  },
};