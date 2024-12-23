// Database types
export interface User {
  id: string;
  email: string;
  password: string;
  name: string | null;
  companyName: string | null;
  openaiApiKey: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string | null;
  config: string;
  userId: string;
  webhookSecret: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chat {
  id: string;
  agentId: string;
  userId: string;
  threadId: string;
  source: 'web' | 'webhook' | 'public';
  metadata: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}