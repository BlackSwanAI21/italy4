import { ThemeType, themes, ThemeColors } from './theme-context';

export function getThemeClasses(theme: ThemeType, element: keyof ThemeColors): string {
  const themeColors = themes[theme];
  return themeColors[element] || '';
}

export function applyThemeToElement(element: HTMLElement | null, theme: ThemeType): void {
  if (!element) return;
  
  const themeValue = validateTheme(theme);
  element.setAttribute('data-theme', themeValue);
  
  // Apply theme background
  const bgClass = getThemeClasses(themeValue, 'background');
  if (bgClass) {
    element.classList.forEach(cls => {
      if (cls.startsWith('bg-')) {
        element.classList.remove(cls);
      }
    });
    element.classList.add(bgClass);
  }
}

// Helper function to ensure theme value is valid
export function validateTheme(theme: ThemeType): ThemeType {
  const defaultTheme: ThemeType = 'light';
  if (!theme || !Object.keys(themes).includes(theme)) {
    return defaultTheme;
  }
  return theme;
}