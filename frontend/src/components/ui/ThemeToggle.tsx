import React from 'react';
import { useThemeStore } from '../../store/useThemeStore';

interface ThemeToggleProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  size = 'md', 
  className = '',
  style 
}) => {
  const { isDarkMode, currentTheme, toggleTheme } = useThemeStore();

  const sizeConfig = {
    sm: { width: '40px', height: '22px', circleSize: '18px', iconSize: '12px' },
    md: { width: '50px', height: '26px', circleSize: '22px', iconSize: '14px' },
    lg: { width: '60px', height: '32px', circleSize: '28px', iconSize: '16px' },
  };

  const config = sizeConfig[size];

  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: config.width,
    height: config.height,
    backgroundColor: isDarkMode ? currentTheme.colors.brand.primary : currentTheme.colors.border.secondary,
    borderRadius: '50px',
    cursor: 'pointer',
    transition: currentTheme.transitions.normal,
    border: `2px solid ${currentTheme.colors.border.primary}`,
    boxShadow: currentTheme.shadows.small,
    ...style,
  };

  const circleStyles: React.CSSProperties = {
    position: 'absolute',
    top: '2px',
    left: isDarkMode ? `calc(100% - ${config.circleSize} - 2px)` : '2px',
    width: config.circleSize,
    height: config.circleSize,
    backgroundColor: currentTheme.colors.background.primary,
    borderRadius: '50%',
    transition: currentTheme.transitions.normal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: config.iconSize,
    boxShadow: currentTheme.shadows.small,
  };

  const handleToggle = () => {
    toggleTheme();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = currentTheme.shadows.medium;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = currentTheme.shadows.small;
  };

  return (
    <div
      style={containerStyles}
      className={className}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="switch"
      aria-checked={isDarkMode}
      aria-label={`切换到${isDarkMode ? '亮色' : '暗色'}主题`}
      tabIndex={0}
    >
      <div style={circleStyles}>
        {isDarkMode ? '🌙' : '☀️'}
      </div>
      
      {/* 背景图标 */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: isDarkMode ? '6px' : 'calc(100% - 20px)',
          transform: 'translateY(-50%)',
          fontSize: config.iconSize,
          color: currentTheme.colors.text.inverse,
          opacity: 0.7,
          transition: currentTheme.transitions.normal,
          pointerEvents: 'none',
        }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </div>
    </div>
  );
};

export default ThemeToggle;