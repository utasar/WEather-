# Nova - AI Life Assistant 

Nova is an intelligent weather-based life assistant that provides personalized recommendations, daily mantras, and travel insights powered by AI. Built with Next.js, TypeScript, and OpenAI.

## Features

### Core Features
- ** AI-Powered Recommendations**: Personalized clothing, activities, and health tips based on weather conditions
- ** Dynamic Location Tracking**: Automatically detects when you move beyond 10 km and updates recommendations
- ** Traveler Mode**: Compare current location with destination and get packing lists and travel tips
- **Voice Synthesis**: "Speak" button reads daily mantras and greetings aloud
- ** Settings & Personalization**: Customize clothing style, activity level, and temperature sensitivity
- ** Push Notifications**: Weather anomaly alerts (storms, extreme heat/cold, high winds)
- ** Glassmorphic UI**: Beautiful, modern interface with Tailwind CSS
- ** PWA Support**: Install on mobile devices for a native-like experience

### Technical Features
- Server-side rendering with Next.js App Router
- TypeScript for type safety
- OpenAI GPT-4 integration for intelligent recommendations
- OpenWeather API for real-time weather data
- Service Worker for offline support and notifications
- Local storage for user preferences and location tracking
- Responsive design for all screen sizes

##  Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key
- OpenWeather API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/utasar/WEather-.git
cd WEather-
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Getting API Keys:**
- OpenAI API Key: https://platform.openai.com/api-keys
- OpenWeather API Key: https://openweathermap.org/api

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

##  Project Structure

```
├── app/
│   ├── api/
│   │   └── weather/
│   │       └── route.ts          # Weather & AI API endpoint
│   ├── layout.tsx                 # Root layout with PWA config
│   ├── page.tsx                   # Main page
│   └── globals.css                # Global styles
├── components/
│   ├── Dashboard.tsx              # Main dashboard component
│   └── SettingsPanel.tsx          # Settings interface
├── utils/
│   ├── locationUtils.ts           # Location tracking & distance calculation
│   ├── NotificationLogic.ts       # Push notification management
│   ├── settingsUtils.ts           # User preferences management
│   └── SpeechUtility.ts           # Voice synthesis
├── public/
│   ├── icons/                     # PWA icons (various sizes)
│   ├── manifest.json              # PWA manifest
│   └── service-worker.js          # Service worker for offline & notifications
└── .env.local.example             # Environment variables template
```

## 📱 PWA Installation

### Mobile (iOS/Android)
1. Open the app in your mobile browser
2. Tap the share button
3. Select "Add to Home Screen"
4. Nova will now work like a native app!

### Desktop (Chrome/Edge)
1. Click the install icon in the address bar
2. Follow the prompts to install
3. Nova will open in its own window

##  Customization

### User Settings
Access settings by clicking the ⚙️ icon to customize:
- **Clothing Style**: Casual, Formal, Sporty, or Minimal
- **Activity Level**: Low, Moderate, High, or Athletic  
- **Temperature Sensitivity**: Cold, Normal, or Warm
- **Morning Briefing**: Toggle daily weather notifications
- **Units**: Metric or Imperial

### Traveler Mode
1. Click the Traveler button
2. Enter destination coordinates (latitude, longitude)
3. Get comparison, packing list, and travel tips

## Development

### Build for production
```bash
npm run build
```

### Start production server
```bash
npm start
```

### Linting
```bash
npm run lint
```

##  Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Other Platforms
This is a standard Next.js app and can be deployed on:
- Netlify
- AWS Amplify
- Google Cloud Run
- Any Node.js hosting platform

**Important**: Don't forget to set environment variables on your hosting platform!

##  Security Notes

- Never commit `.env.local` to version control
- Keep API keys secure and rotate them regularly
- Use environment variables for all sensitive data
- The `.env.local.example` file is safe to commit

##  Contributing

This is a practice and fun project! Feel free to:
- Fork the repository
- Create feature branches
- Submit pull requests
- Report issues



##  Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Weather data from [OpenWeather](https://openweathermap.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Version 1.0** - Ready for deployment! 
