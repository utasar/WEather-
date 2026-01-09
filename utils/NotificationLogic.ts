/**
 * NotificationLogic.ts
 * Push notification management for weather alerts and anomalies
 */

export interface WeatherAlert {
  type: 'storm' | 'extreme_heat' | 'extreme_cold' | 'high_wind' | 'general';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export class NotificationLogic {
  private static permission: NotificationPermission = 'default';

  /**
   * Request notification permission from the user
   */
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.error('This browser does not support notifications');
      return false;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;
    return permission === 'granted';
  }

  /**
   * Check if notifications are supported and granted
   */
  static isSupported(): boolean {
    return 'Notification' in window && this.permission === 'granted';
  }

  /**
   * Send a notification
   */
  static async sendNotification(alert: WeatherAlert): Promise<void> {
    if (!this.isSupported()) {
      if (this.permission === 'default') {
        const granted = await this.requestPermission();
        if (!granted) return;
      } else {
        return;
      }
    }

    const options: NotificationOptions = {
      body: alert.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: alert.type,
      requireInteraction: alert.severity === 'high',
    };

    new Notification(alert.title, options);
  }

  /**
   * Detect weather anomalies and send appropriate notifications
   */
  static detectAndNotify(weatherData: {
    temp: number;
    feels_like: number;
    weather: Array<{ main: string; description: string }>;
    wind_speed: number;
  }): void {
    const alerts: WeatherAlert[] = [];

    // Storm detection
    if (weatherData.weather.some(w => 
      w.main.toLowerCase().includes('storm') || 
      w.main.toLowerCase().includes('thunder')
    )) {
      alerts.push({
        type: 'storm',
        title: '⛈️ Storm Alert',
        message: `Storm conditions detected: ${weatherData.weather[0].description}`,
        severity: 'high',
      });
    }

    // Extreme heat detection (> 35°C / 95°F)
    if (weatherData.temp > 35) {
      alerts.push({
        type: 'extreme_heat',
        title: '🔥 Extreme Heat Warning',
        message: `Temperature is ${weatherData.temp.toFixed(1)}°C. Stay hydrated and avoid prolonged sun exposure.`,
        severity: 'high',
      });
    }

    // Extreme cold detection (< -10°C / 14°F)
    if (weatherData.temp < -10) {
      alerts.push({
        type: 'extreme_cold',
        title: '❄️ Extreme Cold Warning',
        message: `Temperature is ${weatherData.temp.toFixed(1)}°C. Dress warmly and limit outdoor exposure.`,
        severity: 'high',
      });
    }

    // High wind detection (> 50 km/h / 31 mph)
    if (weatherData.wind_speed > 13.9) { // 50 km/h in m/s
      alerts.push({
        type: 'high_wind',
        title: '💨 High Wind Alert',
        message: `Strong winds detected: ${(weatherData.wind_speed * 3.6).toFixed(1)} km/h`,
        severity: 'medium',
      });
    }

    // Send all detected alerts
    alerts.forEach(alert => {
      this.sendNotification(alert);
    });
  }

  /**
   * Initialize notification system
   */
  static async init(): Promise<void> {
    if ('Notification' in window) {
      this.permission = Notification.permission;
      
      // Request permission if not already granted or denied
      if (this.permission === 'default') {
        await this.requestPermission();
      }
    }
  }
}
