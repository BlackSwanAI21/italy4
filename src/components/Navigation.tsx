import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Plus, List, Home, Settings, Bell, Code, Download, ChevronDown, Users, Import, Key, Palette } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { useNotifications } from '../lib/notifications-context';
import { useTheme, themes } from '../lib/theme-context';
import { NotificationPanel } from './NotificationPanel';
import { NavItem } from './navigation/NavItem';
import { DropdownItem } from './navigation/DropdownItem';

export function Navigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAgentsDropdown, setShowAgentsDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const { notifications, markAsRead } = useNotifications();
  const { theme, customColors } = useTheme();
  const currentTheme = themes[theme];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className={`${currentTheme.navBackground}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {customColors.logo ? (
                <img
                  src={customColors.logo}
                  alt="Company logo"
                  className="h-8 w-auto"
                />
              ) : (
                <span className={`text-xl font-bold ${currentTheme.navText}`}>
                  AI Agent Hub
                </span>
              )}
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavItem
                  to="/dashboard"
                  icon={<Home />}
                  isActive={location.pathname === '/dashboard'}
                >
                  Dashboard
                </NavItem>

                <div className="relative">
                  <button
                    onClick={() => setShowAgentsDropdown(!showAgentsDropdown)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentTheme.navText}`}
                  >
                    <Users className="mr-3 h-5 w-5" />
                    Agents
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>

                  {showAgentsDropdown && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <DropdownItem to="/agents/create" icon={<Plus />}>
                          Create Agent
                        </DropdownItem>
                        <DropdownItem to="/agents" icon={<List />}>
                          My Agents
                        </DropdownItem>
                        <DropdownItem to="/agents/import" icon={<Import />}>
                          Import Agent
                        </DropdownItem>
                      </div>
                    </div>
                  )}
                </div>

                <NavItem
                  to="/ghl-import"
                  icon={<Download />}
                  isActive={location.pathname === '/ghl-import'}
                >
                  GHL Actions
                </NavItem>

                <div className="relative">
                  <button
                    onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentTheme.navText}`}
                  >
                    <Settings className="mr-3 h-5 w-5" />
                    Settings
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>

                  {showSettingsDropdown && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="py-1">
                        <DropdownItem to="/settings" icon={<Key />}>
                          OpenAI API Key
                        </DropdownItem>
                        <DropdownItem to="/settings/customization" icon={<Palette />}>
                          Customization
                        </DropdownItem>
                        <DropdownItem to="/api" icon={<Code />}>
                          API
                        </DropdownItem>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-1 rounded-full ${currentTheme.navText}`}
              >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationPanel
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
                notifications={notifications}
                onMarkAsRead={markAsRead}
              />
            </div>
            <span className={currentTheme.navText}>
              {user?.name || user?.email}
            </span>
            <button
              onClick={() => logout()}
              className={`flex items-center ${currentTheme.navText}`}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-2">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}