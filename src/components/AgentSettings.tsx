import React, { useState } from 'react';
import { Clock, Shield, Check } from 'lucide-react';
import { Button } from './Button';
import { StatusIndicator } from './StatusIndicator';

interface AgentSettingsProps {
  agentName: string;
  onSave: (settings: {
    timeDetectionEnabled: boolean;
    selectedTimezone: string;
    moderationEnabled: boolean;
    moderationStrength: number;
  }) => void;
}

export function AgentSettings({ agentName, onSave }: AgentSettingsProps) {
  const [timeDetectionEnabled, setTimeDetectionEnabled] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [moderationEnabled, setModerationEnabled] = useState(false);
  const [moderationStrength, setModerationStrength] = useState(5);
  const [isSaving, setIsSaving] = useState(false);
  const [isSettingsSaved, setIsSettingsSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave({
      timeDetectionEnabled,
      selectedTimezone,
      moderationEnabled,
      moderationStrength
    });
    setIsSaving(false);
    setIsSettingsSaved(true);
    
    // After 1 second, collapse the settings panel
    setTimeout(() => {
      setShowSettings(false);
    }, 1000);
  };

  // List of all timezones
  const timezones = Intl.supportedValuesOf('timeZone');

  if (!showSettings) {
    return (
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {agentName}
            </h3>
            <button
              onClick={() => setShowSettings(true)}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Edit Settings
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {timeDetectionEnabled && <StatusIndicator type="time" />}
            {moderationEnabled && <StatusIndicator type="moderation" />}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg font-medium text-gray-900">
          Agent Settings: {agentName}
        </h3>
      </div>

      <div className="px-4 py-5 sm:p-6 space-y-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={timeDetectionEnabled}
              onChange={(e) => setTimeDetectionEnabled(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label className="font-medium text-gray-700 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Enable Time Detection
            </label>
          </div>
        </div>

        {timeDetectionEnabled && (
          <div className="ml-7">
            <label className="block text-sm font-medium text-gray-700">
              Select Timezone
            </label>
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              checked={moderationEnabled}
              onChange={(e) => setModerationEnabled(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3">
            <label className="font-medium text-gray-700 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Enable AI Moderation
            </label>
          </div>
        </div>

        {moderationEnabled && (
          <div className="ml-7 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Moderation Strength: {moderationStrength}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={moderationStrength}
              onChange={(e) => setModerationStrength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Weak</span>
              <span>Strong</span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <Button 
            onClick={handleSave} 
            isLoading={isSaving}
            className={isSettingsSaved ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {isSettingsSaved ? (
              <span className="flex items-center">
                <Check className="h-5 w-5 mr-2" />
                Settings Saved
              </span>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}