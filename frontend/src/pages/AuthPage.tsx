import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Logo from '../components/Logo';
import { useTheme } from '../hooks/useTheme';

interface AuthPageProps {
  onSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register, isLoading } = useAuth();
  const { isDarkMode } = useTheme();
  const isDark = isDarkMode;

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.username.trim()) {
      newErrors.push('用户名不能为空');
    } else if (formData.username.length < 3) {
      newErrors.push('用户名至少需要3个字符');
    }

    if (!isLogin && !formData.email.trim()) {
      newErrors.push('邮箱不能为空');
    } else if (!isLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push('邮箱格式不正确');
    }

    if (!formData.password.trim()) {
      newErrors.push('密码不能为空');
    } else if (formData.password.length < 6) {
      newErrors.push('密码至少需要6个字符');
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.push('密码确认不匹配');
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        success = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name || undefined,
        });
      }

      if (success) {
        console.log('AuthPage: 登录/注册成功，调用onSuccess');
        onSuccess?.();
      } else {
        console.log('AuthPage: 登录/注册失败');
        setErrors([isLogin ? '登录失败，请检查用户名和密码' : '注册失败，请重试']);
      }
    } catch (error) {
      console.error('AuthPage 错误:', error);
      if (error instanceof Error) {
        // 使用从服务器返回的具体错误信息
        setErrors([error.message]);
      } else {
        setErrors(['网络错误，请重试']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // 清除错误
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setErrors([]);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
    });
  };

  const inputStyle = {
    base: {
      width: '100%',
      padding: '14px 16px',
      border: isDark ? '2px solid #1a1a1a' : '2px solid #e5e5e5',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      outline: 'none',
      backgroundColor: isDark ? '#141414' : '#ffffff',
      color: isDark ? '#f0f0f0' : '#0a0a0a',
      fontWeight: '500',
      boxShadow: isDark 
        ? 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
        : 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    focus: {
      borderColor: isDark ? '#3b82f6' : '#2563eb',
      backgroundColor: isDark ? '#1a1a1a' : '#fafafa',
      boxShadow: isDark
        ? '0 0 0 3px rgba(59, 130, 246, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.5)'
        : '0 0 0 3px rgba(37, 99, 235, 0.1), inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    },
    blur: {
      borderColor: isDark ? '#1a1a1a' : '#e5e5e5',
      backgroundColor: isDark ? '#141414' : '#ffffff',
      boxShadow: isDark
        ? 'inset 0 1px 2px rgba(0, 0, 0, 0.5)'
        : 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
    }
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        backgroundColor: isDark ? '#0a0a0a' : '#fafafa',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        transition: 'background-color 0.3s ease',
      }}>
      {/* 左侧装饰 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '40px',
      }}>
        <div style={{
          textAlign: 'center',
          color: isDark ? '#f0f0f0' : '#1a1a1a',
          animation: 'authSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative',
        }}>
          <div style={{
            position: 'relative',
            display: 'inline-block',
          }}>
            <div style={{
              position: 'absolute',
              inset: '-20px',
              background: isDark 
                ? 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
                : 'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
              filter: 'blur(40px)',
              animation: 'authPulse 4s ease-in-out infinite',
            }} />
            <Logo size={120} showText={false} animated={true} />
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            margin: '32px 0 16px 0',
            letterSpacing: '-0.03em',
            color: isDark ? '#f0f0f0' : '#0a0a0a',
          }}>
            NeuralChat
          </h1>
          <p style={{
            fontSize: '18px',
            color: isDark ? '#a0a0a0' : '#6b6b6b',
            margin: 0,
            fontWeight: '400',
            lineHeight: '1.5',
            opacity: 0.8,
          }}>
            智能对话，无限可能
          </p>
        </div>
      </div>

      {/* 右侧表单 */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.02)',
        borderLeft: isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.05)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          animation: 'authSlideIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s backwards',
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px',
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: isDark ? '#f0f0f0' : '#0a0a0a',
              letterSpacing: '-0.02em',
            }}>
              {isLogin ? '欢迎回来' : '加入我们'}
            </h2>
            <p style={{
              fontSize: '16px',
              color: isDark ? '#a0a0a0' : '#6b6b6b',
              margin: 0,
              fontWeight: '300',
            }}>
              {isLogin ? '登录到您的账户继续对话' : '创建账户开始您的AI对话之旅'}
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            {/* 用户名输入 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: isDark ? '#f0f0f0' : '#0a0a0a',
                marginBottom: '8px',
              }}>
                用户名
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                style={inputStyle.base}
                onFocus={(e) => {
                  Object.assign(e.target.style, inputStyle.focus);
                }}
                onBlur={(e) => {
                  Object.assign(e.target.style, inputStyle.blur);
                }}
                placeholder="请输入用户名"
                disabled={isSubmitting || isLoading}
              />
            </div>

            {/* 邮箱输入 (仅注册时显示) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDark ? '#f0f0f0' : '#0a0a0a',
                  marginBottom: '8px',
                }}>
                  邮箱地址
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={inputStyle.base}
                  onFocus={(e) => {
                    Object.assign(e.target.style, inputStyle.focus);
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, inputStyle.blur);
                  }}
                  placeholder="请输入邮箱地址"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            )}

            {/* 全名输入 (仅注册时显示，可选) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDark ? '#f0f0f0' : '#0a0a0a',
                  marginBottom: '8px',
                }}>
                  全名 <span style={{ color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)', fontWeight: '400' }}>(可选)</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  style={inputStyle.base}
                  onFocus={(e) => {
                    Object.assign(e.target.style, inputStyle.focus);
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, inputStyle.blur);
                  }}
                  placeholder="请输入您的全名"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            )}

            {/* 密码输入 */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: isDark ? '#f0f0f0' : '#0a0a0a',
                marginBottom: '8px',
              }}>
                密码
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={inputStyle.base}
                onFocus={(e) => {
                  Object.assign(e.target.style, inputStyle.focus);
                }}
                onBlur={(e) => {
                  Object.assign(e.target.style, inputStyle.blur);
                }}
                placeholder="请输入密码"
                disabled={isSubmitting || isLoading}
              />
            </div>

            {/* 确认密码输入 (仅注册时显示) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: isDark ? '#f0f0f0' : '#0a0a0a',
                  marginBottom: '8px',
                }}>
                  确认密码
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={inputStyle.base}
                  onFocus={(e) => {
                    Object.assign(e.target.style, inputStyle.focus);
                  }}
                  onBlur={(e) => {
                    Object.assign(e.target.style, inputStyle.blur);
                  }}
                  placeholder="请再次输入密码"
                  disabled={isSubmitting || isLoading}
                />
              </div>
            )}

            {/* 错误信息 */}
            {errors.length > 0 && (
              <div style={{
                marginBottom: '20px',
                padding: '12px 16px',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                border: isDark ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                animation: 'errorShake 0.5s ease-in-out',
              }}>
                {errors.map((error, index) => (
                  <div key={index} style={{
                    fontSize: '14px',
                    color: isDark ? '#f87171' : '#dc2626',
                    marginBottom: index < errors.length - 1 ? '4px' : '0',
                  }}>
                    • {error}
                  </div>
                ))}
              </div>
            )}

            {/* 提交按钮 */}
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              style={{
                width: '100%',
                padding: '14px 16px',
                backgroundColor: isSubmitting || isLoading 
                  ? (isDark ? '#1a1a1a' : '#e5e5e5')
                  : (isDark ? '#f0f0f0' : '#0a0a0a'),
                color: isSubmitting || isLoading
                  ? (isDark ? '#6b6b6b' : '#a0a0a0')
                  : (isDark ? '#0a0a0a' : '#fafafa'),
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting || isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                marginBottom: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting && !isLoading) {
                  e.currentTarget.style.backgroundColor = isDark ? '#e5e5e5' : '#1a1a1a';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting && !isLoading) {
                  e.currentTarget.style.backgroundColor = isDark ? '#f0f0f0' : '#0a0a0a';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {isSubmitting || isLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid currentColor',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  {isLogin ? '登录中...' : '注册中...'}
                </div>
              ) : (
                isLogin ? '立即登录' : '创建账户'
              )}
            </button>
          </form>

          {/* 切换登录/注册 */}
          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: '14px',
              color: isDark ? '#a0a0a0' : '#6b6b6b',
            }}>
              {isLogin ? '还没有账户？' : '已有账户？'}
            </span>
            <button
              type="button"
              onClick={switchMode}
              disabled={isSubmitting || isLoading}
              style={{
                background: 'none',
                border: 'none',
                color: isDark ? '#3b82f6' : '#2563eb',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                marginLeft: '8px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                position: 'relative',
                paddingBottom: '2px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = isDark ? '#60a5fa' : '#3b82f6';
                const underline = document.createElement('div');
                underline.style.position = 'absolute';
                underline.style.bottom = '0';
                underline.style.left = '0';
                underline.style.right = '0';
                underline.style.height = '2px';
                underline.style.backgroundColor = e.currentTarget.style.color;
                underline.style.transform = 'scaleX(0)';
                underline.style.transition = 'transform 0.2s ease';
                underline.id = 'auth-underline';
                e.currentTarget.appendChild(underline);
                setTimeout(() => underline.style.transform = 'scaleX(1)', 10);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isDark ? '#3b82f6' : '#2563eb';
                const underline = document.getElementById('auth-underline');
                if (underline) underline.remove();
              }}
            >
              {isLogin ? '立即注册' : '立即登录'}
            </button>
          </div>
        </div>
      </div>
      </div>

      <style>
        {`
          @keyframes authSlideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes authPulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.8;
            }
            50% {
              transform: scale(1.1);
              opacity: 1;
            }
          }
          
          @keyframes errorShake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* 输入框占位符样式 */
          input::placeholder {
            color: ${isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'};
            font-weight: 400;
          }
          
          /* 自定义滚动条 */
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${isDark ? '#0a0a0a' : '#fafafa'};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${isDark ? '#2a2a2a' : '#d4d4d4'};
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? '#404040' : '#a3a3a3'};
          }
        `}
      </style>
    </>
  );
};

export default AuthPage;