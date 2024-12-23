import React from 'react';
import { FileText, Globe, Edit3 } from 'lucide-react';
import { Button } from '../Button';

interface FlexxTemplateSelectorProps {
  onSelectBasic: () => void;
  onSelectWebScrape: () => void;
  onSelectCustom: () => void;
}

export function FlexxTemplateSelector({ onSelectBasic, onSelectWebScrape, onSelectCustom }: FlexxTemplateSelectorProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Basic Template
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Create your AI agent using our standard Flexx template with manual input fields.
        </p>
        <Button onClick={onSelectBasic} variant="secondary">
          Use Basic Template
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Globe className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Web Scrape Template
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Automatically extract information from your client's website to populate the template.
        </p>
        <Button onClick={onSelectWebScrape}>
          Use Web Scrape Template
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-indigo-100 p-3 rounded-lg">
            <Edit3 className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Custom Prompt
          </h3>
        </div>
        <p className="text-gray-600 mb-6">
          Write your own custom prompt and select an AI model for complete control over your agent.
        </p>
        <Button onClick={onSelectCustom} variant="secondary">
          Use Custom Prompt
        </Button>
      </div>
    </div>
  );
}