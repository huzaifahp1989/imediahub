// ==============================
// SALAH TIMES - ALADHAN API INTEGRATION
// ==============================

let currentLocation = null;
let currentTimings = null;

// Get location automatically using browser geolocation
function getLocationAuto() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchPrayerTimes(latitude, longitude);
            },
            (error) => {
                alert('Unable to get your location. Please select a city manually.');
                console.error('Geolocation error:', error);
            }
        );
    } else {
        alert('Geolocation is not supported by your browser. Please select a city manually.');
    }
}

// Get prayer times for selected city
function getTimesForCity() {
    const city = document.getElementById('citySelect').value;
    if (!city) return;

    const method = document.getElementById('methodSelect').value;
    const school = document.getElementById('asrMethod').value;

    const url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=United Kingdom&method=${method}&school=${school}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                displayPrayerTimes(data.data, city);
            } else {
                alert('Error fetching prayer times. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching prayer times. Please check your internet connection.');
        });
}

// Fetch prayer times by coordinates
function fetchPrayerTimes(latitude, longitude) {
    const method = document.getElementById('methodSelect').value;
    const school = document.getElementById('asrMethod').value;

    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}&school=${school}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.code === 200) {
                displayPrayerTimes(data.data, 'Your Location');
            } else {
                alert('Error fetching prayer times. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching prayer times. Please check your internet connection.');
        });
}

// Display prayer times on the page
function displayPrayerTimes(data, locationName) {
    currentTimings = data.timings;
    currentLocation = locationName;

    // Update location name
    document.getElementById('locationName').textContent = locationName;

    // Update date
    const date = data.date.readable;
    const hijriDate = `${data.date.hijri.day} ${data.date.hijri.month.en} ${data.date.hijri.year}`;
    document.getElementById('currentDate').textContent = `${date} | ${hijriDate}`;

    // Update prayer times
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    prayers.forEach(prayer => {
        const prayerElement = document.querySelector(`[data-prayer="${prayer}"] .prayer-time-value`);
        if (prayerElement && currentTimings[prayer]) {
            prayerElement.textContent = formatTime(currentTimings[prayer]);
        }
    });

    // Highlight current/next prayer
    highlightCurrentPrayer();

    // Show prayer times card
    document.getElementById('prayerTimesCard').style.display = 'block';

    // Update next prayer info every minute
    updateNextPrayerInfo();
    setInterval(updateNextPrayerInfo, 60000);
}

// Format time from 24-hour to 12-hour format
function formatTime(time24) {
    const [hours, minutes] = time24.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
}

// Highlight current prayer
function highlightCurrentPrayer() {
    if (!currentTimings) return;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let currentPrayer = null;

    // Convert prayer times to minutes
    const prayerMinutes = prayers.map(prayer => {
        const [hours, minutes] = currentTimings[prayer].split(':');
        return parseInt(hours) * 60 + parseInt(minutes);
    });

    // Find current prayer
    for (let i = prayers.length - 1; i >= 0; i--) {
        if (currentTime >= prayerMinutes[i]) {
            currentPrayer = prayers[i];
            break;
        }
    }

    // If before Fajr, current prayer is Isha from previous day
    if (!currentPrayer) {
        currentPrayer = 'Isha';
    }

    // Remove previous highlights
    document.querySelectorAll('.prayer-time').forEach(el => {
        el.classList.remove('current');
    });

    // Highlight current prayer
    const currentElement = document.querySelector(`[data-prayer="${currentPrayer}"]`);
    if (currentElement) {
        currentElement.classList.add('current');
    }
}

