import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme, themes } from '../../lib/theme-context';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

export function NavItem({ to, icon, children, isActive }: NavItemProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? `${currentTheme.primary} ${currentTheme.buttonText}`
          : `${currentTheme.navText} ${currentTheme.navTextHover}`
      }`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: 'mr-3 h-5 w-5',
      })}
      {children}
    </Link>
  );
}