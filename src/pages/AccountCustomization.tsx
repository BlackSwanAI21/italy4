import React from 'react';
import { MainLayout } from '../components/MainLayout';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { LogoUploader } from '../components/settings/LogoUploader';

export function AccountCustomizationPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Account Customization
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Personalize your AI Agent Hub experience
            </p>
          </div>

          <div className="px-4 py-5 sm:p-6 space-y-8">
            <LogoUploader />
            <div className="border-t border-gray-200 pt-8">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}