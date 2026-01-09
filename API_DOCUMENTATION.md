# Automatic Prayer Times API

## Overview
The Islamic Utility Hub now uses a **Vercel serverless function** to automatically fetch updated prayer times daily from [salaahtimes.co.uk](https://www.salaahtimes.co.uk/Timetable/TodaysTimes).

## How It Works

### 1. Serverless Function (`/api/prayer-times.js`)
- Deployed automatically to Vercel when you push to GitHub
- Scrapes salaahtimes.co.uk for current Leicester prayer times
- Parses HTML table data using Cheerio
- Returns JSON response with all mosque prayer times
- Cached for 1 hour for performance

### 2. Frontend (`today-prayers.js`)
- Fetches data from `/api/prayer-times` on page load
- Falls back to static data if API fails
- Updates automatically when users visit the page

### 3. Auto-Updates
- **Live site**: Fetches from Vercel serverless function (always fresh data)
- **Local dev**: Uses fallback data (4 mosques sample)
- **Cache**: Responses cached for 1 hour to reduce load

## API Endpoint

### GET `/api/prayer-times`

**Response Format:**
```json
{
  "success": true,
  "date": "Tuesday, January 7, 2026",
  "totalMosques": 66,
  "earliestFajr": "06:20",
  "latestIsha": "20:30",
  "lastUpdated": "2026-01-07T10:30:00.000Z",
  "mosques": [
    {
      "id": 1,
      "name": "Jame Masjid",
      "fajr": "07:00",
      "dhuhr": "13:00",
      "asr": "15:00",
      "maghrib": "16:11",
      "isha": "20:00"
    }
    // ... more mosques
  ]
}
```

## Benefits

✅ **Always Up-to-Date**: Prayer times update daily from source website
✅ **No Manual Updates**: Fully automated scraping and deployment
✅ **Fast Performance**: Cached responses for 1 hour
✅ **Reliable Fallback**: Static data used if scraping fails
✅ **Zero Server Management**: Serverless architecture on Vercel

## Deployment

### Automatic Deployment
1. Push changes to GitHub
2. Vercel automatically detects and deploys the `/api` folder
3. Serverless function is live at `your-domain.vercel.app/api/prayer-times`

### Manual Testing
Visit: `https://your-vercel-domain.vercel.app/api/prayer-times`

## Dependencies
- `cheerio`: HTML parsing and scraping (installed in package.json)
- `node-fetch`: Fetching webpage data (Node.js 18+ has native fetch)

## Cache Settings
- **Server Cache**: 1 hour (`s-maxage=3600`)
- **Stale While Revalidate**: Serves stale data while fetching new data
- **Browser Cache**: Follows server cache headers

## Error Handling
- If scraping fails, returns error response
- Frontend automatically falls back to static data
- Logs errors to Vercel function logs

## Monitoring
Check Vercel dashboard for:
- Function execution logs
- Error rates
- Response times
- Cache hit rates

## Future Enhancements
- [ ] Add multiple location support (Birmingham, Manchester, etc.)
- [ ] Cache mosque-specific pages
- [ ] Add webhook notifications for prayer time changes
- [ ] Store historical prayer times in database
