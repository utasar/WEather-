/**
 * settingsUtils.ts
 * User preferences and settings management
 */

export interface UserSettings {
  clothingStyle: 'casual' | 'formal' | 'sporty' | 'minimal';
  activityLevel: 'low' | 'moderate' | 'high' | 'athletic';
  tempSensitivity: 'cold' | 'normal' | 'warm';
  morningBriefing: boolean;
  units: 'metric' | 'imperial';
  language: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  clothingStyle: 'casual',
  activityLevel: 'moderate',
  tempSensitivity: 'normal',
  morningBriefing: true,
  units: 'metric',
  language: 'en',
};

/**
 * Get user settings from localStorage
 */
export function getUserSettings(): UserSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_SETTINGS;
  }

  const stored = localStorage.getItem('userSettings');
  if (!stored) return DEFAULT_SETTINGS;
  
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save user settings to localStorage
 */
export function saveUserSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return;
  
  const current = getUserSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('userSettings', JSON.stringify(updated));
}

/**
 * Get temperature adjustment based on user sensitivity
 */
export function getTempAdjustment(sensitivity: UserSettings['tempSensitivity']): number {
  switch (sensitivity) {
    case 'cold':
      return -3; // User feels colder, adjust recommendations
    case 'warm':
      return 3; // User feels warmer
    default:
      return 0;
  }
}

/**
 * Get activity descriptor for AI prompts
 */
export function getActivityDescriptor(level: UserSettings['activityLevel']): string {
  switch (level) {
    case 'low':
      return 'mostly sedentary, working indoors';
    case 'moderate':
      return 'moderate activity, occasional walks';
    case 'high':
      return 'active lifestyle, frequent outdoor activities';
    case 'athletic':
      return 'highly athletic, regular intense exercise';
    default:
      return 'moderate activity';
  }
}

/**
 * Get clothing style descriptor for AI prompts
 */
export function getClothingStyleDescriptor(style: UserSettings['clothingStyle']): string {
  switch (style) {
    case 'casual':
      return 'comfortable casual wear';
    case 'formal':
      return 'professional business attire';
    case 'sporty':
      return 'athletic and activewear';
    case 'minimal':
      return 'minimalist and simple clothing';
    default:
      return 'casual wear';
  }
}
