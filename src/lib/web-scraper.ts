import { fetchWithProxy } from './proxy-fetch';

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

export async function extractWebsiteInfo(
  url: string, 
  apiKey: string,
  onProgress?: (progress: ScrapingProgress) => void
) {
  const progress: ScrapingProgress = {
    fetchingWebsite: { status: 'pending' },
    extractingContent: { status: 'pending' },
    analyzingWithAI: { status: 'pending' },
    preparingData: { status: 'pending' }
  };

  try {
    // Step 1: Fetch website content
    progress.fetchingWebsite = { status: 'loading' };
    onProgress?.(progress);

    const response = await fetchWithProxy(url);
    const html = await response.text();

    progress.fetchingWebsite = { status: 'success' };
    progress.extractingContent = { status: 'loading' };
    onProgress?.(progress);

    // Step 2: Parse and extract content
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    doc.querySelectorAll('script, style').forEach(el => el.remove());
    const textContent = doc.body.textContent?.replace(/\s+/g, ' ').trim() || '';

    progress.extractingContent = { status: 'success' };
    progress.analyzingWithAI = { status: 'loading' };
    onProgress?.(progress);

    // Step 3: Analyze with OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a business analyst. Extract the following information from the website content:
              - Company name
              - Industry
              - Main services/products
              - Phone number (if available)
              - Special offers or unique value propositions
              - Opening hours/times (if available)
              - Create a brief FAQ about who they are and what they offer
              
              Format the response as JSON with these keys:
              companyName, clientIndustry, service, clientPhone, clientOffer, openingTimes, faq`
          },
          {
            role: 'user',
            content: textContent.substring(0, 8000)
          }
        ]
      })
    });

    if (!openaiResponse.ok) {
      throw new Error('Failed to analyze content with AI');
    }

    progress.analyzingWithAI = { status: 'success' };
    progress.preparingData = { status: 'loading' };
    onProgress?.(progress);

    const result = await openaiResponse.json();
    const analysis = JSON.parse(result.choices[0].message.content);

    progress.preparingData = { status: 'success' };
    onProgress?.(progress);

    return {
      ...analysis,
      clientWebsite: url,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    
    // Update progress with error
    Object.keys(progress).forEach(key => {
      if (progress[key as keyof ScrapingProgress].status === 'loading') {
        progress[key as keyof ScrapingProgress] = { 
          status: 'error',
          message: errorMessage
        };
      }
    });
    onProgress?.(progress);

    throw new Error(`Failed to analyze website: ${errorMessage}`);
  }
}