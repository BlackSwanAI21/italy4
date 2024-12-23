import React from 'react';
import { Navigation } from './Navigation';
import { useTheme, themes } from '../lib/theme-context';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <div className={`min-h-screen ${currentTheme.background}`}>
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}