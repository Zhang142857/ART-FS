import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatRequest } from '../types';
import { ApiService } from '../services/api';

export const useChat = (sessionId?: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 当sessionId变化时加载会话消息
  useEffect(() => {
    if (sessionId && sessionId !== currentSessionId) {
      loadSessionMessages(sessionId);
    }
  }, [sessionId]);

  const loadSessionMessages = useCallback(async (sessionId: string) => {
    try {
      const sessionData = await ApiService.getChatSession(sessionId);
      if (sessionData.messages) {
        setMessages(sessionData.messages);
      }
      setCurrentSessionId(sessionId);
    } catch (err) {
      console.error('加载会话消息失败:', err);
      setError('加载会话消息失败');
    }
  }, []);

  const createNewSession = useCallback(async (title?: string) => {
    try {
      const newSession = await ApiService.createChatSession(title);
      setCurrentSessionId(newSession.id);
      setMessages([]);
      return newSession;
    } catch (err) {
      console.error('创建新会话失败:', err);
      setError('创建新会话失败');
      return null;
    }
  }, []);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  }, []);

  const updateLastMessage = useCallback((content: string) => {
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === 'assistant') {
        lastMessage.content = content;
      }
      return newMessages;
    });
  }, []);

  const sendMessage = useCallback(async (content: string, settings?: { model?: string; temperature?: number }) => {
    if (!content.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      // 如果没有当前会话且用户已登录，创建新会话
      let sessionId = currentSessionId;
      const isAuthenticated = localStorage.getItem('access_token');
      
      if (!sessionId && isAuthenticated) {
        const newSession = await createNewSession();
        if (!newSession) {
          setError('无法创建新会话');
          setIsLoading(false);
          return;
        }
        sessionId = newSession.id;
      }

      // 添加用户消息
      const userMessage = addMessage({
        role: 'user',
        content: content.trim(),
      });

      // 准备请求
      const request: ChatRequest = {
        messages: [...messages, userMessage].map(msg => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        })),
        model: settings?.model,
        stream: true,
        session_id: sessionId || undefined,
      };

      // 创建中断控制器
      abortControllerRef.current = new AbortController();

      // 添加助手消息占位符
      const assistantMessage = addMessage({
        role: 'assistant',
        content: '',
      });

      // 获取流式响应
      const stream = await ApiService.chatStream(request);
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            if (jsonStr.trim()) {
              try {
                const data = JSON.parse(jsonStr);
                
                if (data.type === 'content' && data.content) {
                  accumulatedContent += data.content;
                  updateLastMessage(accumulatedContent);
                } else if (data.type === 'end') {
                  break;
                }
              } catch (e) {
                console.error('解析JSON失败:', e);
              }
            }
          }
        }
      }

      reader.releaseLock();
    } catch (err) {
      setError(err instanceof Error ? err.message : '发送消息失败');
      // 移除失败的助手消息
      setMessages(prev => prev.filter(msg => msg.role !== 'assistant' || msg.content));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, addMessage, updateLastMessage, currentSessionId, createNewSession]);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    stopGeneration,
    clearChat,
    addMessage,
    // 会话管理
    currentSessionId,
    loadSessionMessages,
    createNewSession,
  };
};