// Update next prayer information
function updateNextPrayerInfo() {
    if (!currentTimings) return;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    let nextPrayer = null;
    let nextPrayerTime = null;

    // Find next prayer
    for (let i = 0; i < prayers.length; i++) {
        const [hours, minutes] = currentTimings[prayers[i]].split(':');
        const prayerTime = parseInt(hours) * 60 + parseInt(minutes);

        if (prayerTime > currentTime) {
            nextPrayer = prayers[i];
            nextPrayerTime = prayerTime;
            break;
        }
    }

    // If no next prayer today, next prayer is Fajr tomorrow
    if (!nextPrayer) {
        nextPrayer = 'Fajr';
        const [hours, minutes] = currentTimings['Fajr'].split(':');
        nextPrayerTime = parseInt(hours) * 60 + parseInt(minutes) + (24 * 60); // Add 24 hours
    }

    // Calculate time remaining
    let timeRemaining = nextPrayerTime - currentTime;
    if (timeRemaining < 0) {
        timeRemaining += (24 * 60); // Add 24 hours if negative
    }

    const hoursRemaining = Math.floor(timeRemaining / 60);
    const minutesRemaining = timeRemaining % 60;

    // Update display
    document.getElementById('nextPrayerName').textContent = nextPrayer;
    
    if (hoursRemaining > 0) {
        document.getElementById('timeRemaining').textContent = 
            `${hoursRemaining} hour${hoursRemaining > 1 ? 's' : ''} ${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`;
    } else {
        document.getElementById('timeRemaining').textContent = 
            `${minutesRemaining} minute${minutesRemaining !== 1 ? 's' : ''}`;
    }
}

// Update prayer times when method changes
function updatePrayerTimes() {
    const city = document.getElementById('citySelect').value;
    if (city) {
        getTimesForCity();
    } else if (currentLocation) {
        alert('Please select a city or use your location again.');
    }
}

