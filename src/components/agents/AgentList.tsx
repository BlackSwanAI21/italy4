import React from 'react';
import { Bot } from 'lucide-react';
import { AgentCard } from '../AgentCard';
import { AIAgent } from '../../lib/db';

interface AgentListProps {
  agents: AIAgent[];
  onEdit: (agent: AIAgent) => void;
  onDelete: (agent: AIAgent) => void;
  onShare: (agent: AIAgent) => void;
}

export function AgentList({ agents, onEdit, onDelete, onShare }: AgentListProps) {
  if (agents.length === 0) {
    return (
      <div className="text-center mt-12">
        <Bot className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No agents</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new AI agent.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onEdit={() => onEdit(agent)}
          onDelete={() => onDelete(agent)}
          onShare={() => onShare(agent)}
        />
      ))}
    </div>
  );
}