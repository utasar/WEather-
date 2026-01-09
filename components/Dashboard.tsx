/**
 * Dashboard.tsx
 * Dynamic dashboard with location tracking and AI recommendations
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getCurrentLocation, hasUserMoved, storeLocation, Location } from '@/utils/locationUtils';
import { getUserSettings } from '@/utils/settingsUtils';
import { SpeechUtility } from '@/utils/SpeechUtility';
import { NotificationLogic } from '@/utils/NotificationLogic';
import SettingsPanel from './SettingsPanel';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
}

interface AIRecommendations {
  greeting: string;
  mantra: string;
  clothing: string[];
  activities: string[];
  healthTips: string[];
  packingList?: string[];
  travelTips?: string[];
  summary: string;
}

export default function Dashboard() {
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [ai, setAi] = useState<AIRecommendations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [destinationMode, setDestinationMode] = useState(false);
  const [destinationLat, setDestinationLat] = useState('');
  const [destinationLon, setDestinationLon] = useState('');

  const fetchWeatherData = useCallback(async (loc: Location, destLat?: number, destLon?: number) => {
    try {
      setLoading(true);
      setError(null);

      const settings = getUserSettings();
      
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lat: loc.lat,
          lon: loc.lon,
          destinationLat: destLat,
          destinationLon: destLon,
          settings: {
            clothingStyle: settings.clothingStyle,
            activityLevel: settings.activityLevel,
            tempSensitivity: settings.tempSensitivity,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setWeather(data.weather);
      setAi(data.ai);

      // Check for weather anomalies and send notifications
      if (data.weather) {
        NotificationLogic.detectAndNotify(data.weather);
      }

      // Store location for tracking movement
      storeLocation(loc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationUpdate = useCallback(async () => {
    try {
      const currentLoc = await getCurrentLocation();
      setLocation(currentLoc);

      // Check if user has moved more than 10 km
      if (hasUserMoved(currentLoc, 10)) {
        await fetchWeatherData(currentLoc);
      }
    } catch (err) {
      setError('Failed to get location. Please enable location services.');
    }
  }, [fetchWeatherData]);

  useEffect(() => {
    // Initialize utilities
    SpeechUtility.init();
    NotificationLogic.init();

    // Get initial location and weather
    const initializeApp = async () => {
      try {
        const currentLoc = await getCurrentLocation();
        setLocation(currentLoc);
        await fetchWeatherData(currentLoc);
      } catch (err) {
        setError('Failed to get location. Please enable location services.');
        setLoading(false);
      }
    };

    initializeApp();

    // Set up location tracking interval (check every 5 minutes)
    const locationInterval = setInterval(handleLocationUpdate, 5 * 60 * 1000);

    return () => {
      clearInterval(locationInterval);
    };
  }, [fetchWeatherData, handleLocationUpdate]);

  const handleSpeak = () => {
    if (isSpeaking) {
      SpeechUtility.stop();
      setIsSpeaking(false);
    } else if (ai) {
      const textToSpeak = `${ai.greeting}. ${ai.mantra}`;
      SpeechUtility.speak(textToSpeak);
      setIsSpeaking(true);
      
      // Reset speaking state after estimated duration
      setTimeout(() => setIsSpeaking(false), textToSpeak.length * 50);
    }
  };

  const handleTravelerMode = async () => {
    if (!location) return;

    const destLat = parseFloat(destinationLat);
    const destLon = parseFloat(destinationLon);

    if (isNaN(destLat) || isNaN(destLon)) {
      setError('Invalid destination coordinates');
      return;
    }

    await fetchWeatherData(location, destLat, destLon);
    setDestinationMode(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="text-white text-2xl">Loading Nova...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <div className="text-white text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4 md:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          ✨ Nova
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setDestinationMode(!destinationMode)}
            className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all"
          >
            ✈️ Traveler
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all"
          >
            ⚙️ Settings
          </button>
        </div>
      </header>

      {/* Traveler Mode Input */}
      {destinationMode && (
        <div className="mb-6 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl">
          <h3 className="text-xl font-semibold text-white mb-4">Enter Destination</h3>
          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              placeholder="Latitude"
              value={destinationLat}
              onChange={(e) => setDestinationLat(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
              step="any"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={destinationLon}
              onChange={(e) => setDestinationLon(e.target.value)}
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50"
              step="any"
            />
            <button
              onClick={handleTravelerMode}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Compare
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">
            {weather?.name || 'Current Location'}
          </h2>
          {weather && (
            <>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-6xl">
                  {weather.weather[0].main === 'Clear' && '☀️'}
                  {weather.weather[0].main === 'Clouds' && '☁️'}
                  {weather.weather[0].main === 'Rain' && '🌧️'}
                  {weather.weather[0].main === 'Snow' && '❄️'}
                  {weather.weather[0].main === 'Thunderstorm' && '⛈️'}
                  {!['Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm'].includes(weather.weather[0].main) && '🌤️'}
                </div>
                <div>
                  <div className="text-5xl font-bold text-white">
                    {Math.round(weather.main.temp)}°C
                  </div>
                  <div className="text-white/80 text-lg">
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>
              </div>
              <div className="text-white/90 text-lg capitalize mb-4">
                {weather.weather[0].description}
              </div>
              <div className="grid grid-cols-2 gap-4 text-white/80">
                <div>💧 Humidity: {weather.main.humidity}%</div>
                <div>💨 Wind: {(weather.wind.speed * 3.6).toFixed(1)} km/h</div>
              </div>
            </>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">AI Insights</h2>
            <button
              onClick={handleSpeak}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                isSpeaking
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              } text-white`}
            >
              {isSpeaking ? '🔇 Stop' : '🔊 Speak'}
            </button>
          </div>
          {ai && (
            <div className="space-y-4">
              <div className="text-white/90 text-lg">{ai.greeting}</div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="text-white/70 text-sm mb-1">Daily Mantra</div>
                <div className="text-white font-semibold italic">&quot;{ai.mantra}&quot;</div>
              </div>
              
              {ai.clothing && ai.clothing.length > 0 && (
                <div>
                  <div className="text-white/70 text-sm mb-2">👔 Clothing</div>
                  <ul className="list-disc list-inside text-white/90 space-y-1">
                    {ai.clothing.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai.activities && ai.activities.length > 0 && (
                <div>
                  <div className="text-white/70 text-sm mb-2">🎯 Activities</div>
                  <ul className="list-disc list-inside text-white/90 space-y-1">
                    {ai.activities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai.healthTips && ai.healthTips.length > 0 && (
                <div>
                  <div className="text-white/70 text-sm mb-2">💚 Health Tips</div>
                  <ul className="list-disc list-inside text-white/90 space-y-1">
                    {ai.healthTips.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai.packingList && ai.packingList.length > 0 && (
                <div>
                  <div className="text-white/70 text-sm mb-2">🧳 Packing List</div>
                  <ul className="list-disc list-inside text-white/90 space-y-1">
                    {ai.packingList.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {ai.travelTips && ai.travelTips.length > 0 && (
                <div>
                  <div className="text-white/70 text-sm mb-2">✈️ Travel Tips</div>
                  <ul className="list-disc list-inside text-white/90 space-y-1">
                    {ai.travelTips.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
