import { z } from 'zod';

const customValueSchema = z.object({
  id: z.string(),
  name: z.string(),
  fieldKey: z.string(),
  value: z.string().optional()
});

type CustomValue = z.infer<typeof customValueSchema>;

export async function getCustomValues(apiKey: string): Promise<CustomValue[]> {
  try {
    const response = await fetch('https://rest.gohighlevel.com/v1/custom-values', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GHL API Error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data.customValues || [];
  } catch (error) {
    console.error('GHL API Error:', error);
    throw error;
  }
}

export async function findWebhookCustomValue(apiKey: string): Promise<CustomValue | undefined> {
  try {
    const customValues = await getCustomValues(apiKey);
    return customValues.find(cv => cv.name === 'Webook: Chat GPT-3');
  } catch (error) {
    console.error('Failed to find webhook custom value:', error);
    throw error;
  }
}

export async function updateCustomValue(
  apiKey: string,
  customValueId: string,
  value: string
): Promise<void> {
  try {
    const response = await fetch(
      `https://rest.gohighlevel.com/v1/custom-values/${customValueId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`GHL API Error: ${errorData.message || response.statusText}`);
    }
  } catch (error) {
    console.error('GHL API Error:', error);
    throw error;
  }
}

export async function setupGHLIntegration(
  apiKey: string,
  locationId: string,
  assistantId: string,
  openingMessage: string,
  userEmail: string,
  openaiApiKey: string | null
): Promise<void> {
  try {
    if (!apiKey || !locationId || !assistantId || !openingMessage || !userEmail) {
      throw new Error('All fields are required');
    }

    // Get custom values
    const customValues = await getCustomValues(apiKey);
    
    // Find required field IDs
    const assistantIdField = customValues.find(cv => cv.name === 'AssistantID');
    const firstMessageField = customValues.find(cv => cv.name === 'First Outgoing Message');
    const webhookField = await findWebhookCustomValue(apiKey);
    const appEmailField = customValues.find(cv => cv.name === 'App Email');
    const aiKeyField = customValues.find(cv => cv.name === 'AI Key');
    const ghlApiKeyField = customValues.find(cv => cv.name === 'GHL API Key');
    const ghlLocationIdField = customValues.find(cv => cv.name === 'GHL Location ID');

    if (!assistantIdField?.id || !firstMessageField?.id || !webhookField?.id || 
        !appEmailField?.id || !aiKeyField?.id || !ghlApiKeyField?.id || !ghlLocationIdField?.id) {
      throw new Error('Required custom fields not found in GHL. Please ensure all required fields are set up in your GHL account.');
    }

    // Update custom values
    await Promise.all([
      updateCustomValue(apiKey, assistantIdField.id, assistantId),
      updateCustomValue(apiKey, firstMessageField.id, openingMessage),
      updateCustomValue(apiKey, webhookField.id, 'https://n8n-dtqa.onrender.com/webhook/main-ai-convo'),
      updateCustomValue(apiKey, appEmailField.id, userEmail),
      updateCustomValue(apiKey, ghlApiKeyField.id, apiKey),
      updateCustomValue(apiKey, ghlLocationIdField.id, locationId),
      // Only update AI Key if it's provided
      ...(openaiApiKey ? [updateCustomValue(apiKey, aiKeyField.id, openaiApiKey)] : [])
    ]);

  } catch (error) {
    console.error('GHL Integration Error:', error);
    throw error;
  }
}