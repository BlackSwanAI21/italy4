import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { useAuth } from '../lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { db_operations } from '../lib/db';
import { Bot, Check, Loader2, Search } from 'lucide-react';
import { Button } from '../components/Button';

interface Assistant {
  id: string;
  name: string;
  description: string | null;
  instructions: string;
  model: string;
}

export function ImportAgentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [selectedAssistants, setSelectedAssistants] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAssistants = async () => {
      if (!user) return;

      try {
        const userData = await db_operations.findUserById(user.id);
        if (!userData?.openaiApiKey) {
          navigate('/settings', { 
            state: { message: 'Please add your OpenAI API key before importing assistants' }
          });
          return;
        }

        const response = await fetch('https://api.openai.com/v1/assistants', {
          headers: {
            'Content-Type': 'application/json',
            'OpenAI-Beta': 'assistants=v2',
            'Authorization': `Bearer ${userData.openaiApiKey}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch assistants');
        }

        const data = await response.json();
        setAssistants(data.data);
      } catch (error) {
        console.error('Failed to fetch assistants:', error);
        setError('Failed to fetch assistants. Please check your API key and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssistants();
  }, [user, navigate]);

  const toggleAssistant = (assistantId: string) => {
    setSelectedAssistants(prev => {
      const newSet = new Set(prev);
      if (newSet.has(assistantId)) {
        newSet.delete(assistantId);
      } else {
        newSet.add(assistantId);
      }
      return newSet;
    });
  };

  const handleImport = async () => {
    if (!user || selectedAssistants.size === 0) return;

    setImporting(true);
    try {
      for (const assistantId of selectedAssistants) {
        const assistant = assistants.find(a => a.id === assistantId);
        if (!assistant) continue;

        const config = {
          assistantId: assistant.id,
          model: assistant.model,
          prompt: assistant.instructions
        };

        await db_operations.createAgent({
          name: assistant.name,
          description: assistant.description || '',
          config: JSON.stringify(config),
          userId: user.id
        });
      }

      navigate('/agents');
    } catch (error) {
      console.error('Failed to import assistants:', error);
      setError('Failed to import assistants. Please try again.');
    } finally {
      setImporting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-lg font-medium text-gray-900">Import OpenAI Assistants</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Select the assistants you want to import from your OpenAI account
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                <p className="text-sm">{error}</p>
              </div>
            )}

            {assistants.length === 0 ? (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No assistants found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Create assistants in your OpenAI account first
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {assistants.map((assistant) => (
                  <div
                    key={assistant.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAssistants.has(assistant.id)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                    onClick={() => toggleAssistant(assistant.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">
                          {assistant.name}
                        </h3>
                        {assistant.description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {assistant.description}
                          </p>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                          Model: {assistant.model}
                        </p>
                      </div>
                      {selectedAssistants.has(assistant.id) && (
                        <Check className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </div>
                ))}

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleImport}
                    disabled={selectedAssistants.size === 0}
                    isLoading={importing}
                  >
                    Import Selected Assistants
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}