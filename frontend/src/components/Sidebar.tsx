import React, { useState } from 'react';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';
import { theme, getThemeColor } from '../styles/theme';

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isActive?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onSettingsClick: () => void;
  currentSession?: string;
  onSessionSelect: (sessionId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  onNewChat,
  onSettingsClick,
  currentSession,
  onSessionSelect,
}) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColor(isDarkMode);
  
  const [sessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: '新对话',
      lastMessage: '你好！我可以帮你什么吗？',
      timestamp: new Date(),
      isActive: true,
    },
    {
      id: '2',
      title: 'Python编程问题',
      lastMessage: '如何创建虚拟环境？',
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '3',
      title: 'React开发',
      lastMessage: '组件设计模式',
      timestamp: new Date(Date.now() - 7200000),
    },
  ]);

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return '刚刚';
    if (hours < 24) return `${hours}小时前`;
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const sidebarStyle = {
    position: 'fixed' as const,
    left: isOpen ? '0' : '-320px',
    top: 0,
    width: '320px',
    height: '100vh',
    backgroundColor: colors.bgSecondary,
    transition: theme.transitions.slow,
    zIndex: theme.zIndex.sticky,
    display: 'flex',
    flexDirection: 'column' as const,
    borderRight: `1px solid ${colors.border}`,
    boxShadow: isOpen ? theme.shadows.xl : 'none',
  };

  const newChatButtonStyle = {
    width: '100%',
    background: `linear-gradient(135deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%)`,
    color: '#ffffff',
    border: 'none',
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing[4]} ${theme.spacing[5]}`,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    transition: theme.transitions.base,
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const sessionButtonStyle = (isSelected: boolean) => ({
    width: '100%',
    backgroundColor: isSelected ? colors.bgTertiary : 'transparent',
    color: colors.text,
    border: `1px solid ${isSelected ? colors.border : 'transparent'}`,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing[4],
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: theme.transitions.base,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing[2],
    position: 'relative' as const,
    overflow: 'hidden',
  });

  return (
    <>
      {/* 侧边栏 */}
      <div style={sidebarStyle}>
        {/* 顶部区域 */}
        <div style={{
          padding: theme.spacing[5],
          borderBottom: `1px solid ${colors.border}`,
          background: `linear-gradient(180deg, ${colors.bg} 0%, ${colors.bgSecondary} 100%)`,
        }}>
          <div style={{ marginBottom: theme.spacing[4] }}>
            <Logo size={32} showText={true} animated={true} />
          </div>
          
          <button
            onClick={onNewChat}
            style={newChatButtonStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* 美化的加号图标 */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            新建对话
            
            {/* 悬停时的光效 */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
              transform: 'translate(-50%, -50%) scale(0)',
              transition: 'transform 0.5s ease',
              pointerEvents: 'none',
            }} className="hover-effect" />
          </button>
        </div>

        {/* 对话历史列表 */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: theme.spacing[4],
          position: 'relative',
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: colors.textTertiary,
            padding: `0 ${theme.spacing[2]} ${theme.spacing[3]}`,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: theme.typography.fontWeight.medium,
          }}>
            最近对话
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: theme.spacing[1],
          }}>
            {sessions.map((session, index) => (
              <button
                key={session.id}
                onClick={() => onSessionSelect(session.id)}
                style={{
                  ...sessionButtonStyle(currentSession === session.id),
                  animation: `fadeInUp ${theme.transitions.base} ${index * 50}ms both`,
                }}
                onMouseEnter={(e) => {
                  if (currentSession !== session.id) {
                    e.currentTarget.style.backgroundColor = colors.bgTertiary;
                    e.currentTarget.style.borderColor = colors.border;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentSession !== session.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                {session.isActive && (
                  <div style={{
                    position: 'absolute',
                    top: theme.spacing[3],
                    right: theme.spacing[3],
                    width: '8px',
                    height: '8px',
                    backgroundColor: theme.colors.success,
                    borderRadius: theme.borderRadius.full,
                    boxShadow: `0 0 12px ${theme.colors.success}`,
                    animation: 'glow 2s ease-in-out infinite',
                  }} />
                )}
                
                <div style={{
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: colors.text,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: theme.typography.lineHeight.normal,
                }}>
                  {session.title}
                </div>
                
                <div style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: colors.textSecondary,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  lineHeight: theme.typography.lineHeight.normal,
                }}>
                  {session.lastMessage}
                </div>
                
                <div style={{
                  fontSize: '11px',
                  color: colors.textTertiary,
                  marginTop: theme.spacing[1],
                }}>
                  {formatTime(session.timestamp)}
                </div>
              </button>
            ))}
          </div>
          
          {/* 渐变遮罩效果 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: `linear-gradient(to top, ${colors.bgSecondary}, transparent)`,
            pointerEvents: 'none',
          }} />
        </div>

        {/* 底部设置区 */}
        <div style={{
          padding: theme.spacing[5],
          borderTop: `1px solid ${colors.border}`,
          background: `linear-gradient(180deg, ${colors.bgSecondary} 0%, ${colors.bg} 100%)`,
        }}>
          <button
            onClick={onSettingsClick}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: theme.borderRadius.md,
              padding: `${theme.spacing[3]} ${theme.spacing[5]}`,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing[2],
              transition: theme.transitions.base,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.bgTertiary;
              e.currentTarget.style.borderColor = colors.borderHover;
              e.currentTarget.style.color = colors.text;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.color = colors.textSecondary;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* 设置图标 */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 11.25C10.2426 11.25 11.25 10.2426 11.25 9C11.25 7.75736 10.2426 6.75 9 6.75C7.75736 6.75 6.75 7.75736 6.75 9C6.75 10.2426 7.75736 11.25 9 11.25Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M14.25 11.25C14.1 11.625 14.025 12.075 14.1 12.45L14.85 15.075C14.925 15.375 14.775 15.675 14.475 15.825L12.225 16.875C11.925 17.025 11.625 16.95 11.4 16.725L9.375 14.7C9.225 14.55 8.925 14.475 8.7 14.475C8.475 14.475 8.25 14.55 8.1 14.7L6.075 16.725C5.85 16.95 5.55 17.025 5.25 16.875L3 15.825C2.7 15.675 2.55 15.375 2.625 15.075L3.375 12.45C3.45 12.075 3.375 11.625 3.225 11.25L1.65 8.475C1.5 8.175 1.575 7.875 1.875 7.725L4.125 6.675C4.425 6.525 4.65 6.225 4.725 5.925L5.475 3.3C5.55 3 5.85 2.775 6.15 2.85L8.775 3.6C9.075 3.675 9.525 3.675 9.9 3.6L12.525 2.85C12.825 2.775 13.125 3 13.2 3.3L13.95 5.925C14.025 6.225 14.25 6.525 14.55 6.675L16.8 7.725C17.1 7.875 17.175 8.175 17.025 8.475L15.45 11.25C15.3 11.625 14.4 11.625 14.25 11.25Z" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            设置
          </button>
        </div>
      </div>

      {/* 遮罩层（移动端） */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: theme.zIndex.sticky - 1,
            opacity: isOpen ? 1 : 0,
            transition: theme.transitions.base,
            backdropFilter: 'blur(8px)',
          }}
          onClick={onToggle}
        />
      )}
      
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes glow {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1);
            }
          }
          
          button:hover .hover-effect {
            transform: translate(-50%, -50%) scale(1) !important;
          }
          
          /* 自定义滚动条 */
          ::-webkit-scrollbar {
            width: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${colors.border};
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${colors.borderHover};
          }
        `}
      </style>
    </>
  );
};

export default Sidebar;