// Leicester Mosque Prayer Times - Real Data from SalaahTimes.co.uk
// Source: https://www.salaahtimes.co.uk/Mosque/Details/2
// Jame Masjid, 51 Asfordby Street, Leicester LE5 3QG
const leicesterMosques = {
    'jame-masjid': {
        name: 'Jame Masjid',
        website: 'salaahtimes.co.uk',
        address: '51 Asfordby Street, Leicester LE5 3QG',
        receiver: 'Not available',
        // Complete timetable for December 2025 (jamaat times)
        // Updates dynamically based on current date
        timetable: {
            '2025-12-01': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-02': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-03': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-04': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-05': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-06': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '18:10' },
            '2025-12-07': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '18:10' },
            '2025-12-08': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-09': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-10': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-11': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-12': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-13': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '18:10' },
            '2025-12-14': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '18:10' },
            '2025-12-15': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-16': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-17': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-18': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-19': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-20': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '18:10' },
            '2025-12-21': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '18:15' },
            '2025-12-22': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:55', Isha: '18:15' },
            '2025-12-23': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '18:15' },
            '2025-12-24': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '18:15' },
            '2025-12-25': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:57', Isha: '18:15' },
            '2025-12-26': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:58', Isha: '18:15' },
            '2025-12-27': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:58', Isha: '18:15' },
            '2025-12-28': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:59', Isha: '18:20' },
            '2025-12-29': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:00', Isha: '18:20' },
            '2025-12-30': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:01', Isha: '18:20' },
            '2025-12-31': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:02', Isha: '18:20' },
            // January 2026 - Source: salaahtimes.co.uk
            '2026-01-01': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:03', Isha: '18:20' },
            '2026-01-02': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:05', Isha: '18:20' },
            '2026-01-03': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:06', Isha: '18:20' },
            '2026-01-04': { Fajr: '07:30', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:07', Isha: '18:20' },
            '2026-01-05': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:08', Isha: '20:00' },
            '2026-01-06': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:09', Isha: '20:00' },
            '2026-01-07': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:11', Isha: '20:00' },
            '2026-01-08': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:12', Isha: '20:00' },
            '2026-01-09': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:14', Isha: '20:00' },
            '2026-01-10': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:15', Isha: '18:30' },
            '2026-01-11': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:17', Isha: '18:30' },
            '2026-01-12': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:18', Isha: '20:00' },
            '2026-01-13': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:20', Isha: '20:00' },
            '2026-01-14': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:21', Isha: '20:00' },
            '2026-01-15': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:23', Isha: '20:00' },
            '2026-01-16': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:24', Isha: '20:00' },
            '2026-01-17': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:26', Isha: '18:40' },
            '2026-01-18': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:28', Isha: '18:40' },
            '2026-01-19': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:29', Isha: '20:00' },
            '2026-01-20': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:31', Isha: '20:00' },
            '2026-01-21': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:33', Isha: '20:00' },
            '2026-01-22': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:35', Isha: '20:00' },
            '2026-01-23': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:37', Isha: '20:00' },
            '2026-01-24': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:38', Isha: '18:50' },
            '2026-01-25': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:40', Isha: '18:50' },
            '2026-01-26': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:42', Isha: '20:00' },
            '2026-01-27': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:44', Isha: '20:00' },
            '2026-01-28': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:46', Isha: '20:00' },
            '2026-01-29': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:48', Isha: '20:00' },
            '2026-01-30': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:49', Isha: '20:00' },
            '2026-01-31': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:15', Maghrib: '16:51', Isha: '19:00' }
        },
        jumah: {
            bayaan: '12:40',
            khutba: '13:10'
        }
    },
    'ehsaan-academy': {
        name: 'Al Ehsaan Academy',
        website: 'salaahtimes.co.uk',
        address: '96 Evington Road, Leicester LE2 1HH',
        phone: '07883444892',
        receiver: '453.075 MHz',
        timetable: {
            '2025-12-01': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:56', Isha: '19:30' },
            '2025-12-02': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:56', Isha: '19:30' },
            '2025-12-03': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:55', Isha: '19:30' },
            '2025-12-04': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:55', Isha: '19:30' },
            '2025-12-05': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:54', Isha: '19:30' },
            '2025-12-06': { Fajr: '07:30', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:54', Isha: '19:30' },
            '2025-12-07': { Fajr: '07:30', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:53', Isha: '19:30' },
            '2025-12-08': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:53', Isha: '19:30' },
            '2025-12-09': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:53', Isha: '19:30' },
            '2025-12-10': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:53', Isha: '19:30' },
            '2025-12-11': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:52', Isha: '19:30' },
            '2025-12-12': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:52', Isha: '19:30' },
            '2025-12-13': { Fajr: '07:30', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:52', Isha: '19:30' },
            '2025-12-14': { Fajr: '07:30', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:52', Isha: '19:30' },
            '2025-12-15': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:52', Isha: '19:30' },
            '2025-12-16': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:53', Isha: '19:30' },
            '2025-12-17': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:53', Isha: '19:30' },
            '2025-12-18': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:53', Isha: '19:30' },
            '2025-12-19': { Fajr: '07:00', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:54', Isha: '19:30' },
            '2025-12-20': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:54', Isha: '19:30' },
            '2025-12-21': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:54', Isha: '19:30' },
            '2025-12-22': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:55', Isha: '19:30' },
            '2025-12-23': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:56', Isha: '19:30' },
            '2025-12-24': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:56', Isha: '19:30' },
            '2025-12-25': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:57', Isha: '19:30' },
            '2025-12-26': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:58', Isha: '19:30' },
            '2025-12-27': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:58', Isha: '19:30' },
            '2025-12-28': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '15:59', Isha: '19:30' },
            '2025-12-29': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:00', Isha: '19:30' },
            '2025-12-30': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:01', Isha: '19:30' },
            '2025-12-31': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:02', Isha: '19:30' },
            // January 2026
            '2026-01-01': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:03', Isha: '19:30' },
            '2026-01-02': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:04', Isha: '19:30' },
            '2026-01-03': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:05', Isha: '19:30' },
            '2026-01-04': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:06', Isha: '19:30' },
            '2026-01-05': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:07', Isha: '19:30' },
            '2026-01-06': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:08', Isha: '19:30' },
            '2026-01-07': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:09', Isha: '19:30' },
            '2026-01-08': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:10', Isha: '19:30' },
            '2026-01-09': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:11', Isha: '19:30' },
            '2026-01-10': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:12', Isha: '19:30' },
            '2026-01-11': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:13', Isha: '19:30' },
            '2026-01-12': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:15', Isha: '19:30' },
            '2026-01-13': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:16', Isha: '19:30' },
            '2026-01-14': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:17', Isha: '19:30' },
            '2026-01-15': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:18', Isha: '19:30' },
            '2026-01-16': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:19', Isha: '19:30' },
            '2026-01-17': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:21', Isha: '19:30' },
            '2026-01-18': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:22', Isha: '19:30' },
            '2026-01-19': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:23', Isha: '19:30' },
            '2026-01-20': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:24', Isha: '19:30' },
            '2026-01-21': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:26', Isha: '19:30' },
            '2026-01-22': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:27', Isha: '19:30' },
            '2026-01-23': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:28', Isha: '19:30' },
            '2026-01-24': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:30', Isha: '19:30' },
            '2026-01-25': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:31', Isha: '19:30' },
            '2026-01-26': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:32', Isha: '19:30' },
            '2026-01-27': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:34', Isha: '19:30' },
            '2026-01-28': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:35', Isha: '19:30' },
            '2026-01-29': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:37', Isha: '19:30' },
            '2026-01-30': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:38', Isha: '19:30' },
            '2026-01-31': { Fajr: '07:40', Dhuhr: '13:15', Asr: '15:20', Maghrib: '16:39', Isha: '19:30' }
        },
        jumah: {
            bayaan1: '12:05',
            azaan1: '12:20',
            khutba1: '12:30',
            khutba2: '13:30'
        }
    },
    'as-salaam-peace': {
        name: 'As-Salaam (The Peace Centre)',
        website: 'salaahtimes.co.uk',
        address: 'Thurncourt Road, Thurnby Lodge, Leicester LE5 2NG',
        phone: '0116 2417100',
        receiver: 'Not available',
        timetable: {
            '2025-12-01': { Fajr: '07:25', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:56', Isha: '19:10' },
            '2025-12-02': { Fajr: '07:25', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:56', Isha: '19:10' },
            '2025-12-03': { Fajr: '07:25', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:55', Isha: '19:10' },
            '2025-12-04': { Fajr: '07:25', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:55', Isha: '19:10' },
            '2025-12-05': { Fajr: '07:25', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:54', Isha: '19:10' },
            '2025-12-06': { Fajr: '07:25', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:54', Isha: '18:10' },
            '2025-12-07': { Fajr: '07:25', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:53', Isha: '18:10' },
            '2025-12-08': { Fajr: '07:35', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:53', Isha: '19:10' },
            '2025-12-09': { Fajr: '07:35', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:53', Isha: '19:10' },
            '2025-12-10': { Fajr: '07:35', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:53', Isha: '19:10' },
            '2025-12-11': { Fajr: '07:35', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:52', Isha: '19:10' },
            '2025-12-12': { Fajr: '07:35', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:52', Isha: '19:10' },
            '2025-12-13': { Fajr: '07:35', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:52', Isha: '18:10' },
            '2025-12-14': { Fajr: '07:35', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:52', Isha: '18:10' },
            '2025-12-15': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:52', Isha: '19:10' },
            '2025-12-16': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:53', Isha: '19:10' },
            '2025-12-17': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:53', Isha: '19:10' },
            '2025-12-18': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:53', Isha: '19:10' },
            '2025-12-19': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:54', Isha: '19:10' },
            '2025-12-20': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:54', Isha: '18:15' },
            '2025-12-21': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:54', Isha: '18:15' },
            '2025-12-22': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:55', Isha: '18:15' },
            '2025-12-23': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:56', Isha: '18:15' },
            '2025-12-24': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:56', Isha: '18:15' },
            '2025-12-25': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:57', Isha: '18:15' },
            '2025-12-26': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:58', Isha: '18:15' },
            '2025-12-27': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:58', Isha: '18:15' },
            '2025-12-28': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '15:59', Isha: '18:15' },
            '2025-12-29': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:00', Isha: '18:15' },
            '2025-12-30': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:01', Isha: '18:15' },
            '2025-12-31': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:02', Isha: '18:15' },
            // January 2026
            '2026-01-01': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:03', Isha: '18:15' },
            '2026-01-02': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:04', Isha: '18:15' },
            '2026-01-03': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:05', Isha: '18:20' },
            '2026-01-04': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:06', Isha: '18:20' },
            '2026-01-05': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:07', Isha: '18:20' },
            '2026-01-06': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:08', Isha: '18:20' },
            '2026-01-07': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:09', Isha: '18:20' },
            '2026-01-08': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:10', Isha: '19:10' },
            '2026-01-09': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:11', Isha: '19:10' },
            '2026-01-10': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:12', Isha: '18:25' },
            '2026-01-11': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:13', Isha: '18:25' },
            '2026-01-12': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:15', Isha: '18:25' },
            '2026-01-13': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:16', Isha: '18:25' },
            '2026-01-14': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:17', Isha: '18:25' },
            '2026-01-15': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:18', Isha: '19:10' },
            '2026-01-16': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:19', Isha: '19:10' },
            '2026-01-17': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:21', Isha: '18:30' },
            '2026-01-18': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:22', Isha: '18:30' },
            '2026-01-19': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:23', Isha: '18:30' },
            '2026-01-20': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:24', Isha: '18:30' },
            '2026-01-21': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:26', Isha: '18:30' },
            '2026-01-22': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:27', Isha: '19:10' },
            '2026-01-23': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:28', Isha: '19:10' },
            '2026-01-24': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:30', Isha: '18:35' },
            '2026-01-25': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:31', Isha: '18:35' },
            '2026-01-26': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:32', Isha: '18:35' },
            '2026-01-27': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:34', Isha: '18:35' },
            '2026-01-28': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:35', Isha: '18:35' },
            '2026-01-29': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:37', Isha: '19:10' },
            '2026-01-30': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:38', Isha: '19:10' },
            '2026-01-31': { Fajr: '07:45', Dhuhr: '12:30', Asr: '14:40', Maghrib: '16:39', Isha: '18:40' }
        },
        jumah: {
            bayaan1: '12:20',
            azaan1: '12:40',
            khutba1: '12:50',
            bayaan2: '13:15',
            khutba2: '13:35'
        }
    },
    'madani-school': {
        name: 'Madani School Masjid',
        website: 'salaahtimes.co.uk',
        address: '77 Evington Valley Road, Leicester LE5 5LL',
        receiver: '459.800 MHz',
        timetable: {
            '2025-12-01': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-02': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-03': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-04': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-05': { Fajr: '06:30', Dhuhr: '12:30', Asr: '--', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-06': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:54', Isha: '18:15' },
            '2025-12-07': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:53', Isha: '18:15' },
            '2025-12-08': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-09': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-10': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-11': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-12': { Fajr: '06:30', Dhuhr: '12:30', Asr: '--', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-13': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:52', Isha: '18:00' },
            '2025-12-14': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:52', Isha: '18:15' },
            '2025-12-15': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-16': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-17': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-18': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-19': { Fajr: '06:30', Dhuhr: '12:30', Asr: '--', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-20': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:54', Isha: '18:15' },
            '2025-12-21': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:54', Isha: '18:15' },
            '2025-12-22': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:55', Isha: '18:15' },
            '2025-12-23': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:56', Isha: '18:15' },
            '2025-12-24': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:56', Isha: '18:15' },
            '2025-12-25': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:57', Isha: '18:15' },
            '2025-12-26': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:58', Isha: '18:15' },
            '2025-12-27': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:58', Isha: '18:15' },
            '2025-12-28': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '15:59', Isha: '18:15' },
            '2025-12-29': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:00', Isha: '18:20' },
            '2025-12-30': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:01', Isha: '18:20' },
            '2025-12-31': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:02', Isha: '18:20' },
            // January 2026
            '2026-01-01': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:03', Isha: '18:20' },
            '2026-01-02': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:04', Isha: '18:20' },
            '2026-01-03': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:05', Isha: '18:20' },
            '2026-01-04': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:06', Isha: '20:00' },
            '2026-01-05': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:07', Isha: '20:00' },
            '2026-01-06': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:08', Isha: '20:00' },
            '2026-01-07': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:09', Isha: '20:00' },
            '2026-01-08': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:10', Isha: '20:00' },
            '2026-01-09': { Fajr: '06:30', Dhuhr: '12:30', Asr: '--', Maghrib: '16:11', Isha: '20:00' },
            '2026-01-10': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:12', Isha: '18:20' },
            '2026-01-11': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:13', Isha: '18:20' },
            '2026-01-12': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:15', Isha: '20:00' },
            '2026-01-13': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:16', Isha: '20:00' },
            '2026-01-14': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:17', Isha: '20:00' },
            '2026-01-15': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:18', Isha: '20:00' },
            '2026-01-16': { Fajr: '06:30', Dhuhr: '12:30', Asr: '--', Maghrib: '16:19', Isha: '20:00' },
            '2026-01-17': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:21', Isha: '18:30' },
            '2026-01-18': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:22', Isha: '18:30' },
            '2026-01-19': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:23', Isha: '20:00' },
            '2026-01-20': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:24', Isha: '20:00' },
            '2026-01-21': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:26', Isha: '20:00' },
            '2026-01-22': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:27', Isha: '20:00' },
            '2026-01-23': { Fajr: '06:30', Dhuhr: '12:30', Asr: '--', Maghrib: '16:28', Isha: '20:00' },
            '2026-01-24': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:30', Isha: '18:35' },
            '2026-01-25': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:31', Isha: '18:35' },
            '2026-01-26': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:32', Isha: '20:00' },
            '2026-01-27': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:34', Isha: '20:00' },
            '2026-01-28': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:35', Isha: '20:00' },
            '2026-01-29': { Fajr: '06:30', Dhuhr: '--', Asr: '--', Maghrib: '16:37', Isha: '20:00' },
            '2026-01-30': { Fajr: '06:30', Dhuhr: '12:30', Asr: '--', Maghrib: '16:38', Isha: '20:00' },
            '2026-01-31': { Fajr: '06:30', Dhuhr: '12:30', Asr: '15:00', Maghrib: '16:39', Isha: '18:40' }
        }
    },
    'baytul-ilm': {
        name: 'Madrasah Baytul Ilm (Masjid Ibraheem)',
        website: 'salaahtimes.co.uk',
        address: 'Spinney Hill Road, Leicester LE5 3GH',
        phone: '0116 251 1018',
        receiver: '453.525 MHz',
        timetable: {
            '2025-12-01': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-02': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-03': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-04': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-05': { Fajr: '07:00', Dhuhr: '13:05', Asr: '14:55', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-06': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:54', Isha: '18:10' },
            '2025-12-07': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:53', Isha: '18:10' },
            '2025-12-08': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-09': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-10': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-11': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-12': { Fajr: '07:00', Dhuhr: '13:05', Asr: '14:55', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-13': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:52', Isha: '18:10' },
            '2025-12-14': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:52', Isha: '18:10' },
            '2025-12-15': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-16': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-17': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-18': { Fajr: '07:00', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-19': { Fajr: '07:00', Dhuhr: '13:05', Asr: '14:55', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-20': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:54', Isha: '18:20' },
            '2025-12-21': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:54', Isha: '18:20' },
            '2025-12-22': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:55', Isha: '18:20' },
            '2025-12-23': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:56', Isha: '18:20' },
            '2025-12-24': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:56', Isha: '18:20' },
            '2025-12-25': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:57', Isha: '18:20' },
            '2025-12-26': { Fajr: '07:45', Dhuhr: '13:05', Asr: '14:55', Maghrib: '15:58', Isha: '18:20' },
            '2025-12-27': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:58', Isha: '18:20' },
            '2025-12-28': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '15:59', Isha: '18:20' },
            '2025-12-29': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:00', Isha: '18:20' },
            '2025-12-30': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:01', Isha: '18:20' },
            '2025-12-31': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:02', Isha: '18:20' },
            // January 2026
            '2026-01-01': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:03', Isha: '18:20' },
            '2026-01-02': { Fajr: '07:45', Dhuhr: '13:05', Asr: '14:55', Maghrib: '16:04', Isha: '18:20' },
            '2026-01-03': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:05', Isha: '18:20' },
            '2026-01-04': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:06', Isha: '18:25' },
            '2026-01-05': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:07', Isha: '18:25' },
            '2026-01-06': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:08', Isha: '18:25' },
            '2026-01-07': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:09', Isha: '18:25' },
            '2026-01-08': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:10', Isha: '18:25' },
            '2026-01-09': { Fajr: '07:45', Dhuhr: '13:05', Asr: '14:55', Maghrib: '16:11', Isha: '18:25' },
            '2026-01-10': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:12', Isha: '18:25' },
            '2026-01-11': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:13', Isha: '18:25' },
            '2026-01-12': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:15', Isha: '18:25' },
            '2026-01-13': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:16', Isha: '18:25' },
            '2026-01-14': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:17', Isha: '18:25' },
            '2026-01-15': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:18', Isha: '18:30' },
            '2026-01-16': { Fajr: '07:45', Dhuhr: '13:05', Asr: '14:55', Maghrib: '16:19', Isha: '18:30' },
            '2026-01-17': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:21', Isha: '18:30' },
            '2026-01-18': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:22', Isha: '18:30' },
            '2026-01-19': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:23', Isha: '18:30' },
            '2026-01-20': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:24', Isha: '18:30' },
            '2026-01-21': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:26', Isha: '18:30' },
            '2026-01-22': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:27', Isha: '18:30' },
            '2026-01-23': { Fajr: '07:45', Dhuhr: '13:05', Asr: '14:55', Maghrib: '16:28', Isha: '18:30' },
            '2026-01-24': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:30', Isha: '18:35' },
            '2026-01-25': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:31', Isha: '18:35' },
            '2026-01-26': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:32', Isha: '18:35' },
            '2026-01-27': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:34', Isha: '18:35' },
            '2026-01-28': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:35', Isha: '18:35' },
            '2026-01-29': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:37', Isha: '18:35' },
            '2026-01-30': { Fajr: '07:45', Dhuhr: '13:05', Asr: '14:55', Maghrib: '16:38', Isha: '18:35' },
            '2026-01-31': { Fajr: '07:45', Dhuhr: '12:40', Asr: '14:55', Maghrib: '16:39', Isha: '18:40' }
        }
    },
    'majlis-e-dawatul-haq': {
        name: 'Majlis e Dawatul Haq',
        website: 'salaahtimes.co.uk',
        address: '126-130 Earl Howe Street, Leicester LE2 0DG',
        phone: '0116 255 9847',
        receiver: 'Not available',
        timetable: {
            '2025-12-01': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-02': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '20:00' },
            '2025-12-03': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-04': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:55', Isha: '20:00' },
            '2025-12-05': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-06': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '18:30' },
            '2025-12-07': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '18:30' },
            '2025-12-08': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-09': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-10': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-11': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-12': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-13': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '18:30' },
            '2025-12-14': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '18:30' },
            '2025-12-15': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:52', Isha: '20:00' },
            '2025-12-16': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-17': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-18': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:53', Isha: '20:00' },
            '2025-12-19': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '20:00' },
            '2025-12-20': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '18:30' },
            '2025-12-21': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:54', Isha: '18:30' },
            '2025-12-22': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:55', Isha: '18:30' },
            '2025-12-23': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '18:30' },
            '2025-12-24': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:56', Isha: '18:30' },
            '2025-12-25': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:57', Isha: '18:30' },
            '2025-12-26': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:58', Isha: '18:30' },
            '2025-12-27': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:58', Isha: '18:30' },
            '2025-12-28': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '15:59', Isha: '18:30' },
            '2025-12-29': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:00', Isha: '18:30' },
            '2025-12-30': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:01', Isha: '18:30' },
            '2025-12-31': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:02', Isha: '18:30' },
            // January 2026
            '2026-01-01': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:03', Isha: '18:30' },
            '2026-01-02': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:04', Isha: '18:30' },
            '2026-01-03': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:05', Isha: '18:30' },
            '2026-01-04': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:06', Isha: '18:35' },
            '2026-01-05': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:07', Isha: '18:35' },
            '2026-01-06': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:08', Isha: '18:35' },
            '2026-01-07': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:09', Isha: '18:35' },
            '2026-01-08': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:10', Isha: '18:35' },
            '2026-01-09': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:11', Isha: '18:35' },
            '2026-01-10': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:12', Isha: '18:35' },
            '2026-01-11': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:13', Isha: '18:40' },
            '2026-01-12': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:15', Isha: '18:40' },
            '2026-01-13': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:16', Isha: '18:40' },
            '2026-01-14': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:17', Isha: '18:40' },
            '2026-01-15': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:18', Isha: '18:40' },
            '2026-01-16': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:19', Isha: '18:40' },
            '2026-01-17': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:21', Isha: '18:40' },
            '2026-01-18': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:22', Isha: '18:45' },
            '2026-01-19': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:23', Isha: '18:45' },
            '2026-01-20': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:24', Isha: '18:45' },
            '2026-01-21': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:26', Isha: '18:45' },
            '2026-01-22': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:27', Isha: '18:45' },
            '2026-01-23': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:28', Isha: '18:45' },
            '2026-01-24': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:30', Isha: '18:45' },
            '2026-01-25': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:31', Isha: '18:50' },
            '2026-01-26': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:32', Isha: '18:50' },
            '2026-01-27': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:34', Isha: '18:50' },
            '2026-01-28': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:35', Isha: '18:50' },
            '2026-01-29': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:37', Isha: '18:50' },
            '2026-01-30': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:38', Isha: '18:50' },
            '2026-01-31': { Fajr: '07:00', Dhuhr: '13:00', Asr: '15:00', Maghrib: '16:39', Isha: '18:50' }
        }
    }
};

// Update mosque times based on selection
function updateMosqueTimes() {
    const mosqueId = document.getElementById('mosqueSelect').value;
    const city = document.getElementById('citySelect').value;
    
    console.log(`🕌 Mosque Update - Selected: ${mosqueId}, City: ${city}`);
    
    // Only show mosque times if Leicester is selected and a specific mosque chosen
    if (city === 'Leicester' && mosqueId && mosqueId !== 'general') {
        const mosque = leicesterMosques[mosqueId];
        
        if (mosque && mosque.timetable) {
            console.log(`✅ Loading mosque times for ${mosque.name}`);
            displayMosqueTimetable(mosque);
            return;
        }
    }
    
    // Otherwise load general city times
    console.log('📍 Loading general city times');
    getTimesForCity();
}

// Display mosque timetable from static data
function displayMosqueTimetable(mosque) {
    if (!mosque || !mosque.timetable) {
        console.error('❌ Invalid mosque timetable data');
        return;
    }
    
    console.log(`📖 Displaying timetable for ${mosque.name}`);
    
    // Get today's date in format YYYY-MM-DD
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(today.getDate()).padStart(2, '0');
    
    const todaysTimes = mosque.timetable[dateStr];
    
    if (!todaysTimes) {
        console.error(`❌ No times found for ${dateStr}`);
        alert('Prayer times not available for today');
        return;
    }
    
    // Update location with address
    const locationText = mosque.address ? 
        `${mosque.name}, Leicester` : 
        `${mosque.name}, Leicester`;
    document.getElementById('locationName').textContent = locationText;
    
    // Update date
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr2 = today.toLocaleDateString('en-US', dateOptions);
    document.getElementById('currentDate').textContent = dateStr2;
    
    // Update prayer times
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    currentTimings = {};
    
    prayers.forEach(prayer => {
        const element = document.querySelector(`[data-prayer="${prayer}"] .prayer-time-value`);
        if (element && todaysTimes[prayer]) {
            element.textContent = formatTime(todaysTimes[prayer]);
            currentTimings[prayer] = todaysTimes[prayer];
            console.log(`  ${prayer}: ${formatTime(todaysTimes[prayer])}`);
        }
    });
    
    // Show prayer times card
    document.getElementById('prayerTimesCard').style.display = 'block';
    
    // Highlight current prayer
    highlightCurrentPrayer();
    
    // Update next prayer info
    updateNextPrayerInfo();
}

// Adjust prayer time by minutes
function adjustPrayerTime(time24, minutes) {
    const [hours, mins] = time24.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Handle city change
function onCityChange() {
    const city = document.getElementById('citySelect').value;
    const mosqueSelect = document.getElementById('mosqueSelect');
    
    console.log(`🏙️ City changed to: ${city}`);
    
    // Show/hide mosque selector
    if (city === 'Leicester' && mosqueSelect) {
        document.getElementById('mosqueSelector').style.display = 'block';
        // Reset to first mosque
        mosqueSelect.value = 'jame-masjid';
        // Load that mosque's times
        const mosque = leicesterMosques['jame-masjid'];
        if (mosque) {
            displayMosqueTimetable(mosque);
        }
    } else {
        document.getElementById('mosqueSelector').style.display = 'none';
        // Load general city times
        getTimesForCity();
    }
}

// Initialize with Leicester by default
document.addEventListener('DOMContentLoaded', () => {
    console.log('⏳ Initializing Salah Times page...');
    
    // Set Leicester as default city
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.value = 'Leicester';
    }
    
    // Show mosque selector
    const mosqueSelector = document.getElementById('mosqueSelector');
    if (mosqueSelector) {
        mosqueSelector.style.display = 'block';
    }
    
    // Set default mosque
    const mosqueSelect = document.getElementById('mosqueSelect');
    if (mosqueSelect) {
        mosqueSelect.value = 'jame-masjid';
    }
    
    // Load default mosque times
    const mosque = leicesterMosques['jame-masjid'];
    if (mosque) {
        console.log('✅ Loading default mosque: Jame Masjid (SalaahTimes.co.uk)');
        displayMosqueTimetable(mosque);
    }
});
