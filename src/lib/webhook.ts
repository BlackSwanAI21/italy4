import { serverDb } from '../server/db/index.js';
import { createThread, sendMessage } from './openai.js';

export interface WebhookPayload {
  message: string;
  assistantId: string;
  email: string;
  metadata?: {
    userId?: string;
    source?: string;
  };
}

export async function handleWebhookRequest(payload: WebhookPayload) {
  // Validate payload
  if (!payload.message || !payload.assistantId || !payload.email) {
    throw new Error('Message, assistantId, and email are required in the webhook payload');
  }

  // Find user by email
  const user = await serverDb.users.findByEmail(payload.email);
  if (!user) {
    throw new Error('User not found');
  }

  // Find agent by assistant ID
  const agents = await serverDb.aiAgents.findByUserId(user.id);
  const agent = agents.find(agent => {
    const config = JSON.parse(agent.config);
    return config.assistantId === payload.assistantId;
  });

  if (!agent) {
    throw new Error('AI Agent not found');
  }

  // Create a new thread
  const threadId = await createThread(user.id);

  // Create a new chat session
  const chat = await serverDb.chats.create({
    agentId: agent.id,
    userId: user.id,
    threadId,
    source: 'webhook',
    metadata: JSON.stringify(payload.metadata || {})
  });

  // Save the user message
  await serverDb.messages.create({
    chatId: chat.id,
    role: 'user',
    content: payload.message
  });

  // Get agent response
  const config = JSON.parse(agent.config);
  const response = await sendMessage(
    user.id,
    threadId,
    config.assistantId,
    payload.message
  );

  // Save the assistant message
  await serverDb.messages.create({
    chatId: chat.id,
    role: 'assistant',
    content: response
  });

  return response;
}