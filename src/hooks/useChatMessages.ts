import { useState, useCallback, useEffect } from 'react';
import { db_operations } from '../lib/db';
import { sendMessage as sendOpenAIMessage } from '../lib/openai';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function useChatMessages(threadId: string, chatId: string, userId: string, assistantId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatInitialized, setIsChatInitialized] = useState(false);

  // Load existing messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const existingMessages = await db_operations.getMessagesByChat(chatId);
        if (existingMessages.length > 0) {
          setMessages(existingMessages);
          setIsChatInitialized(true);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();
  }, [chatId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      // Initialize chat if this is the first message
      if (!isChatInitialized) {
        setIsChatInitialized(true);
      }

      // Add user message to state and database
      const newUserMessage = { role: 'user' as const, content };
      setMessages(prev => [...prev, newUserMessage]);
      
      await db_operations.addMessage({
        chatId,
        role: 'user',
        content
      });

      // Send message to OpenAI
      const response = await sendOpenAIMessage(
        userId,
        threadId,
        assistantId,
        content
      );

      // Add assistant response to state and database
      const newAssistantMessage = { role: 'assistant' as const, content: response };
      setMessages(prev => [...prev, newAssistantMessage]);
      
      await db_operations.addMessage({
        chatId,
        role: 'assistant',
        content: response
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      // Remove the user message if the API call failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [threadId, chatId, userId, assistantId, isChatInitialized]);

  const resetChat = useCallback(async () => {
    setMessages([]);
    setError(null);
    setIsChatInitialized(false);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    resetChat,
    isChatInitialized
  };
}