import React, { createContext, useContext, useState } from 'react';

export type ThemeType = 'light' | 'dark' | 'forest' | 'ocean' | 'custom';

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  buttonText: string;
  navText: string;
  navTextHover: string;
  navBackground: string;
  logo?: string;
}

export const themes: Record<ThemeType, ThemeColors> = {
  light: {
    primary: 'bg-blue-600',
    primaryHover: 'hover:bg-blue-700',
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
    buttonText: 'text-white',
    navText: 'text-gray-700',
    navTextHover: 'hover:text-gray-900 hover:bg-gray-100',
    navBackground: 'bg-white'
  },
  dark: {
    primary: 'bg-purple-600',
    primaryHover: 'hover:bg-purple-700',
    background: 'bg-gray-900',
    card: 'bg-gray-800',
    text: 'text-white',
    textSecondary: 'text-gray-400',
    border: 'border-gray-700',
    buttonText: 'text-white',
    navText: 'text-white',
    navTextHover: 'hover:text-white hover:bg-gray-700',
    navBackground: 'bg-gray-800'
  },
  forest: {
    primary: 'bg-emerald-600',
    primaryHover: 'hover:bg-emerald-700',
    background: 'bg-emerald-50',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-emerald-200',
    buttonText: 'text-white',
    navText: 'text-white',
    navTextHover: 'hover:text-white hover:bg-emerald-600',
    navBackground: 'bg-emerald-700'
  },
  ocean: {
    primary: 'bg-blue-500',
    primaryHover: 'hover:bg-blue-600',
    background: 'bg-blue-50',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    border: 'border-blue-200',
    buttonText: 'text-white',
    navText: 'text-white',
    navTextHover: 'hover:text-white hover:bg-blue-500',
    navBackground: 'bg-blue-600'
  },
  custom: {
    primary: 'bg-indigo-600',
    primaryHover: 'hover:bg-indigo-700',
    background: 'bg-gray-50',
    card: 'bg-white',
    text: 'text-gray-900',
    textSecondary: 'text-gray-500',
    border: 'border-gray-200',
    buttonText: 'text-white',
    navText: 'text-gray-900',
    navTextHover: 'hover:text-gray-900 hover:bg-gray-100',
    navBackground: 'bg-white'
  }
};

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  customColors: ThemeColors;
  setCustomColors: React.Dispatch<React.SetStateAction<ThemeColors>>;
  applyTheme: (theme: ThemeType, colors?: ThemeColors) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeType>('light');
  const [customColors, setCustomColors] = useState<ThemeColors>(themes.custom);

  const applyTheme = (newTheme: ThemeType, colors?: ThemeColors) => {
    setTheme(newTheme);
    if (newTheme === 'custom' && colors) {
      setCustomColors(colors);
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      customColors, 
      setCustomColors,
      applyTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}