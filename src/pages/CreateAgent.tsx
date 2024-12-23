import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { FlexxTemplateForm } from '../components/FlexxTemplateForm';
import { FlexxTemplateSelector } from '../components/templates/FlexxTemplateSelector';
import { WebScrapeForm } from '../components/templates/WebScrapeForm';
import { CustomPromptForm } from '../components/templates/CustomPromptForm';
import { useAuth } from '../lib/auth-context';
import { db_operations } from '../lib/db';
import { createOpenAIAssistant } from '../lib/openai';

type TemplateMode = 'none' | 'basic' | 'webscrape' | 'custom';

export function CreateAgentPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [templateMode, setTemplateMode] = useState<TemplateMode>('none');
  const [formData, setFormData] = useState({
    clientName: '',
    model: '',
    prompt: ''
  });

  useEffect(() => {
    const checkApiKey = async () => {
      if (!user) return;
      
      const userData = await db_operations.findUserById(user.id);
      if (!userData?.openaiApiKey) {
        navigate('/settings', { 
          state: { message: 'Please add your OpenAI API key before creating an AI agent' }
        });
      }
    };

    checkApiKey();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError('');

    try {
      const data = {
        name: formData.clientName,
        description: formData.prompt,
        model: formData.model,
      };

      const assistantId = await createOpenAIAssistant(
        user.id,
        data.name,
        data.description,
        data.model
      );

      const config = JSON.stringify({
        model: data.model,
        prompt: data.description,
        assistantId
      });

      await db_operations.createAgent({
        name: data.name,
        description: data.description,
        config,
        userId: user.id,
      });

      navigate('/agents');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomPrompt = (data: { prompt: string; model: string }) => {
    setFormData(prev => ({
      ...prev,
      prompt: data.prompt,
      model: data.model
    }));
    setTemplateMode('none');
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create New AI Agent
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Configure a new AI agent for your client
            </p>
          </div>

          <div className="px-4 py-5 space-y-6 sm:p-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {templateMode === 'none' ? (
              <FlexxTemplateSelector
                onSelectBasic={() => setTemplateMode('basic')}
                onSelectWebScrape={() => setTemplateMode('webscrape')}
                onSelectCustom={() => setTemplateMode('custom')}
              />
            ) : templateMode === 'basic' ? (
              <FlexxTemplateForm onSubmit={(prompt) => {
                setFormData(prev => ({ ...prev, prompt }));
                setTemplateMode('none');
              }} />
            ) : templateMode === 'webscrape' ? (
              <WebScrapeForm onDataExtracted={(data) => {
                setFormData(prev => ({ ...prev, ...data }));
                setTemplateMode('basic');
              }} />
            ) : (
              <CustomPromptForm onSubmit={handleCustomPrompt} />
            )}

            {templateMode === 'none' && formData.prompt && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Client Name"
                  value={formData.clientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                  required
                />

                <div className="flex justify-end">
                  <Button type="submit" isLoading={isLoading}>
                    Create Agent
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}