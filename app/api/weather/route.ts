/**
 * app/api/weather/route.ts
 * API route for weather data and AI-powered recommendations
 * Integrates OpenWeather API with OpenAI for personalized life strategies
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Lazy initialize OpenAI client
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

interface WeatherRequest {
  lat: number;
  lon: number;
  destinationLat?: number;
  destinationLon?: number;
  settings?: {
    clothingStyle?: string;
    activityLevel?: string;
    tempSensitivity?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: WeatherRequest = await request.json();
    const { lat, lon, destinationLat, destinationLon, settings } = body;

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch current weather
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const weatherData = weatherResponse.data;

    // Fetch forecast
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    const forecastData = forecastResponse.data;

    // If destination is provided, fetch destination weather (Traveler Logic)
    let destinationWeather = null;
    if (destinationLat && destinationLon) {
      const destResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${destinationLat}&lon=${destinationLon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      destinationWeather = destResponse.data;
    }

    // Generate AI recommendations
    const aiRecommendations = await generateAIRecommendations(
      weatherData,
      forecastData,
      destinationWeather,
      settings
    );

    return NextResponse.json({
      weather: weatherData,
      forecast: forecastData,
      destinationWeather,
      ai: aiRecommendations,
    });
  } catch (error: unknown) {
    console.error('Weather API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch weather data', details: errorMessage },
      { status: 500 }
    );
  }
}

async function generateAIRecommendations(
  currentWeather: {
    main: { temp: number; feels_like: number; humidity: number };
    weather: Array<{ main: string; description: string }>;
    wind: { speed: number };
    name: string;
  },
  forecast: unknown,
  destinationWeather: {
    main: { temp: number };
    weather: Array<{ description: string }>;
    name: string;
  } | null,
  settings?: WeatherRequest['settings']
) {
  const temp = currentWeather.main.temp;
  const feelsLike = currentWeather.main.feels_like;
  const condition = currentWeather.weather[0].main;
  const description = currentWeather.weather[0].description;
  const humidity = currentWeather.main.humidity;
  const windSpeed = currentWeather.wind.speed;
  const location = currentWeather.name;

  // Build personalized context
  const clothingStyle = settings?.clothingStyle || 'casual';
  const activityLevel = settings?.activityLevel || 'moderate';
  const tempSensitivity = settings?.tempSensitivity || 'normal';

  let prompt = `You are Nova, an AI Life Assistant specializing in weather-based recommendations and life strategies.

Current weather in ${location}:
- Temperature: ${temp}°C (Feels like: ${feelsLike}°C)
- Condition: ${condition} - ${description}
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} m/s

User preferences:
- Clothing Style: ${clothingStyle}
- Activity Level: ${activityLevel}
- Temperature Sensitivity: ${tempSensitivity}

`;

  if (destinationWeather) {
    const destTemp = destinationWeather.main.temp;
    const destCondition = destinationWeather.weather[0].description;
    const destName = destinationWeather.name;

    prompt += `The user is traveling to ${destName} where it's ${destTemp}°C with ${destCondition}.

Please provide:
1. A comparison between current location and destination weather
2. A detailed packing list tailored to the destination weather and user's clothing style
3. Travel comfort tips and recommendations
4. A motivational daily mantra for the journey
5. Health and safety considerations for the weather conditions

`;
  } else {
    prompt += `Please provide:
1. A warm, personalized greeting based on the current time and weather
2. Clothing recommendations suitable for the weather and user's style preference
3. Activity suggestions based on the weather and user's activity level
4. Health tips (hydration, sun protection, etc.) specific to these conditions
5. A motivational daily mantra to inspire the user's day

`;
  }

  prompt += `Format your response as JSON with these keys:
{
  "greeting": "warm personalized greeting",
  "mantra": "inspirational daily mantra",
  "clothing": ["item 1", "item 2", "item 3"],
  "activities": ["activity 1", "activity 2"],
  "healthTips": ["tip 1", "tip 2"],
  "packingList": ["item 1", "item 2"] (only if traveling),
  "travelTips": ["tip 1", "tip 2"] (only if traveling),
  "summary": "brief weather-based life strategy for the day"
}

Keep responses concise, friendly, and actionable. Tailor everything to the user's preferences.`;

  try {
    const completion = await getOpenAIClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are Nova, a friendly and intelligent AI Life Assistant. Provide practical, personalized advice in a warm, encouraging tone.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const aiResponse = completion.choices[0].message.content;
    return JSON.parse(aiResponse || '{}');
  } catch (error) {
    console.error('OpenAI API error:', error);
    return {
      greeting: `Hello! Welcome to Nova, your AI Life Assistant.`,
      mantra: 'Every day is a new opportunity to thrive!',
      clothing: ['Check the weather and dress accordingly'],
      activities: ['Stay active and enjoy the day'],
      healthTips: ['Stay hydrated', 'Take care of yourself'],
      summary: 'Make today count!',
    };
  }
}
