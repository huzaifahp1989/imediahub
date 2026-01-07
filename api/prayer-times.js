// Vercel Serverless Function to scrape Leicester prayer times
// This runs daily and provides fresh data from salaahtimes.co.uk

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  // Enable CORS for frontend access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log('Fetching prayer times from salaahtimes.co.uk...');
    
    // Fetch the webpage
    const response = await fetch('https://www.salaahtimes.co.uk/Timetable/TodaysTimes');
    const html = await response.text();
    
    // Load HTML into cheerio
    const $ = cheerio.load(html);
    
    // Extract current date
    const dateText = $('.page-title, h1, .date-header').first().text().trim() || new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Array to store mosque prayer times
    const prayerTimes = [];
    
    // Find the prayer times table
    const table = $('table').first();
    
    // Extract table rows
    table.find('tbody tr').each((index, element) => {
      const $row = $(element);
      const cells = $row.find('td');
      
      if (cells.length >= 6) {
        const mosqueName = $(cells[0]).text().trim();
        const fajr = $(cells[1]).text().trim() || '-';
        const dhuhr = $(cells[2]).text().trim() || '-';
        const asr = $(cells[3]).text().trim() || '-';
        const maghrib = $(cells[4]).text().trim() || '-';
        const isha = $(cells[5]).text().trim() || '-';
        
        if (mosqueName) {
          prayerTimes.push({
            id: index + 1,
            name: mosqueName,
            fajr,
            dhuhr,
            asr,
            maghrib,
            isha
          });
        }
      }
    });
    
    // Calculate statistics
    let earliestFajr = '23:59';
    let latestIsha = '00:00';
    
    prayerTimes.forEach(mosque => {
      if (mosque.fajr !== '-' && mosque.fajr < earliestFajr) {
        earliestFajr = mosque.fajr;
      }
      if (mosque.isha !== '-' && mosque.isha > latestIsha) {
        latestIsha = mosque.isha;
      }
    });
    
    // Return the scraped data as JSON
    const result = {
      success: true,
      date: dateText,
      totalMosques: prayerTimes.length,
      earliestFajr,
      latestIsha,
      lastUpdated: new Date().toISOString(),
      mosques: prayerTimes
    };
    
    console.log(`Successfully scraped ${prayerTimes.length} mosques`);
    
    // Cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error scraping prayer times:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch prayer times',
      message: error.message
    });
  }
}
