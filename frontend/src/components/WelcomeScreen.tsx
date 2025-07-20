import React from 'react';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';
import { theme, getThemeColor } from '../styles/theme';

interface WelcomeScreenProps {
  userName?: string;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ userName }) => {
  const { isDarkMode } = useTheme();
  const colors = getThemeColor(isDarkMode);

  const suggestions = [
    {
      icon: '💡',
      title: '创意写作',
      prompt: '帮我写一个关于未来城市的科幻故事开头',
    },
    {
      icon: '🧑‍💻',
      title: '编程助手',
      prompt: '解释一下React hooks的工作原理',
    },
    {
      icon: '📊',
      title: '数据分析',
      prompt: '如何用Python进行数据可视化？',
    },
    {
      icon: '🎨',
      title: '设计灵感',
      prompt: '给我一些极简主义网页设计的建议',
    },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100%',
      padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
      paddingBottom: theme.spacing[8],
      animation: 'welcomeFadeIn 0.8s ease-out',
      overflow: 'auto',
    }}>
      {/* Logo区域 - 压缩空间 */}
      <div style={{
        marginTop: theme.spacing[6],
        marginBottom: theme.spacing[6],
        position: 'relative',
        flexShrink: 0,
      }}>
        {/* 背景光晕效果 - 缩小 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '120px',
          height: '120px',
          background: isDarkMode
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          filter: 'blur(40px)',
          transform: 'translate(-50%, -50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }} />
        
        <div style={{
          position: 'relative',
          animation: 'float 6s ease-in-out infinite',
        }}>
          <Logo size={75} showText={false} animated={true} />
        </div>
      </div>

      {/* 欢迎文字 - 压缩字体和间距 */}
      <h1 style={{
        fontSize: theme.typography.fontSize['2xl'],
        fontWeight: theme.typography.fontWeight.bold,
        color: colors.text,
        marginBottom: theme.spacing[2],
        letterSpacing: '-0.02em',
        background: `linear-gradient(135deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[400]} 100%)`,
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        textAlign: 'center',
        flexShrink: 0,
      }}>
        {getGreeting()} {userName || '朋友'}
      </h1>

      <p style={{
        fontSize: theme.typography.fontSize.base,
        color: colors.textSecondary,
        marginBottom: theme.spacing[6],
        maxWidth: '550px',
        textAlign: 'center',
        lineHeight: theme.typography.lineHeight.normal,
        flexShrink: 0,
      }}>
        我是您的AI助手，可以帮助您进行创意写作、编程、数据分析等各种任务。让我们开始今天的对话吧！
      </p>

      {/* 快捷建议卡片 - 优化网格布局 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: theme.spacing[3],
        width: '100%',
        maxWidth: '760px',
        flexGrow: 1,
        alignContent: 'start',
      }}>
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            style={{
              backgroundColor: colors.bgSecondary,
              border: `1px solid ${colors.border}`,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[4],
              textAlign: 'left',
              cursor: 'pointer',
              transition: theme.transitions.base,
              animation: `slideUp ${theme.transitions.base} ${index * 100}ms both`,
              position: 'relative',
              overflow: 'hidden',
              height: 'fit-content',
              minHeight: '120px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = theme.colors.primary[500];
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => {
              // 这里可以触发发送消息
              const input = document.querySelector('textarea');
              if (input) {
                input.value = suggestion.prompt;
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }}
          >
            {/* 图标 - 缩小 */}
            <div style={{
              fontSize: '24px',
              marginBottom: theme.spacing[2],
              animation: 'bounce 2s ease-in-out infinite',
              animationDelay: `${index * 200}ms`,
            }}>
              {suggestion.icon}
            </div>

            {/* 标题 */}
            <h3 style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: colors.text,
              marginBottom: theme.spacing[1],
            }}>
              {suggestion.title}
            </h3>

            {/* 描述 - 缩小字体 */}
            <p style={{
              fontSize: theme.typography.fontSize.xs,
              color: colors.textSecondary,
              lineHeight: theme.typography.lineHeight.normal,
            }}>
              {suggestion.prompt}
            </p>

            {/* 悬停时的光效 */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              transition: 'left 0.5s ease',
            }} className="shimmer" />
          </button>
        ))}
      </div>

      {/* 底部提示 - 缩小间距 */}
      <div style={{
        marginTop: theme.spacing[6],
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        color: colors.textTertiary,
        fontSize: theme.typography.fontSize.xs,
        animation: 'fadeIn 1s ease-out 0.8s both',
        flexShrink: 0,
      }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
        </svg>
        按下回车或点击上方卡片开始对话
      </div>

      <style>
        {`
          @keyframes welcomeFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes pulse {
            0%, 100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 0.8;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 0.4;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          button:hover .shimmer {
            left: 100% !important;
          }
        `}
      </style>
    </div>
  );
};

// 获取问候语
function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return '早上好，';
  } else if (hour >= 12 && hour < 18) {
    return '下午好，';
  } else if (hour >= 18 && hour < 22) {
    return '晚上好，';
  } else {
    return '深夜好，';
  }
}

export default WelcomeScreen;