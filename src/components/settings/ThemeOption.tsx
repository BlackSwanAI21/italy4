import React from 'react';
import { Check } from 'lucide-react';
import { ThemeType, themes } from '../../lib/theme-context';
import { ThemePreview } from './ThemePreview';

interface ThemeOptionProps {
  id: ThemeType;
  name: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export function ThemeOption({ 
  id, 
  name, 
  description, 
  isSelected, 
  onClick 
}: ThemeOptionProps) {
  return (
    <div
      className={`relative rounded-lg border p-4 cursor-pointer transition-all ${
        isSelected
          ? `border-${themes[id].primary}-500 ring-2 ring-${themes[id].primary}-500`
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-base font-medium text-gray-900">{name}</h4>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        {isSelected && (
          <div className={`text-${themes[id].primary}-500`}>
            <Check className="h-5 w-5" />
          </div>
        )}
      </div>
      
      <ThemePreview themeId={id} />
    </div>
  );
}