import React from 'react';
import { useTheme, ThemeType } from '../../lib/theme-context';
import { ThemeOption } from './ThemeOption';
import { CustomThemeEditor } from './CustomThemeEditor';

const themeOptions: { id: ThemeType; name: string; description: string }[] = [
  {
    id: 'light',
    name: 'Light Theme',
    description: 'Clean and bright interface for optimal visibility'
  },
  {
    id: 'dark',
    name: 'Dark Theme',
    description: 'Easy on the eyes, perfect for night time use'
  },
  {
    id: 'forest',
    name: 'Forest Theme',
    description: 'Calming green tones inspired by nature'
  },
  {
    id: 'ocean',
    name: 'Ocean Theme',
    description: 'Serene blue hues reminiscent of the sea'
  }
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Preset Themes</h3>
        <p className="text-sm text-gray-500">
          Choose from our carefully designed themes
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {themeOptions.map((option) => (
          <ThemeOption
            key={option.id}
            id={option.id}
            name={option.name}
            description={option.description}
            isSelected={theme === option.id}
            onClick={() => setTheme(option.id)}
          />
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <CustomThemeEditor />
      </div>
    </div>
  );
}