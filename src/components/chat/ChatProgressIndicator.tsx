import React from 'react';
import { Circle } from 'lucide-react';

export type ChatStage = 'new' | 'responded' | 'qualified' | 'converted';

interface ChatProgressIndicatorProps {
  currentStage: ChatStage;
}

interface StageConfig {
  color: string;
  bgColor: string;
  label: string;
}

const stages: Record<ChatStage, StageConfig> = {
  new: {
    color: 'bg-blue-500',
    bgColor: 'bg-blue-100',
    label: 'New Lead - No Response'
  },
  responded: {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-100',
    label: 'Lead Responded'
  },
  qualified: {
    color: 'bg-orange-500',
    bgColor: 'bg-orange-100',
    label: 'Lead Qualified'
  },
  converted: {
    color: 'bg-green-500',
    bgColor: 'bg-green-100',
    label: 'Lead Converted'
  }
};

const stageOrder: ChatStage[] = ['new', 'responded', 'qualified', 'converted'];

export function ChatProgressIndicator({ currentStage }: ChatProgressIndicatorProps) {
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 mb-4">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="h-2 bg-gray-200 rounded-full" />

        {/* Active Progress Bar */}
        <div 
          className={`absolute top-0 h-2 rounded-full transition-all duration-500 ease-in-out ${stages[currentStage].color}`}
          style={{ 
            width: `${((currentIndex + 1) / stageOrder.length) * 100}%`
          }}
        />

        {/* Stage Indicators */}
        <div className="absolute top-0 w-full flex justify-between transform -translate-y-1/2">
          {stageOrder.map((stage, index) => {
            const isActive = index <= currentIndex;
            const config = stages[stage];
            
            return (
              <div key={stage} className="relative group">
                <Circle 
                  className={`w-6 h-6 ${isActive ? config.color : 'bg-gray-300'} rounded-full transition-colors duration-200`}
                  fill="currentColor"
                />
                
                {/* Stage Label */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                  <div className={`px-3 py-1 rounded text-xs font-medium ${
                    isActive ? config.bgColor : 'bg-gray-100'
                  } ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                    {config.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}