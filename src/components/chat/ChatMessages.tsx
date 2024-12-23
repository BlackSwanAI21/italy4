import React from 'react';
import { TypingBubble } from '../TypingBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  theme: any;
  messagesEndRef?: React.RefObject<HTMLDivElement>;
}

export function ChatMessages({ messages, isLoading, theme, messagesEndRef }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-6 py-3 ${
              message.role === 'user'
                ? `${theme.primary} text-white`
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
          </div>
        </div>
      ))}
      {isLoading && <TypingBubble />}
      {messagesEndRef && <div ref={messagesEndRef} />}
    </div>
  );
}