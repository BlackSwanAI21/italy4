import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { ChatInterface } from '../components/chat/ChatInterface';
import { useAuth } from '../lib/auth-context';
import { db_operations } from '../lib/db';
import { createThread } from '../lib/openai';
import { Loader2 } from 'lucide-react';

export function ChatPage() {
  const { agentId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [agent, setAgent] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    const loadAgent = async () => {
      if (!user || !agentId) return;

      try {
        const agents = await db_operations.getAgentsByUser(user.id);
        const currentAgent = agents.find(a => a.id === agentId);

        if (!currentAgent) {
          navigate('/agents');
          return;
        }

        setAgent(currentAgent);

        const newThreadId = await createThread(user.id);
        setThreadId(newThreadId);

        const chat = await db_operations.createChat({
          agentId,
          userId: user.id,
          threadId: newThreadId
        });
        setCurrentChatId(chat.id);
      } catch (error) {
        console.error('Error loading agent:', error);
        setError('Failed to load agent');
      }
    };

    loadAgent();
  }, [user, agentId, navigate]);

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
        </div>
      </MainLayout>
    );
  }

  if (!agent || !threadId || !currentChatId) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ChatInterface
        agent={agent}
        threadId={threadId}
        chatId={currentChatId}
        userId={user?.id}
      />
    </MainLayout>
  );
}