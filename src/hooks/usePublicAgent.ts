import { useState, useEffect } from 'react';
import { db_operations } from '../lib/db';
import { createThread } from '../lib/openai';

export function usePublicAgent(agentId: string | undefined) {
  const [agent, setAgent] = useState<any>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAgent = async () => {
      try {
        if (!agentId) {
          setError('Invalid agent ID');
          return;
        }

        const currentAgent = await db_operations.findAgentById(agentId);
        
        if (!currentAgent) {
          setError('AI Agent not found');
          return;
        }

        setAgent(currentAgent);

        const newThreadId = await createThread(currentAgent.userId);
        setThreadId(newThreadId);

        const chat = await db_operations.createPublicChat({
          agentId: currentAgent.id,
          userId: currentAgent.userId,
          threadId: newThreadId,
          metadata: null
        });
        setChatId(chat.id);
      } catch (error) {
        console.error('Error loading agent:', error);
        setError('Failed to load AI Agent');
      } finally {
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [agentId]);

  return { agent, threadId, chatId, error, isLoading };
}