/**
 * SettingsPanel.tsx
 * User preferences and settings interface
 */

'use client';

import React, { useState, useEffect } from 'react';
import { getUserSettings, saveUserSettings, UserSettings } from '@/utils/settingsUtils';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState<UserSettings>({
    clothingStyle: 'casual',
    activityLevel: 'moderate',
    tempSensitivity: 'normal',
    morningBriefing: true,
    units: 'metric',
    language: 'en',
  });

  useEffect(() => {
    const loadedSettings = getUserSettings();
    setSettings(loadedSettings);
  }, []);

  const handleChange = (key: keyof UserSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveUserSettings({ [key]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 m-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl font-bold"
          aria-label="Close settings"
        >
          ×
        </button>

        {/* Header */}
        <h2 className="text-3xl font-bold text-white mb-6">⚙️ Settings</h2>

        {/* Settings sections */}
        <div className="space-y-6">
          {/* Clothing Style */}
          <div className="space-y-2">
            <label className="block text-white/90 font-semibold text-lg">
              Clothing Style
            </label>
            <select
              value={settings.clothingStyle}
              onChange={(e) => handleChange('clothingStyle', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="casual">Casual</option>
              <option value="formal">Formal</option>
              <option value="sporty">Sporty</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>

          {/* Activity Level */}
          <div className="space-y-2">
            <label className="block text-white/90 font-semibold text-lg">
              Activity Level
            </label>
            <select
              value={settings.activityLevel}
              onChange={(e) => handleChange('activityLevel', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="low">Low (Sedentary)</option>
              <option value="moderate">Moderate</option>
              <option value="high">High (Active)</option>
              <option value="athletic">Athletic</option>
            </select>
          </div>

          {/* Temperature Sensitivity */}
          <div className="space-y-2">
            <label className="block text-white/90 font-semibold text-lg">
              Temperature Sensitivity
            </label>
            <select
              value={settings.tempSensitivity}
              onChange={(e) => handleChange('tempSensitivity', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="cold">I feel cold easily</option>
              <option value="normal">Normal</option>
              <option value="warm">I feel warm easily</option>
            </select>
          </div>

          {/* Units */}
          <div className="space-y-2">
            <label className="block text-white/90 font-semibold text-lg">
              Units
            </label>
            <select
              value={settings.units}
              onChange={(e) => handleChange('units', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="metric">Metric (°C, km/h)</option>
              <option value="imperial">Imperial (°F, mph)</option>
            </select>
          </div>

          {/* Morning Briefing Toggle */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <label className="block text-white/90 font-semibold text-lg">
                Morning Briefing
              </label>
              <p className="text-white/60 text-sm mt-1">
                Receive daily weather updates and recommendations
              </p>
            </div>
            <button
              onClick={() => handleChange('morningBriefing', !settings.morningBriefing)}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                settings.morningBriefing ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  settings.morningBriefing ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
}
