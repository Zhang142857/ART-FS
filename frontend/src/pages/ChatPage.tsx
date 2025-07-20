import React, { useState } from 'react';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import Settings from './Settings';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '../store/useAuthStore';
import { useSettings } from '../hooks/useSettings';


interface ChatPageProps {
  onLogout?: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onLogout }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSession, setCurrentSession] = useState<string>('1');
  const { messages, isLoading, error, sendMessage, stopGeneration, clearChat } = useChat();
  const { settings } = useSettings();
  const { user, isAuthenticated } = useAuthStore();

  // 获取问候语
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = user?.full_name || user?.username || '用户';
    
    if (hour >= 5 && hour < 12) {
      return `早上好，${name}！`;
    } else if (hour >= 12 && hour < 18) {
      return `下午好，${name}！`;
    } else if (hour >= 18 && hour < 22) {
      return `晚上好，${name}！`;
    } else {
      return `深夜好，${name}！`;
    }
  };

  const handleSendMessage = async (content: string) => {
    await sendMessage(content, {
      model: settings?.current_model,
    });
  };

  const handleNewChat = () => {
    clearChat();
    setCurrentSession(Date.now().toString());
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSession(sessionId);
    // 这里可以加载对应会话的消息历史
    clearChat();
  };

  return (
    <Layout>
      <div style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
      }}>
        {/* 侧边栏 */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onNewChat={handleNewChat}
          onSettingsClick={() => setShowSettings(true)}
          currentSession={currentSession}
          onSessionSelect={handleSessionSelect}
        />

        {/* 主内容区域 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: isSidebarOpen ? '320px' : '0',
          transition: 'margin-left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          height: '100vh',
          overflow: 'hidden',
        }}>
          <Header 
            onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            onSettingsClick={() => setShowSettings(true)}
            onLogout={onLogout}
            isSidebarOpen={isSidebarOpen}
            user={user}
            isAuthenticated={isAuthenticated}
          />
          
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                color: '#dc2626',
                padding: '12px 20px',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <span style={{ fontSize: '16px' }}>⚠️</span>
                {error}
              </div>
            )}
            
            <MessageList messages={messages} isLoading={isLoading} />
            
            {/* 问候语区域 - 集成到输入框上方 */}
            {messages.length === 0 && user && (
              <div style={{
                position: 'absolute',
                bottom: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                animation: 'greetingFadeIn 0.6s ease-out',
                zIndex: 10,
              }}>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '500',
                  color: '#666666',
                  margin: '0 0 12px 0',
                  letterSpacing: '-0.01em',
                }}>
                  {getGreeting()}
                </h2>
              </div>
            )}
            
            <MessageInput
              onSend={handleSendMessage}
              isLoading={isLoading}
              onStop={stopGeneration}
            />
          </div>
        </div>
      </div>

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
      
      <style>
        {`
          @keyframes greetingFadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default ChatPage;