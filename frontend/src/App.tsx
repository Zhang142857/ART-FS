import React, { useEffect } from 'react';
import { useThemeStore } from './store/useThemeStore';
import { useAuth } from './store/useAppStore';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

const LoadingScreen: React.FC = () => {
  const { currentTheme } = useThemeStore();
  
  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: currentTheme.colors.background.primary,
      color: currentTheme.colors.text.primary,
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: `3px solid ${currentTheme.colors.border.primary}`,
          borderTop: `3px solid ${currentTheme.colors.brand.primary}`,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px',
        }} />
        <p style={{ 
          fontSize: '16px', 
          fontWeight: '500',
          color: currentTheme.colors.text.secondary 
        }}>
          正在加载...
        </p>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentTheme } = useThemeStore();
  const { isAuthenticated } = useAuth();

  // 应用主题到全局样式
  useEffect(() => {
    document.body.style.backgroundColor = currentTheme.colors.background.primary;
    document.body.style.color = currentTheme.colors.text.primary;
    document.body.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, [currentTheme]);

  const renderView = () => {
    if (isAuthenticated) {
      return <ChatPage />;
    } else {
      return <AuthPage />;
    }
  };

  return (
    <>
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        backgroundColor: currentTheme.colors.background.primary,
        color: currentTheme.colors.text.primary,
        fontFamily: 'inherit',
      }}>
        {renderView()}
      </div>
      
      {/* 全局CSS样式 */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          
          body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          /* 滚动条样式 */
          ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${currentTheme.colors.background.secondary};
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${currentTheme.colors.border.secondary};
            border-radius: 3px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${currentTheme.colors.text.muted};
          }
          
          /* 选择文本样式 */
          ::selection {
            background: ${currentTheme.colors.brand.primary}33;
            color: ${currentTheme.colors.text.primary};
          }
          
          /* 焦点样式 */
          *:focus {
            outline: none;
          }
          
          *:focus-visible {
            outline: 2px solid ${currentTheme.colors.brand.primary};
            outline-offset: 2px;
          }
        `}
      </style>
    </>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;