/**
 * locationUtils.ts
 * Utilities for location tracking and distance calculation
 */

export interface Location {
  lat: number;
  lon: number;
  name?: string;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(
  loc1: Location,
  loc2: Location
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lon - loc1.lon);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(loc1.lat)) *
    Math.cos(toRad(loc2.lat)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Get user's current location using Geolocation API
 */
export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Store location in localStorage
 */
export function storeLocation(location: Location): void {
  localStorage.setItem('lastLocation', JSON.stringify(location));
}

/**
 * Get stored location from localStorage
 */
export function getStoredLocation(): Location | null {
  const stored = localStorage.getItem('lastLocation');
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if user has moved beyond threshold (10 km)
 */
export function hasUserMoved(currentLoc: Location, threshold: number = 10): boolean {
  const storedLoc = getStoredLocation();
  if (!storedLoc) return true;
  
  const distance = calculateDistance(storedLoc, currentLoc);
  return distance > threshold;
}
