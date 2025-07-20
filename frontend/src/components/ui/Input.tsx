import React, { InputHTMLAttributes, forwardRef, useState } from 'react';
import { useThemeStore } from '../../store/useThemeStore';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'outline' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      variant = 'outline',
      disabled,
      className = '',
      style,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const { currentTheme } = useThemeStore();
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: fullWidth ? '100%' : 'auto',
      ...style,
    };

    const labelStyles: React.CSSProperties = {
      fontSize: '14px',
      fontWeight: '600',
      color: hasError ? currentTheme.colors.status.error : currentTheme.colors.text.primary,
      marginBottom: '2px',
    };

    const inputWrapperStyles: React.CSSProperties = {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    };

    const getInputStyles = (): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {
        width: '100%',
        padding: leftIcon || rightIcon ? '12px 40px' : '12px 16px',
        paddingLeft: leftIcon ? '40px' : '16px',
        paddingRight: rightIcon ? '40px' : '16px',
        fontSize: '14px',
        fontFamily: 'inherit',
        borderRadius: '10px',
        transition: currentTheme.transitions.normal,
        outline: 'none',
        backgroundColor: variant === 'filled' 
          ? currentTheme.colors.background.tertiary 
          : currentTheme.colors.background.primary,
        color: currentTheme.colors.text.primary,
        border: variant === 'outline' 
          ? `2px solid ${hasError ? currentTheme.colors.status.error : isFocused ? currentTheme.colors.border.focus : currentTheme.colors.border.primary}`
          : 'none',
        boxShadow: isFocused 
          ? `0 0 0 3px ${hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)'}`
          : currentTheme.shadows.small,
      };

      if (disabled) {
        baseStyles.opacity = 0.6;
        baseStyles.cursor = 'not-allowed';
        baseStyles.backgroundColor = currentTheme.colors.background.secondary;
      }

      return baseStyles;
    };

    const iconStyles: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      color: hasError ? currentTheme.colors.status.error : currentTheme.colors.text.muted,
      fontSize: '16px',
      pointerEvents: 'none',
      zIndex: 1,
    };

    const leftIconStyles: React.CSSProperties = {
      ...iconStyles,
      left: '12px',
    };

    const rightIconStyles: React.CSSProperties = {
      ...iconStyles,
      right: '12px',
    };

    const helperTextStyles: React.CSSProperties = {
      fontSize: '12px',
      color: hasError ? currentTheme.colors.status.error : currentTheme.colors.text.muted,
      marginTop: '2px',
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div style={containerStyles} className={className}>
        {label && (
          <label style={labelStyles}>
            {label}
            {props.required && (
              <span style={{ color: currentTheme.colors.status.error, marginLeft: '2px' }}>
                *
              </span>
            )}
          </label>
        )}
        
        <div style={inputWrapperStyles}>
          {leftIcon && (
            <span style={leftIconStyles}>
              {leftIcon}
            </span>
          )}
          
          <input
            ref={ref}
            type={type}
            disabled={disabled}
            style={getInputStyles()}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
          
          {rightIcon && (
            <span style={rightIconStyles}>
              {rightIcon}
            </span>
          )}
        </div>
        
        {(error || helperText) && (
          <span style={helperTextStyles}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;