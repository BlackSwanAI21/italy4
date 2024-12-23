import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { useAuth } from '../lib/auth-context';
import { db_operations } from '../lib/db';
import { AIAgent } from '../lib/db';
import { deleteOpenAIAssistant, updateOpenAIAssistant } from '../lib/openai';
import { AgentList } from '../components/agents/AgentList';
import { EditAgentDialog } from '../components/agents/EditAgentDialog';
import { ShareDialog } from '../components/ShareDialog';
import { DeleteAgentDialog } from '../components/agents/DeleteAgentDialog';

interface DeletingAgent {
  id: string;
  name: string;
  assistantId: string;
}

export function AgentsPage() {
  const { user } = useAuth();
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null);
  const [sharingAgent, setSharingAgent] = useState<AIAgent | null>(null);
  const [deletingAgent, setDeletingAgent] = useState<DeletingAgent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAgents();
  }, [user]);

  async function loadAgents() {
    if (!user) return;
    try {
      const userAgents = await db_operations.getAgentsByUser(user.id);
      setAgents(userAgents);
    } catch (error) {
      console.error('Failed to load agents:', error);
      setError('Failed to load agents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(deleteFromOpenAI: boolean) {
    if (!user || !deletingAgent) return;

    try {
      // Always delete from local database
      await db_operations.deleteAgent(deletingAgent.id);
      
      // Optionally delete from OpenAI
      if (deleteFromOpenAI) {
        await deleteOpenAIAssistant(user.id, deletingAgent.assistantId);
      }
      
      await loadAgents();
    } catch (error) {
      console.error('Failed to delete agent:', error);
      setError('Failed to delete agent. Please try again.');
    }
  }

  function handleDeleteClick(agent: AIAgent) {
    try {
      if (!agent.config) {
        throw new Error('Invalid agent configuration');
      }

      const config = JSON.parse(agent.config);
      
      if (!config.assistantId) {
        throw new Error('Missing assistant ID in configuration');
      }

      setDeletingAgent({
        id: agent.id,
        name: agent.name,
        assistantId: config.assistantId
      });
    } catch (error) {
      console.error('Failed to parse agent config:', error);
      setError('Unable to delete agent due to invalid configuration.');
    }
  }

  async function handleEdit(data: { name: string; model: string; prompt: string }) {
    if (!editingAgent || !user) return;

    try {
      const config = JSON.parse(editingAgent.config);
      
      await updateOpenAIAssistant(
        user.id,
        config.assistantId,
        data.name,
        data.prompt,
        data.model
      );

      const newConfig = JSON.stringify({
        ...config,
        model: data.model,
        prompt: data.prompt,
      });

      await db_operations.updateAgent(editingAgent.id, {
        name: data.name,
        config: newConfig,
      });

      await loadAgents();
    } catch (error) {
      console.error('Failed to update agent:', error);
      setError('Failed to update agent. Please try again.');
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">My AI Agents</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all your AI agents and their current status
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <AgentList
          agents={agents}
          onEdit={setEditingAgent}
          onDelete={handleDeleteClick}
          onShare={setSharingAgent}
        />

        {editingAgent && (
          <EditAgentDialog
            agent={editingAgent}
            isOpen={true}
            onClose={() => setEditingAgent(null)}
            onSave={handleEdit}
          />
        )}

        {sharingAgent && (
          <ShareDialog
            isOpen={true}
            onClose={() => setSharingAgent(null)}
            agentName={sharingAgent.name}
            agentId={sharingAgent.id}
          />
        )}

        {deletingAgent && (
          <DeleteAgentDialog
            agentName={deletingAgent.name}
            isOpen={true}
            onClose={() => setDeletingAgent(null)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </MainLayout>
  );
}