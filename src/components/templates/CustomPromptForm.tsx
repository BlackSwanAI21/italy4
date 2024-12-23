import React from 'react';
import { Button } from '../Button';

interface CustomPromptFormProps {
  onSubmit: (data: { prompt: string; model: string }) => void;
}

export function CustomPromptForm({ onSubmit }: CustomPromptFormProps) {
  const [prompt, setPrompt] = React.useState('');
  const [model, setModel] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ prompt, model });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">AI Model</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          required
        >
          <option value="">Select a model...</option>
          <option value="gpt-4">GPT-4 - Most capable model</option>
          <option value="gpt-4-turbo-preview">GPT-4 Turbo - Fast and powerful</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo - Fast and cost-effective</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Custom Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Write your custom prompt here..."
          required
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          Generate Agent
        </Button>
      </div>
    </form>
  );
}