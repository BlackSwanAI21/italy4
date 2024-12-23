import React from 'react';

interface StatusIndicatorProps {
  type: 'time' | 'moderation';
}

export function StatusIndicator({ type }: StatusIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
        <div className="absolute inset-0 h-3 w-3 bg-green-500 rounded-full animate-ping"></div>
      </div>
      <span className="text-sm text-green-600 font-medium">
        {type === 'time' ? 'Time Detection Active' : 'AI Moderation Active'}
      </span>
    </div>
  );
}