export const theme = {
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#ffffff',
    text: '#1f2937',
    neutral: {
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    textSecondary: '#6b7280',
    bgSecondary: '#f3f4f6',
    border: '#e5e7eb',
    borderHover: '#d1d5db',
    bgTertiary: '#e5e7eb',
  },
  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px',
  },
  fonts: {
    body: 'Inter, sans-serif',
    heading: 'Inter, sans-serif',
  },
  transitions: {
    base: 'all 0.2s ease-in-out',
    slow: 'all 0.4s ease-in-out',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    modal: 1040,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  typography: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
    },
    fontWeight: {
      normal: 400,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      normal: 1.5,
      relaxed: 1.625,
    },
  },
};

export const getThemeColor = (color: keyof typeof theme.colors) => {
  return theme.colors[color];
};
