import React, { useState, useEffect } from 'react';

import { useAuthStore } from './store/useAuthStore';
import { ThemeProvider } from './styles/ThemeProvider';
import AuthPage from './pages/AuthPage';
import ChatPage from './pages/ChatPage';

type AppView = 'auth' | 'chat';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [currentView, setCurrentView] = useState<AppView | null>(null);

  // 根据登录状态设置初始视图
  useEffect(() => {
    console.log('App useEffect - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    if (!isLoading) {
      const newView = isAuthenticated ? 'chat' : 'auth';
      console.log('设置视图为:', newView);
      setCurrentView(newView);
    }
  }, [isAuthenticated, isLoading]);

  const handleAuthSuccess = () => {
    setCurrentView('chat');
  };

  const handleLogout = () => {
    setCurrentView('auth');
  };

  const renderCurrentView = () => {
    // 加载状态
    if (isLoading || currentView === null) {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a1a1a',
          color: '#ffffff',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '3px solid rgba(255, 255, 255, 0.3)',
              borderTop: '3px solid #ffffff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }} />
            <p>加载中...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'auth':
        return (
          <AuthPage
            onSuccess={handleAuthSuccess}
          />
        );
      case 'chat':
        return (
          <ChatPage
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <AuthPage
            onSuccess={handleAuthSuccess}
          />
        );
    }
  };

  return (
    <>
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        overflow: 'hidden',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {renderCurrentView()}
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;