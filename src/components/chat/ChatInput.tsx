import React, { useState } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { Button } from '../Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onResetChat: () => void;
  isLoading: boolean;
  theme: any;
}

export function ChatInput({ onSendMessage, onResetChat, isLoading, theme }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim() || isLoading) return;
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div className="p-6 border-t border-gray-200">
      <div className="flex flex-col space-y-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type your message..."
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-3"
          disabled={isLoading}
        />
        <Button
          onClick={handleSubmit}
          disabled={isLoading || !message.trim()}
          isLoading={isLoading}
          className="w-full"
        >
          {!isLoading && <Send className="h-5 w-5 mr-2" />}
          Send Message
        </Button>
        <button
          onClick={onResetChat}
          disabled={isLoading}
          className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center space-x-1 py-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          <span>Reset Chat</span>
        </button>
      </div>
    </div>
  );
}