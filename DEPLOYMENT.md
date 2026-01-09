# Deployment Guide for Nova - AI Life Assistant

This guide will help you deploy Nova to production.

## Prerequisites

Before deploying, ensure you have:

1. **API Keys:**
   - OpenAI API Key from https://platform.openai.com/api-keys
   - OpenWeather API Key from https://openweathermap.org/api

2. **A deployment platform account:**
   - Vercel (recommended)
   - Netlify
   - AWS Amplify
   - Or any Node.js hosting

## Deploying to Vercel (Recommended)

### Step 1: Prepare Your Repository

1. Ensure all your code is committed and pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to [Vercel](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository (`utasar/WEather-`)
4. Vercel will auto-detect it's a Next.js project

### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

```
OPENAI_API_KEY=sk-...your-actual-key
OPENWEATHER_API_KEY=your-actual-key
NEXT_PUBLIC_BASE_URL=https://your-app-name.vercel.app
```

**Important:** Replace the placeholder values with your actual API keys!

### Step 4: Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at `https://your-app-name.vercel.app`

### Step 5: Set Up Custom Domain (Optional)

1. Go to Settings → Domains in Vercel
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_BASE_URL` to your custom domain

## Deploying to Netlify

### Step 1: Build Settings

Configure build settings:
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Functions directory:** Leave blank (Next.js handles this)

### Step 2: Environment Variables

Add the same environment variables as above in Netlify's environment settings.

### Step 3: Deploy

Connect your GitHub repo and deploy!

## Deploying to Other Platforms

### General Requirements

Any platform that supports Node.js 18+ can host Nova:

1. **Build command:** `npm run build`
2. **Start command:** `npm start`
3. **Node version:** 18.x or higher
4. **Environment variables:** Set the 3 required variables

### Platform-Specific Guides

- **AWS Amplify:** Use their Next.js SSR support
- **Google Cloud Run:** Containerize with Docker
- **DigitalOcean App Platform:** Direct GitHub integration
- **Railway:** Simple deployment from GitHub

## Post-Deployment Checklist

After deploying, verify:

- [ ] The app loads correctly
- [ ] Location services prompt appears
- [ ] Weather data loads (check browser console for API errors)
- [ ] AI recommendations appear
- [ ] Settings can be saved
- [ ] Voice synthesis works (click Speak button)
- [ ] PWA manifest is accessible at `/manifest.json`
- [ ] Service worker registers (check browser DevTools → Application)
- [ ] App can be installed on mobile devices

## Troubleshooting

### API Key Errors

**Symptom:** "Missing credentials" or weather data not loading

**Solution:** 
1. Check environment variables are set correctly
2. Verify API keys are valid and active
3. Check API quota/usage limits

### Build Failures

**Symptom:** Build fails during deployment

**Solution:**
1. Test build locally: `npm run build`
2. Check Node.js version matches (18+)
3. Verify all dependencies are in package.json

### PWA Not Installing

**Symptom:** Can't add to home screen

**Solution:**
1. Verify manifest.json is accessible
2. Check HTTPS is enabled (required for PWA)
3. Ensure service worker registers successfully

### Location Not Working

**Symptom:** "Failed to get location" error

**Solution:**
1. Ensure HTTPS is enabled (required for geolocation)
2. Check browser permissions
3. Verify user granted location access

## Monitoring & Maintenance

### Performance Monitoring

Consider adding:
- Vercel Analytics for performance insights
- Sentry for error tracking
- Google Analytics for user behavior

### API Cost Management

Monitor API usage:
- **OpenAI:** Check usage at https://platform.openai.com/usage
- **OpenWeather:** Check dashboard at https://home.openweathermap.org/

### Regular Updates

Keep dependencies updated:
```bash
npm outdated
npm update
```

## Security Best Practices

1. **Never commit .env.local** to version control
2. **Rotate API keys** regularly (every 90 days recommended)
3. **Use environment variables** for all sensitive data
4. **Enable Vercel/Netlify security headers**
5. **Monitor API usage** for unusual activity
6. **Keep dependencies updated** for security patches

## Scaling Considerations

As your app grows:

1. **Caching:** Implement Redis for weather data caching
2. **Rate Limiting:** Add rate limits to API routes
3. **CDN:** Use Vercel Edge or Cloudflare for global distribution
4. **Database:** Consider adding a database for user preferences sync
5. **Analytics:** Track usage patterns and optimize

## Support

If you encounter issues:

1. Check the [Next.js Documentation](https://nextjs.org/docs)
2. Review [Vercel Support](https://vercel.com/support)
3. Open an issue on GitHub
4. Check browser console for errors

---

**Ready to deploy?** Follow the Vercel steps above and your Nova AI Life Assistant will be live in minutes! 🚀
