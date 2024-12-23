import { useState, useEffect } from 'react';
import { ChatStage } from '../components/chat/ChatProgressIndicator';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Keywords that indicate the AI is trying to qualify the lead
const QUALIFICATION_KEYWORDS = [
  'would you like to speak',
  'would you like to talk',
  'can arrange a call',
  'schedule a call',
  'book a consultation',
  'speak with an advisor',
  'talk to an advisor',
  'chat with an advisor',
  'available for a call',
  'set up a meeting',
  'book an appointment',
  'when would suit you',
  'what time works best',
  'discuss this further',
  'discuss your requirements',
  'discuss your needs'
];

// Keywords that indicate the lead has agreed to a call/meeting
const CONVERSION_KEYWORDS = [
  'call me at',
  'call me on',
  'available at',
  'free at',
  'works for me',
  'can do',
  'call now',
  'speak now',
  'talk now',
  'available now',
  'right now'
];

// Time-related patterns that indicate scheduling
const TIME_PATTERNS = [
  /\d{1,2}(?::\d{2})?\s*(?:am|pm)/i,  // 3pm, 3:30pm
  /\d{1,2}(?::\d{2})?(?:\s*h(?:rs)?)?/i,  // 15:00, 15hrs
  /(?:0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/,  // 24-hour format
  /\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i,  // Days
  /\b(morning|afternoon|evening)\b/i  // Time of day
];

const STAGE_ORDER: ChatStage[] = ['new', 'responded', 'qualified', 'converted'];

function checkForQualification(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Check for qualification keywords
  return QUALIFICATION_KEYWORDS.some(keyword => {
    // Only match if the keyword appears as a complete phrase
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lowerMessage);
  });
}

function checkForConversion(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Check for conversion keywords
  const hasConversionKeyword = CONVERSION_KEYWORDS.some(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lowerMessage);
  });
  
  // Check for time patterns
  const hasTimePattern = TIME_PATTERNS.some(pattern => 
    pattern.test(message)
  );

  return hasConversionKeyword || hasTimePattern;
}

function getNextStage(currentStage: ChatStage): ChatStage {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);
  if (currentIndex < STAGE_ORDER.length - 1) {
    return STAGE_ORDER[currentIndex + 1];
  }
  return currentStage;
}

export function useChatStage(messages: Message[]): ChatStage {
  const [stage, setStage] = useState<ChatStage>('new');
  const [previousStage, setPreviousStage] = useState<ChatStage>('new');

  useEffect(() => {
    if (messages.length === 0) {
      setStage('new');
      setPreviousStage('new');
      return;
    }

    // Get the latest messages
    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    // Determine the next stage based on the current stage and message content
    let nextStage = stage;

    // Check for first user response (new -> responded)
    if (stage === 'new' && userMessages.length > 0) {
      nextStage = 'responded';
    }
    // Check for qualification (responded -> qualified)
    else if (stage === 'responded') {
      const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
      if (lastAssistantMessage && checkForQualification(lastAssistantMessage.content)) {
        nextStage = 'qualified';
      }
    }
    // Check for conversion (qualified -> converted)
    else if (stage === 'qualified') {
      const lastUserMessage = userMessages[userMessages.length - 1];
      if (lastUserMessage && checkForConversion(lastUserMessage.content)) {
        nextStage = 'converted';
      }
    }

    // Only update stage if it's moving forward in the sequence
    if (STAGE_ORDER.indexOf(nextStage) > STAGE_ORDER.indexOf(previousStage)) {
      setPreviousStage(stage);
      setStage(nextStage);
    }
  }, [messages, stage, previousStage]);

  return stage;
}