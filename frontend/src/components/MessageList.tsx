import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import Logo from './Logo';
import WelcomeScreen from './WelcomeScreen';
import MarkdownRenderer from './MarkdownRenderer';
import { useTheme } from '../hooks/useTheme';
import { theme, getThemeColor } from '../styles/theme';
import { useAuth } from '../hooks/useAuth';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();
  const colors = getThemeColor(isDarkMode);
  const { user } = useAuth();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <div style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: colors.bg,
        position: 'relative',
        transition: theme.transitions.base,
      }}>
        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          minHeight: '100%',
        }}>
          {messages.length === 0 ? (
            <WelcomeScreen userName={user?.full_name || user?.username} />
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  animation: `slideInMessage 0.4s ease-out ${index * 0.1}s both`,
                  opacity: 0,
                }}
              >
                {/* 头像 */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: message.role === 'user' 
                    ? `linear-gradient(135deg, ${theme.colors.neutral[700]} 0%, ${theme.colors.neutral[600]} 100%)`
                    : `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  flexShrink: 0,
                  boxShadow: theme.shadows.md,
                  transition: theme.transitions.base,
                  cursor: 'pointer',
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                >
                  {message.role === 'user' ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" fill="currentColor"/>
                      <path d="M12 14C8.68629 14 6 16.6863 6 20V21H18V20C18 16.6863 15.3137 14 12 14Z" fill="currentColor"/>
                    </svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                      <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>

                {/* 消息内容 */}
                <div style={{
                  flex: 1,
                  minWidth: 0,
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    <span style={{
                      fontSize: theme.typography.fontSize.base,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: colors.text,
                    }}>
                      {message.role === 'user' ? '你' : 'NeuralChat'}
                    </span>
                    <span style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: colors.textSecondary,
                      backgroundColor: colors.bgSecondary,
                      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                      borderRadius: theme.borderRadius.full,
                    }}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  
                  <div style={{
                    backgroundColor: message.role === 'user' ? colors.bgSecondary : 'transparent',
                    padding: message.role === 'user' ? `${theme.spacing[4]} ${theme.spacing[5]}` : '0',
                    borderRadius: message.role === 'user' ? theme.borderRadius.lg : '0',
                    border: message.role === 'user' ? `1px solid ${colors.border}` : 'none',
                    fontSize: theme.typography.fontSize.base,
                    lineHeight: theme.typography.lineHeight.relaxed,
                    color: colors.text,
                    wordBreak: 'break-word',
                    fontWeight: theme.typography.fontWeight.normal,
                    position: 'relative',
                    transition: theme.transitions.base,
                  }}
                  onMouseEnter={(e) => {
                    if (message.role === 'user') {
                      e.currentTarget.style.backgroundColor = colors.bgTertiary;
                      e.currentTarget.style.borderColor = colors.borderHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (message.role === 'user') {
                      e.currentTarget.style.backgroundColor = colors.bgSecondary;
                      e.currentTarget.style.borderColor = colors.border;
                    }
                  }}
                  >
                    {message.role === 'user' ? (
                      <div style={{ whiteSpace: 'pre-wrap' }}>
                        {message.content}
                      </div>
                    ) : (
                      <MarkdownRenderer content={message.content} />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
              animation: 'slideInMessage 0.4s ease-out',
            }}>
              {/* AI头像 */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: theme.typography.fontSize.lg,
                flexShrink: 0,
                boxShadow: theme.shadows.md,
                animation: 'aiThinking 2s ease-in-out infinite',
                color: '#ffffff',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>

              {/* 加载指示器 */}
              <div style={{
                flex: 1,
                minWidth: 0,
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px',
                }}>
                  <span style={{
                    fontSize: theme.typography.fontSize.base,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: colors.text,
                  }}>
                    NeuralChat
                  </span>
                  <span style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: colors.textSecondary,
                    backgroundColor: colors.bgSecondary,
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                    borderRadius: theme.borderRadius.full,
                    animation: 'textPulse 1.5s ease-in-out infinite',
                  }}>
                    正在思考...
                  </span>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[4]} 0`,
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: theme.colors.primary[500],
                    borderRadius: '50%',
                    animation: 'typingDots 1.4s ease-in-out infinite',
                  }} />
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: theme.colors.primary[500],
                    borderRadius: '50%',
                    animation: 'typingDots 1.4s ease-in-out infinite 0.2s',
                  }} />
                  <div style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: theme.colors.primary[500],
                    borderRadius: '50%',
                    animation: 'typingDots 1.4s ease-in-out infinite 0.4s',
                  }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={endRef} />
        </div>
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
          
          @keyframes slideInMessage {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes shine {
            0% { transform: translateX(-100%) skewX(-20deg); }
            70% { transform: translateX(-100%) skewX(-20deg); }
            100% { transform: translateX(200%) skewX(-20deg); }
          }
          
          @keyframes typingDots {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-10px);
              opacity: 1;
            }
          }
          
          @keyframes aiThinking {
            0%, 100% {
              transform: scale(1);
              box-shadow: ${theme.shadows.md};
            }
            50% {
              transform: scale(1.05);
              box-shadow: ${theme.shadows.lg};
            }
          }
          
          @keyframes textPulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
          }
        `}
      </style>
    </>
  );
};

export default MessageList;