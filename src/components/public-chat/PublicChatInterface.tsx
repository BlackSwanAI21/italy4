import React from 'react';
import { ChatHeader } from '../chat/ChatHeader';
import { ChatMessages } from '../chat/ChatMessages';
import { ChatInput } from '../chat/ChatInput';
import { FeedbackSection } from '../FeedbackSection';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useChatStage } from '../../hooks/useChatStage';
import { usePublicFeedback } from '../../hooks/usePublicFeedback';
import { useTheme, themes } from '../../lib/theme-context';
import { AlertCircle } from 'lucide-react';

interface PublicChatInterfaceProps {
  agent: {
    id: string;
    name: string;
    config: string;
    userId: string;
  };
  threadId: string;
  chatId: string;
}

export function PublicChatInterface({ agent, threadId, chatId }: PublicChatInterfaceProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const config = JSON.parse(agent.config);
  const { messages, isLoading, error, sendMessage, resetChat } = useChatMessages(
    threadId,
    chatId,
    agent.userId,
    config.assistantId
  );
  const stage = useChatStage(messages);
  const { feedbacks, handleFeedbackSubmit } = usePublicFeedback(agent.id, chatId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-8 px-4">
        <div className={`${currentTheme.card} shadow rounded-lg flex flex-col h-[calc(100vh-4rem)]`}>
          <ChatHeader agentName={agent.name} stage={stage} />
          
          {error && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}
          
          <ChatMessages
            messages={messages}
            isLoading={isLoading}
            theme={currentTheme}
          />

          <ChatInput
            onSendMessage={sendMessage}
            onResetChat={resetChat}
            isLoading={isLoading}
            theme={currentTheme}
          />

          <div className="mt-8 px-6 pb-6">
            <FeedbackSection
              agentId={agent.id}
              chatId={chatId}
              onSubmit={handleFeedbackSubmit}
              feedbacks={feedbacks}
              isPublic={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}