import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { useThemeStore } from '../../store/useThemeStore';

// Button 变体类型
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      className = '',
      style,
      ...props
    },
    ref
  ) => {
    const { currentTheme } = useThemeStore();

    // 尺寸样式
    const sizeStyles = {
      sm: {
        padding: '8px 16px',
        fontSize: '14px',
        borderRadius: '8px',
        minHeight: '32px',
      },
      md: {
        padding: '12px 20px',
        fontSize: '14px',
        borderRadius: '10px',
        minHeight: '40px',
      },
      lg: {
        padding: '16px 24px',
        fontSize: '16px',
        borderRadius: '12px',
        minHeight: '48px',
      },
    };

    // 变体样式
    const getVariantStyles = (variant: ButtonVariant) => {
      const { colors } = currentTheme;
      
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: colors.brand.primary,
            color: colors.text.inverse,
            border: `1px solid ${colors.brand.primary}`,
            ':hover': {
              backgroundColor: colors.brand.secondary,
              borderColor: colors.brand.secondary,
            },
          };
        case 'secondary':
          return {
            backgroundColor: colors.background.tertiary,
            color: colors.text.primary,
            border: `1px solid ${colors.border.primary}`,
            ':hover': {
              backgroundColor: colors.border.secondary,
            },
          };
        case 'outline':
          return {
            backgroundColor: 'transparent',
            color: colors.brand.primary,
            border: `1px solid ${colors.brand.primary}`,
            ':hover': {
              backgroundColor: colors.brand.primary,
              color: colors.text.inverse,
            },
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: colors.text.primary,
            border: '1px solid transparent',
            ':hover': {
              backgroundColor: colors.background.tertiary,
            },
          };
        case 'danger':
          return {
            backgroundColor: colors.status.error,
            color: colors.text.inverse,
            border: `1px solid ${colors.status.error}`,
            ':hover': {
              backgroundColor: '#dc2626',
              borderColor: '#dc2626',
            },
          };
        default:
          return {};
      }
    };

    const variantStyles = getVariantStyles(variant);
    const isDisabled = disabled || loading;

    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontWeight: '600',
      textAlign: 'center',
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: currentTheme.transitions.normal,
      outline: 'none',
      textDecoration: 'none',
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden',
      width: fullWidth ? '100%' : 'auto',
      opacity: isDisabled ? 0.6 : 1,
      boxShadow: currentTheme.shadows.small,
      ...sizeStyles[size],
      ...variantStyles,
      ...style,
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      
      const hoverStyles = variantStyles[':hover' as keyof typeof variantStyles] as any;
      if (hoverStyles) {
        Object.assign(e.currentTarget.style, hoverStyles);
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = currentTheme.shadows.medium;
      }
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      
      Object.assign(e.currentTarget.style, variantStyles);
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = currentTheme.shadows.small;
    };

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.outline = `2px solid ${currentTheme.colors.border.focus}`;
      e.currentTarget.style.outlineOffset = '2px';
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      e.currentTarget.style.outline = 'none';
    };

    return (
      <button
        ref={ref}
        style={baseStyles}
        disabled={isDisabled}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={className}
        {...props}
      >
        {loading && (
          <div
            style={{
              width: '16px',
              height: '16px',
              border: '2px solid transparent',
              borderTop: `2px solid ${currentTheme.colors.text.inverse}`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
        )}
        
        {!loading && leftIcon && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {leftIcon}
          </span>
        )}
        
        <span style={{ 
          display: 'flex', 
          alignItems: 'center',
          opacity: loading ? 0.7 : 1,
        }}>
          {children}
        </span>
        
        {!loading && rightIcon && (
          <span style={{ display: 'flex', alignItems: 'center' }}>
            {rightIcon}
          </span>
        )}
        
        {/* CSS动画样式 */}
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;