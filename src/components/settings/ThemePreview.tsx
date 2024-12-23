import React from 'react';
import { ThemeType, themes } from '../../lib/theme-context';

interface ThemePreviewProps {
  themeId: ThemeType;
}

export function ThemePreview({ themeId }: ThemePreviewProps) {
  const theme = themes[themeId];
  
  return (
    <div className={`mt-4 h-12 rounded-md ${theme.background}`}>
      <div className={`h-full w-1/3 rounded-l-md ${theme.card} border-r ${theme.border}`} />
    </div>
  );
}