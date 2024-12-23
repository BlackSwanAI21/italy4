import React, { useState } from 'react';
import { Search, Loader, Globe, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../Button';
import { useAuth } from '../../lib/auth-context';
import { extractWebsiteInfo } from '../../lib/web-scraper';

interface ScrapingStep {
  status: 'pending' | 'loading' | 'success' | 'error';
  message?: string;
}

interface ScrapingProgress {
  fetchingWebsite: ScrapingStep;
  extractingContent: ScrapingStep;
  analyzingWithAI: ScrapingStep;
  preparingData: ScrapingStep;
}

interface WebScrapeFormProps {
  onDataExtracted: (data: {
    companyName: string;
    clientIndustry: string;
    service: string;
    clientPhone: string;
    clientWebsite: string;
    clientOffer: string;
    openingTimes: string;
    faq: string;
  }) => void;
}

export function WebScrapeForm({ onDataExtracted }: WebScrapeFormProps) {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState<ScrapingProgress>({
    fetchingWebsite: { status: 'pending' },
    extractingContent: { status: 'pending' },
    analyzingWithAI: { status: 'pending' },
    preparingData: { status: 'pending' }
  });
  const { user } = useAuth();

  const stepLabels = {
    fetchingWebsite: 'Fetching website content',
    extractingContent: 'Extracting relevant information',
    analyzingWithAI: 'Analyzing with AI',
    preparingData: 'Preparing template data'
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain || !user?.openaiApiKey) return;

    setIsLoading(true);
    setError('');

    try {
      const data = await extractWebsiteInfo(domain, user.openaiApiKey, setProgress);
      setTimeout(() => {
        onDataExtracted(data);
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze website');
    } finally {
      setIsLoading(false);
    }
  };

  const getStepIcon = (step: ScrapingStep) => {
    switch (step.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'loading':
        return <Loader className="h-5 w-5 animate-spin text-indigo-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-8 rounded-xl border border-indigo-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <Globe className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Website Analysis
            </h3>
            <p className="text-sm text-gray-600">
              Enter your client's website URL to automatically extract relevant information
            </p>
          </div>
        </div>

        <form onSubmit={handleScrape} className="space-y-6">
          <div className="flex space-x-4">
            <input
              type="url"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 h-14 px-6 text-lg rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-colors"
              required
              disabled={isLoading}
            />
            <Button
              type="submit"
              isLoading={isLoading}
              className="w-48 h-14 text-lg"
              disabled={!domain || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Analyze Website
                </>
              )}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">Analysis Failed</h4>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-lg border border-indigo-100 p-6">
              <div className="space-y-4">
                {Object.entries(progress).map(([key, step]) => (
                  <div key={key} className="flex items-center space-x-3">
                    {getStepIcon(step)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm ${
                          step.status === 'error' ? 'text-red-600' :
                          step.status === 'success' ? 'text-green-600' :
                          step.status === 'loading' ? 'text-indigo-600' :
                          'text-gray-500'
                        }`}>
                          {stepLabels[key as keyof typeof stepLabels]}
                        </span>
                        {step.status === 'loading' && (
                          <div className="w-24 h-1 bg-indigo-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 animate-progress" />
                          </div>
                        )}
                      </div>
                      {step.message && (
                        <p className="text-xs text-red-500 mt-1">{step.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}