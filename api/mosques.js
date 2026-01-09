import { load } from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://www.salaahtimes.co.uk/Timetable/TodaysTimes');
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    const html = await response.text();
    const $ = load(html);
    const mosques = [];

    // Select the table rows from the body
    $('table tbody tr').each((i, row) => {
        const cols = $(row).find('td');
        // Ensure we have enough columns (Name + 5 prayer times)
        if (cols.length >= 6) {
            const name = $(cols[0]).text().trim();
            // Skip empty rows or headers if any sneak in
            if (name) {
                mosques.push({
                    name: name,
                    fajr: $(cols[1]).text().trim(),
                    dhuhr: $(cols[2]).text().trim(),
                    asr: $(cols[3]).text().trim(),
                    maghrib: $(cols[4]).text().trim(),
                    isha: $(cols[5]).text().trim()
                });
            }
        }
    });

    // Cache the response for 1 hour to avoid overloading the source
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(mosques);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to fetch prayer times' });
  }
}
