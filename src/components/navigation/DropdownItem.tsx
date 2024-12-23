import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme, themes } from '../../lib/theme-context';

interface DropdownItemProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function DropdownItem({ to, icon, children }: DropdownItemProps) {
  const { theme } = useTheme();
  const currentTheme = themes[theme];

  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm ${currentTheme.navTextHover}`}
    >
      {React.cloneElement(icon as React.ReactElement, {
        className: 'mr-3 h-5 w-5',
      })}
      {children}
    </Link>
  );
}