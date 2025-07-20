import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import ModelSelector from '../components/ModelSelector';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings, models, isLoading, error, updateSettings, testConnection } = useSettings();
  
  const [formData, setFormData] = useState({
    current_provider: 'siliconflow',
    current_model: 'deepseek-ai/DeepSeek-V2.5',
    max_tokens: undefined as number | undefined,
    api_key: '',
    base_url: '',
  });

  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        current_provider: settings.current_provider,
        current_model: settings.current_model,
        max_tokens: settings.max_tokens,
        api_key: '',
        base_url: '',
      });
    }
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setTestResult(null);
      
      const updates: any = {
        current_provider: formData.current_provider,
        current_model: formData.current_model,
        max_tokens: formData.max_tokens,
      };

      if (formData.api_key) {
        updates.api_key = formData.api_key;
      }

      if (formData.base_url) {
        updates.base_url = formData.base_url;
      }

      await updateSettings(updates);
      setTestResult({ success: true, message: '设置保存成功' });
      
      // 清空API key输入框
      setFormData(prev => ({ ...prev, api_key: '' }));
    } catch (err) {
      setTestResult({ success: false, message: '保存失败' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    const result = await testConnection();
    setTestResult(result);
  };

  if (isLoading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          padding: '40px',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div>加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid #e5e7eb',
      }}>
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f9fafb',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}>
              ⚙️
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              margin: 0,
            }}>
              设置
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              fontSize: '18px',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            ×
          </button>
        </div>

        <div style={{ 
          padding: '32px',
          backgroundColor: '#f8fafc',
          minHeight: '400px',
          overflow: 'auto',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          borderRadius: '0 0 16px 16px',
        }}>
          {error && (
            <div style={{
              backgroundColor: '#fff5f5',
              border: '1px solid #fed7d7',
              color: '#c53030',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: '500',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
            }}>
              🌐 API供应商
            </label>
            <select
              value={formData.current_provider}
              onChange={(e) => handleInputChange('current_provider', e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#111827',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <option value="siliconflow">硅基流动</option>
              <option value="openai">OpenAI</option>
              <option value="simple_api">简易API中转</option>
              <option value="custom">自定义API</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
            }}>
              🤖 模型 ({models.length} 个可用)
            </label>
            <ModelSelector
              value={formData.current_model}
              onChange={(modelId) => handleInputChange('current_model', modelId)}
              provider={formData.current_provider}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
            }}>
              🔑 API Key
            </label>
            <input
              type="password"
              value={formData.api_key}
              onChange={(e) => handleInputChange('api_key', e.target.value)}
              placeholder="输入API Key"
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: '#111827',
                transition: 'all 0.2s ease',
                outline: 'none',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>

          {/* 当选择自定义API或简易API中转时显示Base URL输入框 */}
          {(formData.current_provider === 'custom' || formData.current_provider === 'simple_api') && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}>
                Base URL
              </label>
              <input
                type="text"
                value={formData.base_url}
                onChange={(e) => handleInputChange('base_url', e.target.value)}
                placeholder="https://api.openai.com/v1"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#111827',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1), 0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
              />
              <p style={{
                fontSize: '12px',
                color: '#6b7280',
                marginTop: '6px',
                margin: '6px 0 0 0',
              }}>
                输入OpenAI兼容的API基础URL，例如：https://api.openai.com/v1
              </p>
            </div>
          )}


          {testResult && (
            <div style={{
              backgroundColor: testResult.success ? '#f0fff4' : '#fff5f5',
              border: `1px solid ${testResult.success ? '#9ae6b4' : '#fed7d7'}`,
              color: testResult.success ? '#22543d' : '#c53030',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}>
              {testResult.message}
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end',
          }}>
            <button
              onClick={handleTestConnection}
              disabled={isSaving}
              style={{
                backgroundColor: '#ffffff',
                border: '2px solid #e5e7eb',
                color: '#374151',
                padding: '14px 24px',
                borderRadius: '12px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              🔗 测试连接
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              style={{
                backgroundColor: isSaving ? '#9ca3af' : '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '14px 24px',
                borderRadius: '12px',
                cursor: isSaving ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#2563eb';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.backgroundColor = '#3b82f6';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }
              }}
            >
              {isSaving ? '💾 保存中...' : '💾 保存设置'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
