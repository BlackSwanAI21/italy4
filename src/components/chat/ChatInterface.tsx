import React, { useState, useRef } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatProgressIndicator } from './ChatProgressIndicator';
import { FeedbackSection } from '../FeedbackSection';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useChatStage } from '../../hooks/useChatStage';
import { useTheme, themes } from '../../lib/theme-context';
import { AlertCircle } from 'lucide-react';

interface ChatInterfaceProps {
  agent: {
    id: string;
    name: string;
    config: string;
  };
  threadId: string;
  chatId: string;
  userId: string;
}

export function ChatInterface({ agent, threadId, chatId, userId }: ChatInterfaceProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const config = JSON.parse(agent.config);
  const assistantId = config.assistantId;

  const { messages, isLoading, error, sendMessage, resetChat } = useChatMessages(
    threadId,
    chatId,
    userId,
    assistantId
  );
  
  const stage = useChatStage(messages);

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <ChatProgressIndicator currentStage={stage} />
      
      <div className={`${currentTheme.card} shadow rounded-lg flex flex-col h-[calc(100vh-12rem)]`}>
        <ChatHeader agentName={agent.name} />
        
        {error && (
          <div className="px-6 py-3 bg-red-50 border-b border-red-200 flex items-center text-red-700">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
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
            onSubmit={() => {}}
            feedbacks={[]}
          />
        </div>
      </div>
    </div>
  );
}