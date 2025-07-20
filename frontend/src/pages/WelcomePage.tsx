import React, { useState, useEffect } from 'react';

import { useAuthStore } from '../store/useAuthStore';
import Logo from '../components/Logo';

interface WelcomePageProps {
  onStartChat: () => void;
  onShowAuth: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onStartChat, onShowAuth }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return '夜深了';
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 25%, #333333 75%, #666666 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* 背景动画元素 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(255,255,255,0.03) 0%, transparent 50%)
        `,
        animation: 'backgroundPulse 8s ease-in-out infinite',
      }} />

      {/* 顶部导航栏 */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Logo size={40} showText={true} animated={true} />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333333',
                }}>
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span style={{
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                }}>
                  {user?.username}
                </span>
              </div>
              <button
                onClick={logout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                退出登录
              </button>
            </>
          ) : (
            <button
              onClick={onShowAuth}
              style={{
                padding: '10px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              登录 / 注册
            </button>
          )}
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
        position: 'relative',
        zIndex: 10,
      }}>
        {/* 时间显示 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px',
          animation: 'fadeInUp 0.8s ease-out 0.2s both',
        }}>
          <div style={{
            fontSize: '72px',
            fontWeight: '200',
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '8px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}>
            {formatTime(currentTime)}
          </div>
          <div style={{
            fontSize: '18px',
            color: '#cccccc',
            fontWeight: '400',
          }}>
            {formatDate(currentTime)}
          </div>
        </div>

        {/* 问候语和主标题 */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
          animation: 'fadeInUp 0.8s ease-out 0.4s both',
        }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 16px 0',
            letterSpacing: '-0.03em',
            lineHeight: '1.1',
          }}>
            {getGreeting()}{isAuthenticated && user ? `, ${user.full_name || user.username}` : ''}
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#cccccc',
            margin: '0 0 8px 0',
            fontWeight: '400',
            lineHeight: '1.5',
          }}>
            欢迎使用 NeuralChat AI 智能对话助手
          </p>
          <p style={{
            fontSize: '16px',
            color: '#999999',
            margin: 0,
            fontWeight: '400',
          }}>
            让我们开始一场有趣的对话吧
          </p>
        </div>

        {/* 功能特点 */}
        <div style={{
          display: 'flex',
          gap: '32px',
          marginBottom: '60px',
          animation: 'fadeInUp 0.8s ease-out 0.6s both',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { icon: '🧠', title: '智能对话', desc: '先进的AI技术' },
            { icon: '⚡', title: '实时响应', desc: '流畅的交互体验' },
            { icon: '🔐', title: '隐私安全', desc: '数据安全保护' },
            { icon: '🎨', title: '个性化', desc: '定制化设置' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                padding: '24px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                minWidth: '160px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '12px',
                animation: 'float 3s ease-in-out infinite',
                animationDelay: `${index * 0.5}s`,
              }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#ffffff',
                margin: '0 0 8px 0',
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#cccccc',
                margin: 0,
                fontWeight: '400',
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 开始对话按钮 */}
        <div style={{
          animation: 'fadeInUp 0.8s ease-out 0.8s both',
        }}>
          <button
            onClick={onStartChat}
            style={{
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
              color: '#000000',
              border: 'none',
              borderRadius: '30px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
              letterSpacing: '0.02em',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
              e.currentTarget.style.boxShadow = '0 16px 48px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(255, 255, 255, 0.2)';
            }}
          >
            开始对话
          </button>
        </div>

        {/* 底部提示 */}
        {!isAuthenticated && (
          <div style={{
            marginTop: '40px',
            animation: 'fadeInUp 0.8s ease-out 1s both',
          }}>
            <p style={{
              fontSize: '14px',
              color: '#999999',
              textAlign: 'center',
              margin: 0,
            }}>
              <span
                onClick={onShowAuth}
                style={{
                  color: '#ffffff',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#cccccc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                }}
              >
                登录或注册
              </span>
              {' '}以保存对话历史和个性化设置
            </p>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes backgroundPulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }
          
          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-8px);
            }
          }
        `}
      </style>
    </div>
  );
};

export default WelcomePage;