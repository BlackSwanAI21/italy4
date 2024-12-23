import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { NotificationsProvider } from './lib/notifications-context';
import { ThemeProvider } from './lib/theme-context';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { SettingsPage } from './pages/Settings';
import { AccountCustomizationPage } from './pages/AccountCustomization';
import { CreateAgentPage } from './pages/CreateAgent';
import { ImportAgentPage } from './pages/ImportAgent';
import { AgentsPage } from './pages/Agents';
import { ChatPage } from './pages/Chat';
import { ChatHistoryPage } from './pages/ChatHistory';
import { PublicChat } from './pages/PublicChat'; // Updated import
import { GHLImportPage } from './pages/GHLImport';
import { ApiDocsPage } from './pages/ApiDocs';
import { PrivateRoute } from './components/PrivateRoute';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <Routes>
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <SettingsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings/customization"
                element={
                  <PrivateRoute>
                    <AccountCustomizationPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/agents"
                element={
                  <PrivateRoute>
                    <AgentsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/agents/create"
                element={
                  <PrivateRoute>
                    <CreateAgentPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/agents/import"
                element={
                  <PrivateRoute>
                    <ImportAgentPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/:agentId"
                element={
                  <PrivateRoute>
                    <ChatPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/chat/:agentId/history"
                element={
                  <PrivateRoute>
                    <ChatHistoryPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ghl-import"
                element={
                  <PrivateRoute>
                    <GHLImportPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/api"
                element={
                  <PrivateRoute>
                    <ApiDocsPage />
                  </PrivateRoute>
                }
              />
              <Route path="/share/:agentId" element={<PublicChat />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}