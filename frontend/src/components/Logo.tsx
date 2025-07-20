import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 32, showText = true, animated = true }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: showText ? '12px' : '0',
    }}>
      {/* 现代化AI Logo - 告别"丑陋至极"的旧设计！ */}
      <div style={{
        width: size,
        height: size,
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.15))',
      }}
      onMouseEnter={(e) => {
        if (animated) {
          e.currentTarget.style.transform = 'scale(1.08) rotate(2deg)';
          e.currentTarget.style.filter = 'drop-shadow(0 8px 24px rgba(59, 130, 246, 0.25))';
        }
      }}
      onMouseLeave={(e) => {
        if (animated) {
          e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
          e.currentTarget.style.filter = 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.15))';
        }
      }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
          <defs>
            {/* 现代渐变定义 */}
            <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#1d4ed8" />
              <stop offset="100%" stopColor="#1e40af" />
            </linearGradient>
            
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0891b2" />
            </linearGradient>
            
            <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>

            {/* 发光效果 */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* 主背景圆 - 现代渐变 */}
          <circle cx="100" cy="100" r="85" 
                  fill="url(#primaryGradient)" 
                  opacity="0.95"/>
          
          {/* 内层装饰圆 */}
          <circle cx="100" cy="100" r="75" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.2)" 
                  strokeWidth="1"/>
          
          {/* AI神经网络节点 */}
          <g filter="url(#glow)">
            {/* 中心节点 */}
            <circle cx="100" cy="100" r="8" fill="white" opacity="0.9"/>
            
            {/* 周围节点 */}
            <circle cx="75" cy="85" r="5" fill="url(#accentGradient)"/>
            <circle cx="125" cy="85" r="5" fill="url(#accentGradient)"/>
            <circle cx="75" cy="115" r="5" fill="url(#neuralGradient)"/>
            <circle cx="125" cy="115" r="5" fill="url(#neuralGradient)"/>
            
            {/* 连接线 - 表示神经网络 */}
            <path d="M100 100 L75 85 M100 100 L125 85 M100 100 L75 115 M100 100 L125 115" 
                  stroke="white" 
                  strokeWidth="2" 
                  opacity="0.7"
                  strokeLinecap="round"/>
          </g>
          
          {/* 聊天气泡 - 现代设计 */}
          <g transform="translate(130, 65)">
            <path d="M0 15 Q0 0 15 0 L35 0 Q50 0 50 15 L50 25 Q50 40 35 40 L20 40 L10 50 L15 40 Q0 40 0 25 Z" 
                  fill="white" 
                  opacity="0.9"
                  filter="url(#glow)"/>
            
            {/* 气泡内的点点 */}
            <circle cx="15" cy="20" r="2.5" fill="url(#primaryGradient)"/>
            <circle cx="25" cy="20" r="2.5" fill="url(#accentGradient)"/>
            <circle cx="35" cy="20" r="2.5" fill="url(#neuralGradient)"/>
          </g>
          
          {/* 装饰性光环 */}
          <circle cx="100" cy="100" r="90" 
                  fill="none" 
                  stroke="url(#primaryGradient)" 
                  strokeWidth="2" 
                  opacity="0.3"
                  strokeDasharray="5,5">
            <animateTransform 
              attributeName="transform"
              attributeType="XML"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="20s"
              repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      
      {/* 现代化文字设计 */}
      {showText && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
        }}>
          <span style={{
            fontSize: size * 0.7,
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            lineHeight: '1',
            letterSpacing: '-0.03em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
          }}>
            NeuralChat
          </span>
          <span style={{
            fontSize: size * 0.25,
            background: 'linear-gradient(90deg, #6b7280 0%, #374151 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            lineHeight: '1',
            marginTop: '2px',
            fontWeight: '600',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            AI 智能对话
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;