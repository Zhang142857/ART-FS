import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { useAuthStore } from '../store/useAuthStore';
import { useSettings } from '../hooks/useSettings';



interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
}

interface HeaderProps {
  onSidebarToggle: () => void;
  onSettingsClick: () => void;
  onLogout?: () => void;
  isSidebarOpen: boolean;
  user?: User | null;
  isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onSidebarToggle, 
  onSettingsClick, 
  onLogout,
  isSidebarOpen, 
  user, 
  isAuthenticated 
}) => {
  const { settings, models } = useSettings();
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useStore();
  
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    onLogout?.();
  };

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header style={{
      height: '70px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'relative',
      zIndex: 100,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>
        {/* 汉堡菜单按钮 */}
        <button
          onClick={onSidebarToggle}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <div style={{
            width: '22px',
            height: '22px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{
              width: '100%',
              height: '2.5px',
              backgroundColor: '#1a1a1a',
              borderRadius: '2px',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isSidebarOpen ? 'rotate(45deg) translate(7px, 7px)' : 'none',
            }} />
            <div style={{
              width: '100%',
              height: '2.5px',
              backgroundColor: '#1a1a1a',
              borderRadius: '2px',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              opacity: isSidebarOpen ? 0 : 1,
              transform: isSidebarOpen ? 'scale(0)' : 'scale(1)',
            }} />
            <div style={{
              width: '100%',
              height: '2.5px',
              backgroundColor: '#1a1a1a',
              borderRadius: '2px',
              transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transform: isSidebarOpen ? 'rotate(-45deg) translate(7px, -7px)' : 'none',
            }} />
          </div>
        </button>

        {/* 标题区域 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '700',
            color: '#000000',
            margin: 0,
            letterSpacing: '-0.02em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            NeuralChat
          </h1>
          
          {/* 状态指示器 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#f0f0f0',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            color: '#666666',
            fontWeight: '500',
          }}>
            <div style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#00C851',
              borderRadius: '50%',
              animation: 'statusPulse 2s infinite',
            }} />
            在线
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        {/* 用户菜单 */}
        {isAuthenticated && user && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            {/* 用户信息按钮 */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e9ecef';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #333333 0%, #666666 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: '#ffffff',
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#333333',
                }}>
                  {user.full_name || user.username}
                </span>
                {user.role === 'admin' && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#3b82f6',
                    backgroundColor: '#eff6ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '2px',
                  }}>
                    管理员
                  </span>
                )}
              </div>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="#666666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* 下拉菜单 */}
            {showUserMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                backgroundColor: '#ffffff',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                minWidth: '180px',
                zIndex: 1000,
                animation: 'dropdownFadeIn 0.2s ease-out',
              }}>
                {/* 用户角色显示 */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  <div style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: user.role === 'admin' ? '#3b82f6' : '#10b981',
                  }} />
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: '#666666',
                  }}>
                    {user.role === 'admin' ? '系统管理员' : '普通用户'}
                  </span>
                </div>
                
                
                
                <button
                  onClick={toggleTheme}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: 'none',
                    background: 'transparent',
                    color: theme === 'dark' ? '#ffffff' : '#374151',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme === 'dark' ? '#4b5563' : '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {theme === 'dark' ? '☀️ 亮色模式' : '🌙 深色模式'}
                </button>
                
                {/* 退出登录 */}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#1a1a1a',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#fff5f5';
                    e.currentTarget.style.color = '#e53e3e';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#1a1a1a';
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  退出登录
                </button>
              </div>
            )}
          </div>
        )}

        {/* 模型选择器 */}
        {settings && models && models.length > 0 && (
          <div style={{
            position: 'relative',
          }}>
            <select
              value={settings.current_model}
              onChange={(e) => {
                console.log('Selected model:', e.target.value);
              }}
              style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '13px',
                color: '#1a1a1a',
                cursor: 'pointer',
                minWidth: '150px',
                outline: 'none',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 8px center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '14px',
                paddingRight: '28px',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#666666';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e9ecef';
                e.currentTarget.style.backgroundColor = '#f8f9fa';
              }}
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        )}

        
        {/* 设置按钮 */}
        <button
          onClick={onSettingsClick}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #e9ecef',
            color: '#1a1a1a',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f8f9fa';
            e.currentTarget.style.borderColor = '#d0d7de';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#e9ecef';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.7 8.7L13.2 7.3C13.1 7 13.1 6.6 13.2 6.3L13.7 4.9C13.8 4.6 13.7 4.3 13.5 4.1L12.6 3.2C12.4 3 12.1 2.9 11.8 3L10.4 3.5C10.1 3.6 9.7 3.6 9.4 3.5L8 3C7.7 2.9 7.4 3 7.2 3.2L6.3 4.1C6.1 4.3 6 4.6 6.1 4.9L6.6 6.3C6.7 6.6 6.7 7 6.6 7.3L6.1 8.7C6 9 6.1 9.3 6.3 9.5L7.2 10.4C7.4 10.6 7.7 10.7 8 10.6L9.4 10.1C9.7 10 10.1 10 10.4 10.1L11.8 10.6C12.1 10.7 12.4 10.6 12.6 10.4L13.5 9.5C13.7 9.3 13.8 9 13.7 8.7Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          设置
        </button>
      </div>
      
      <style>
        {`
          @keyframes statusPulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.6;
              transform: scale(0.9);
            }
          }
          
          @keyframes dropdownFadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;