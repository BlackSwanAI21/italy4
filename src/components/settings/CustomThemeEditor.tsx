import React from 'react';
import { useTheme, ThemeColors } from '../../lib/theme-context';
import { Button } from '../Button';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-8 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}

export function CustomThemeEditor() {
  const { customColors, applyTheme } = useTheme();
  const [localColors, setLocalColors] = React.useState<ThemeColors>(customColors);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleSave = () => {
    setIsSaving(true);
    applyTheme('custom', localColors);
    setShowSuccess(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(false);
    }, 1500);
  };

  const handleColorChange = (key: keyof ThemeColors, value: string) => {
    setLocalColors(prev => ({
      ...prev,
      [key]: value,
      // Automatically set hover color slightly darker
      ...(key === 'primary' && {
        primaryHover: adjustColorBrightness(value, -10)
      })
    }));
  };

  // Helper function to darken/lighten colors
  function adjustColorBrightness(hex: string, percent: number) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Custom Theme</h3>
        <p className="mt-1 text-sm text-gray-500">
          Create your own theme by customizing colors
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ColorPicker
          label="Primary Color"
          value={localColors.primary}
          onChange={(value) => handleColorChange('primary', value)}
        />
        <ColorPicker
          label="Background Color"
          value={localColors.background}
          onChange={(value) => handleColorChange('background', value)}
        />
        <ColorPicker
          label="Card Color"
          value={localColors.card}
          onChange={(value) => handleColorChange('card', value)}
        />
        <ColorPicker
          label="Text Color"
          value={localColors.text}
          onChange={(value) => handleColorChange('text', value)}
        />
        <ColorPicker
          label="Secondary Text Color"
          value={localColors.textSecondary}
          onChange={(value) => handleColorChange('textSecondary', value)}
        />
        <ColorPicker
          label="Border Color"
          value={localColors.border}
          onChange={(value) => handleColorChange('border', value)}
        />
        <ColorPicker
          label="Button Text Color"
          value={localColors.buttonText}
          onChange={(value) => handleColorChange('buttonText', value)}
        />
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          isLoading={isSaving}
          className="relative"
        >
          {showSuccess ? (
            <span className="flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Theme Applied
            </span>
          ) : (
            'Save & Apply Theme'
          )}
        </Button>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900">Preview</h4>
        <div
          className="mt-2 p-4 rounded-lg"
          style={{ backgroundColor: localColors.background }}
        >
          <div
            className="p-4 rounded-lg"
            style={{
              backgroundColor: localColors.card,
              borderColor: localColors.border,
              borderWidth: 1
            }}
          >
            <h5
              className="text-lg font-medium"
              style={{ color: localColors.text }}
            >
              Sample Card
            </h5>
            <p
              className="mt-1"
              style={{ color: localColors.textSecondary }}
            >
              This is how your theme will look
            </p>
            <button
              className="mt-4 px-4 py-2 rounded-md transition-colors"
              style={{ 
                backgroundColor: localColors.primary,
                color: localColors.buttonText
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = localColors.primaryHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = localColors.primary;
              }}
            >
              Sample Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}