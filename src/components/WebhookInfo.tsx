import React from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface WebhookInfoProps {
  webhookSecret: string;
}

export function WebhookInfo({ webhookSecret }: WebhookInfoProps) {
  const [copied, setCopied] = React.useState(false);
  const webhookUrl = `${import.meta.env.VITE_API_URL || window.location.origin}/api/webhook`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900">Webhook URL</h4>
      <p className="mt-1 text-sm text-gray-500">
        Use this URL to send messages to your AI agent via webhook. Send a POST request with the following structure:
      </p>
      
      <div className="mt-2 bg-gray-100 p-3 rounded font-mono text-sm overflow-x-auto">
        <pre>{`{
  "message": "User message here",
  "assistantId": "asst_xxx",
  "email": "user@example.com",
  "metadata": {
    "userId": "optional-user-id",
    "source": "optional-source-identifier"
  }
}`}</pre>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        <input
          type="text"
          value={webhookUrl}
          readOnly
          className="flex-1 rounded-md border-gray-300 bg-white text-sm"
        />
        <Button
          onClick={handleCopy}
          type="button"
          className="inline-flex items-center px-3 py-2"
        >
          {copied ? (
            <Check className="h-4 w-4 text-white" />
          ) : (
            <Copy className="h-4 w-4 text-white" />
          )}
        </Button>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        <p className="font-medium">Required Fields:</p>
        <ul className="list-disc list-inside mt-1">
          <li>message: The user's message to send to the AI</li>
          <li>assistantId: The OpenAI Assistant ID for this agent</li>
          <li>email: The email address of the user who owns this agent</li>
        </ul>
      </div>
    </div>
  );
}