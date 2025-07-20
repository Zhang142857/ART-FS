import React, { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, isLoading, onStop }) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = '56px';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '56px';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 56), 200)}px`;
    }
  }, [message]);

  return (
    <div style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      padding: '24px',
      position: 'relative',
    }}>
      <form onSubmit={handleSubmit} style={{
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          position: 'relative',
          backgroundColor: '#ffffff',
          border: `2px solid ${isFocused ? '#000000' : '#e8e8e8'}`,
          borderRadius: '24px',
          transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          overflow: 'hidden',
          boxShadow: isFocused 
            ? '0 8px 32px rgba(0, 0, 0, 0.12)' 
            : '0 4px 16px rgba(0, 0, 0, 0.08)',
          transform: isFocused ? 'translateY(-2px)' : 'translateY(0)',
        }}>
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="输入您的问题..."
            disabled={isLoading}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              resize: 'none',
              backgroundColor: 'transparent',
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#1a1a1a',
              padding: '18px 80px 18px 24px',
              minHeight: '56px',
              maxHeight: '200px',
              overflow: 'auto',
              fontFamily: 'inherit',
              fontWeight: '400',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            rows={1}
          />
          
          {/* 发送/停止按钮 */}
          <div style={{
            position: 'absolute',
            right: '8px',
            bottom: '8px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                style={{
                  backgroundColor: '#333333',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: '70px',
                  justifyContent: 'center',
                  animation: 'buttonPulse 2s ease-in-out infinite',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <span style={{ fontSize: '14px' }}>⏹</span>
                停止
              </button>
            ) : (
              <button
                type="submit"
                disabled={!message.trim()}
                style={{
                  backgroundColor: !message.trim() ? '#f0f0f0' : '#000000',
                  color: !message.trim() ? '#999999' : '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '12px 16px',
                  cursor: !message.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minWidth: '70px',
                  justifyContent: 'center',
                  opacity: !message.trim() ? 0.6 : 1,
                  transform: !message.trim() ? 'scale(0.95)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (message.trim()) {
                    e.currentTarget.style.backgroundColor = '#333333';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (message.trim()) {
                    e.currentTarget.style.backgroundColor = '#000000';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <span style={{ fontSize: '14px' }}>📤</span>
                发送
              </button>
            )}
          </div>
          
          {/* 输入框底部装饰线 */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: isFocused ? '100%' : '0%',
            height: '2px',
            backgroundColor: '#000000',
            transition: 'width 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }} />
        </div>
        
        <div style={{
          fontSize: '12px',
          color: '#999999',
          marginTop: '12px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: isFocused ? 1 : 0.7,
          transition: 'opacity 0.2s ease',
        }}>
          <span>按</span>
          <kbd style={{
            backgroundColor: '#f0f0f0',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '11px',
            fontFamily: 'monospace',
          }}>Enter</kbd>
          <span>发送</span>
          <span style={{ color: '#d0d0d0' }}>|</span>
          <kbd style={{
            backgroundColor: '#f0f0f0',
            border: '1px solid #d0d0d0',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '11px',
            fontFamily: 'monospace',
          }}>Shift + Enter</kbd>
          <span>换行</span>
        </div>
      </form>
      
      <style>
        {`
          textarea::-webkit-scrollbar {
            width: 6px;
          }
          
          textarea::-webkit-scrollbar-track {
            background: transparent;
          }
          
          textarea::-webkit-scrollbar-thumb {
            background: #d0d0d0;
            border-radius: 3px;
          }
          
          textarea::-webkit-scrollbar-thumb:hover {
            background: #b0b0b0;
          }
          
          @keyframes buttonPulse {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(51, 51, 51, 0.4);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(51, 51, 51, 0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default MessageInput;