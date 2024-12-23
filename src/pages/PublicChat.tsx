import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { SharedAgentLanding } from '../components/shared/SharedAgentLanding';
import { PublicChatInterface } from '../components/public-chat/PublicChatInterface';
import { usePublicAgent } from '../hooks/usePublicAgent';
import { Loader2 } from 'lucide-react';

export function PublicChat() {
  const { agentId } = useParams();
  const [showLanding, setShowLanding] = useState(true);
  const { agent, threadId, chatId, error, isLoading } = usePublicAgent(agentId);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading || !agent || !threadId || !chatId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (showLanding) {
    return (
      <SharedAgentLanding
        agentName={agent.name}
        onGetStarted={() => setShowLanding(false)}
      />
    );
  }

  return (
    <PublicChatInterface
      agent={agent}
      threadId={threadId}
      chatId={chatId}
    />
  );
}