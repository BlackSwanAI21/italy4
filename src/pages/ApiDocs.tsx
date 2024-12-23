import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Code, RefreshCw } from 'lucide-react';
import { Button } from '../components/Button';

interface WebhookPayload {
  timestamp: string;
  payload: any;
  userFound?: boolean;
}

export function ApiDocsPage() {
  const [payloads, setPayloads] = useState<WebhookPayload[]>([]);
  const [isPolling, setIsPolling] = useState(false);
  const apiUrl = 'https://flexxai-production.up.railway.app';

  const fetchWebhooks = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/webhooks`);
      if (!response.ok) throw new Error('Failed to fetch webhooks');
      const data = await response.json();
      setPayloads(data);
    } catch (err) {
      console.error('Failed to fetch webhooks:', err);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPolling) {
      fetchWebhooks(); // Initial fetch
      interval = setInterval(fetchWebhooks, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPolling]);

  const clearPayloads = async () => {
    try {
      await fetch(`${apiUrl}/api/webhooks`, {
        method: 'DELETE'
      });
      setPayloads([]);
    } catch (err) {
      console.error('Failed to clear webhooks:', err);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center">
              <Code className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-lg font-medium text-gray-900">API Documentation</h1>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Learn how to integrate with our API endpoints
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Webhook Testing Section */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Live Webhook Testing</h2>
                <div className="space-x-2">
                  <Button
                    onClick={() => setIsPolling(!isPolling)}
                    variant={isPolling ? 'secondary' : 'primary'}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
                    {isPolling ? 'Stop' : 'Start'} Monitoring
                  </Button>
                  <Button onClick={clearPayloads} variant="secondary">
                    Clear
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h3 className="text-sm font-medium text-gray-700">Incoming Webhook Payloads</h3>
                </div>
                <div className="divide-y max-h-96 overflow-y-auto">
                  {payloads.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                      {isPolling ? 'Waiting for webhook requests...' : 'Start monitoring to see incoming webhook requests'}
                    </div>
                  ) : (
                    payloads.map((item, index) => (
                      <div key={index} className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          {item.userFound !== undefined && (
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.userFound 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              User {item.userFound ? 'Found' : 'Not Found'}
                            </span>
                          )}
                        </div>
                        <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                          {JSON.stringify(item.payload, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* API Documentation */}
            <section>
              <h2 className="text-lg font-medium text-gray-900">Webhook Endpoint</h2>
              <p className="mt-1 text-sm text-gray-500">
                Send webhook requests with the following format
              </p>

              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-indigo-600 text-white text-sm rounded">POST</span>
                  <code className="text-sm">{`${apiUrl}/api/webhook`}</code>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Example Request</h3>
                  <div className="mt-2 bg-gray-100 p-3 rounded">
                    <pre className="text-sm overflow-x-auto">
{`{
  "Lead Response": "hey hows it going",
  "app email": "user@example.com",
  "Active Assistant ID": "asst_xxx"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}