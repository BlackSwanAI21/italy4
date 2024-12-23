import React from 'react';

interface ChatHeaderProps {
  agentName: string;
}

export function ChatHeader({ agentName }: ChatHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">
        Chat with {agentName}
      </h3>
    </div>
  );
}