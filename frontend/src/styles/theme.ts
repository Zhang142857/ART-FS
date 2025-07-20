// 现代化设计系统 - 由"设计独裁者"精心打造

export const theme = {
  // 极简主义色彩系统
  colors: {
    // 主色调 - 优雅的蓝色系
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93bbfd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    // 中性色 - 低饱和度灰色系
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    // 功能色
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    // 深色模式专属色
    dark: {
      bg: '#0a0a0a',
      bgSecondary: '#111111',
      bgTertiary: '#1a1a1a',
      border: '#262626',
      borderHover: '#404040',
    },
    // 浅色模式专属色
    light: {
      bg: '#ffffff',
      bgSecondary: '#fafafa',
      bgTertiary: '#f5f5f5',
      border: '#e5e5e5',
      borderHover: '#d4d4d4',
    },
  },
  
  // 字体系统
  typography: {
    fontFamily: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'Menlo, Monaco, Consolas, "Courier New", monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  // 间距系统
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  
  // 圆角系统
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  
  // 阴影系统
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  // 动画系统
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    // 自定义缓动函数
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
    },
  },
  
  // Z-index 层级系统
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
    notification: 1500,
  },
};

// 获取主题色彩的辅助函数
export const getThemeColor = (isDark: boolean) => ({
  bg: isDark ? theme.colors.dark.bg : theme.colors.light.bg,
  bgSecondary: isDark ? theme.colors.dark.bgSecondary : theme.colors.light.bgSecondary,
  bgTertiary: isDark ? theme.colors.dark.bgTertiary : theme.colors.light.bgTertiary,
  text: isDark ? theme.colors.neutral[50] : theme.colors.neutral[900],
  textSecondary: isDark ? theme.colors.neutral[400] : theme.colors.neutral[600],
  textTertiary: isDark ? theme.colors.neutral[500] : theme.colors.neutral[500],
  border: isDark ? theme.colors.dark.border : theme.colors.light.border,
  borderHover: isDark ? theme.colors.dark.borderHover : theme.colors.light.borderHover,
});

export default theme;