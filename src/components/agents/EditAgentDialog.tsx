import React, { useState } from 'react';
import { Dialog } from '../Dialog';
import { Button } from '../Button';
import { Check } from 'lucide-react';
import { AIAgent } from '../../lib/db';

interface EditAgentDialogProps {
  agent: AIAgent;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; model: string; prompt: string }) => Promise<void>;
}

const AI_MODELS = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
  },
  {
    id: 'gpt-4-turbo-preview',
    name: 'GPT-4 Turbo',
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
  }
];

export function EditAgentDialog({ agent, isOpen, onClose, onSave }: EditAgentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const config = JSON.parse(agent.config);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    await onSave({
      name: formData.get('name') as string,
      model: formData.get('model') as string,
      prompt: formData.get('prompt') as string,
    });
    
    setIsLoading(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Edit AI Agent">
      <form onSubmit={handleSubmit} className="space-y-4">
        {showSuccess && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2 text-green-600">
              <Check className="h-6 w-6" />
              <span className="text-lg font-medium">Changes saved!</span>
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            defaultValue={agent.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            name="model"
            defaultValue={config.model}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            {AI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Prompt</label>
          <textarea
            name="prompt"
            defaultValue={config.prompt}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div className="mt-4 flex justify-end space-x-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}