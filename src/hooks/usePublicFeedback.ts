import { useState, useCallback } from 'react';
import { db_operations } from '../lib/db';
import { useNotifications } from '../lib/notifications-context';

export function usePublicFeedback(agentId: string, chatId: string) {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const { addNotification } = useNotifications();

  const handleFeedbackSubmit = useCallback(async (feedback: any) => {
    try {
      await db_operations.addFeedback({
        ...feedback,
        agentId,
        chatId
      });
      
      // Add notification for the agent owner
      addNotification(
        'New Feedback',
        'A user has submitted feedback for your AI agent',
        agentId
      );
      
      const updatedFeedbacks = await db_operations.getFeedbacksByAgent(agentId);
      setFeedbacks(updatedFeedbacks);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      throw new Error('Failed to submit feedback');
    }
  }, [agentId, chatId, addNotification]);

  return { feedbacks, handleFeedbackSubmit };
}