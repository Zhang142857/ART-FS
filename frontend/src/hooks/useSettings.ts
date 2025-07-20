import { useState, useEffect, useCallback } from 'react';
import { Settings, ModelInfo } from '../types';
import { ApiService } from '../services/api';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [settingsData, modelsData, providersData] = await Promise.all([
        ApiService.getSettings(),
        ApiService.getModels(),
        ApiService.getProviders(),
      ]);

      setSettings(settingsData);
      setModels(modelsData);
      setProviders(providersData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载设置失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSettings = useCallback(async (
    updates: Partial<Settings> & { api_key?: string; base_url?: string }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await ApiService.updateSettings(updates);
      
      if (response.success) {
        // 重新加载设置
        await loadSettings();
        
        // 重新加载配置
        await ApiService.reloadConfig();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新设置失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [loadSettings]);

  const testConnection = useCallback(async () => {
    try {
      setError(null);
      const response = await ApiService.testConnection();
      
      // 如果测试成功且返回了模型列表，更新models状态
      if (response.success && response.data && response.data.models) {
        setModels(response.data.models);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '测试连接失败';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    settings,
    models,
    providers,
    isLoading,
    error,
    updateSettings,
    testConnection,
    reloadSettings: loadSettings,
  };
};