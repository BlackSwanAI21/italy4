import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { db_operations } from '../lib/db';
import { useAuth } from '../lib/auth-context';
import { Calendar, MessageSquare } from 'lucide-react';

interface ChatSession {
  id: string;
  createdAt: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
  }>;
}

export function ChatHistoryPage() {
  const { agentId } = useParams();
  const { user } = useAuth();
  const [agent, setAgent] = useState<any>(null);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user || !agentId) return;

      try {
        // Load agent details
        const agents = await db_operations.getAgentsByUser(user.id);
        const currentAgent = agents.find(a => a.id === agentId);
        setAgent(currentAgent);

        // Load all chat sessions for this agent
        const chats = await db_operations.getChatsByAgent(agentId);
        
        // Process each chat session and filter out empty ones
        const sessionsWithMessages = await Promise.all(
          chats.map(async (chat) => {
            const messages = await db_operations.getMessagesByChat(chat.id);
            return {
              id: chat.id,
              createdAt: chat.createdAt,
              messages,
            };
          })
        );

        // Only keep chat sessions that have messages
        const nonEmptySessions = sessionsWithMessages.filter(
          session => session.messages.length > 0
        );

        setChatSessions(nonEmptySessions);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChatHistory();
  }, [user, agentId]);

  // Rest of the component remains the same...