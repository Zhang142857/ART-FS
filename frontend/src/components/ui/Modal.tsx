import React, { useEffect, useRef } from 'react';
import { useThemeStore } from '../../store/useThemeStore';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  footer,
  className = '',
  style,
}) => {
  const { currentTheme } = useThemeStore();
  const modalRef = useRef<HTMLDivElement>(null);

  // 尺寸配置
  const sizeConfig = {
    sm: { maxWidth: '400px' },
    md: { maxWidth: '600px' },
    lg: { maxWidth: '800px' },
    xl: { maxWidth: '1200px' },
  };

  // 处理ESC键关闭
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 焦点管理
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const overlayStyles: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: currentTheme.colors.background.modal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(4px)',
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out',
  };

  const modalStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.background.primary,
    borderRadius: '16px',
    boxShadow: currentTheme.shadows.modal,
    border: `1px solid ${currentTheme.colors.border.primary}`,
    width: '100%',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'slideIn 0.3s ease-out',
    outline: 'none',
    ...sizeConfig[size],
    ...style,
  };

  const headerStyles: React.CSSProperties = {
    padding: '24px',
    borderBottom: `1px solid ${currentTheme.colors.border.primary}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: currentTheme.colors.background.secondary,
    borderRadius: '16px 16px 0 0',
  };

  const titleStyles: React.CSSProperties = {
    fontSize: '20px',
    fontWeight: '600',
    color: currentTheme.colors.text.primary,
    margin: 0,
  };

  const closeButtonStyles: React.CSSProperties = {
    backgroundColor: currentTheme.colors.background.tertiary,
    border: 'none',
    borderRadius: '8px',
    width: '32px',
    height: '32px',
    fontSize: '18px',
    color: currentTheme.colors.text.muted,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: currentTheme.transitions.fast,
  };

  const contentStyles: React.CSSProperties = {
    padding: '24px',
    flex: 1,
    overflowY: 'auto',
    color: currentTheme.colors.text.primary,
    lineHeight: '1.6',
  };

  const footerStyles: React.CSSProperties = {
    padding: '16px 24px',
    borderTop: `1px solid ${currentTheme.colors.border.primary}`,
    backgroundColor: currentTheme.colors.background.secondary,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    borderRadius: '0 0 16px 16px',
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = currentTheme.colors.border.secondary;
    e.currentTarget.style.color = currentTheme.colors.text.primary;
  };

  const handleCloseButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = currentTheme.colors.background.tertiary;
    e.currentTarget.style.color = currentTheme.colors.text.muted;
  };

  return (
    <>
      {/* CSS动画 */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from { 
              opacity: 0;
              transform: scale(0.95) translateY(-20px);
            }
            to { 
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>

      <div style={overlayStyles} onClick={handleOverlayClick}>
        <div
          ref={modalRef}
          style={modalStyles}
          className={className}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div style={headerStyles}>
              {title && (
                <h2 id="modal-title" style={titleStyles}>
                  {title}
                </h2>
              )}
              {showCloseButton && (
                <button
                  style={closeButtonStyles}
                  onClick={onClose}
                  onMouseEnter={handleCloseButtonHover}
                  onMouseLeave={handleCloseButtonLeave}
                  aria-label="关闭弹窗"
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div style={contentStyles}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div style={footerStyles}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Modal;