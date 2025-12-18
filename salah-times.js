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

// Leicester Mosque Prayer Times - Static Timetable (December 2025)
// Based on actual mosque websites and timetables
// Format: { startTime, jamaatTime } in 24-hour format
const leicesterMosques = {
    'jame-masjid': {
        name: 'Jame Masjid',
        website: 'jamemasjid.co.uk',
        times: {
            Fajr: { start: '06:04', jamaat: '07:15' },
            Dhuhr: { start: '12:06', jamaat: '13:00' },
            Asr: { start: '14:04', jamaat: '15:00' },
            Maghrib: { start: '15:53', jamaat: '15:56' },
            Isha: { start: '17:59', jamaat: '20:00' }
        }
    },
    'masjid-ali': {
        name: 'Masjid Ali',
        website: 'masjidali.co.uk',
        times: {
            Fajr: { start: '06:04', jamaat: '07:15' },
            Dhuhr: { start: '12:06', jamaat: '13:00' },
            Asr: { start: '14:04', jamaat: '15:00' },
            Maghrib: { start: '15:53', jamaat: '15:56' },
            Isha: { start: '17:59', jamaat: '20:00' }
        }
    },
    'masjid-muhammad': {
        name: 'Masjid Muhammad',
        website: 'masjidmuhammad.uk',
        times: {
            Fajr: { start: '06:04', jamaat: '07:15' },
            Dhuhr: { start: '12:06', jamaat: '13:00' },
            Asr: { start: '14:04', jamaat: '15:00' },
            Maghrib: { start: '15:53', jamaat: '15:56' },
            Isha: { start: '17:59', jamaat: '20:00' }
        }
    },
    'masjid-fatimah-zahra': {
        name: 'Masjid Fatimah Zahra',
        website: 'masjidfatimahzahra.org',
        times: {
            Fajr: { start: '06:04', jamaat: '07:15' },
            Dhuhr: { start: '12:06', jamaat: '13:00' },
            Asr: { start: '14:04', jamaat: '15:00' },
            Maghrib: { start: '15:53', jamaat: '15:56' },
            Isha: { start: '17:59', jamaat: '20:00' }
        }
    }
};

// Update mosque times based on selection
function updateMosqueTimes() {
    const mosqueId = document.getElementById('mosqueSelect').value;
    const city = document.getElementById('citySelect').value;
    
    console.log(`Mosque selected: ${mosqueId}, City: ${city}`);
    
    // If Leicester and a specific mosque is selected
    if (city === 'Leicester' && mosqueId !== 'general' && leicesterMosques[mosqueId]) {
        const mosque = leicesterMosques[mosqueId];
        console.log(`Loading mosque times for: ${mosque.name}`);
        displayMosquePrayerTimes(mosque);
    } else {
        // Load general Leicester times from API
        console.log('Loading general Leicester times');
        getTimesForCity();
    }
}

// Display mosque prayer times directly
function displayMosquePrayerTimes(mosque) {
    if (!mosque || !mosque.times) {
        console.error('Mosque data invalid');
        return;
    }
    
    console.log(`Displaying times for ${mosque.name}`);
    
    // Update location
    document.getElementById('locationName').textContent = `${mosque.name}, Leicester`;
    
    // Update date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('currentDate').textContent = dateStr;
    
    // Update prayer times - display jamaat times
    const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    prayerOrder.forEach(prayer => {
        const element = document.querySelector(`[data-prayer="${prayer}"] .prayer-time-value`);
        if (element && mosque.times[prayer]) {
            const jamaatTime = mosque.times[prayer].jamaat;
            element.textContent = formatTime(jamaatTime);
            console.log(`${prayer}: ${formatTime(jamaatTime)}`);
        }
    });
    
    // Store times for next prayer calculation
    currentTimings = {};
    prayerOrder.forEach(prayer => {
        currentTimings[prayer] = mosque.times[prayer].jamaat;
    });
    
    // Show prayer times card
    document.getElementById('prayerTimesCard').style.display = 'block';
    
    // Highlight current prayer
    highlightCurrentPrayer();
}

// Adjust prayer time by minutes
function adjustPrayerTime(time24, minutes) {
    const [hours, mins] = time24.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}

// Toggle mosque selector visibility based on city
function toggleMosqueSelector() {
    const city = document.getElementById('citySelect').value;
    const mosqueSelector = document.getElementById('mosqueSelector');
    if (mosqueSelector) {
        if (city === 'Leicester') {
            mosqueSelector.style.display = 'block';
        } else {
            mosqueSelector.style.display = 'none';
        }
    }
}

// Update getTimesForCity to handle mosque selector
const originalGetTimesForCity = getTimesForCity;
function getTimesForCity() {
    toggleMosqueSelector();
    originalGetTimesForCity();
}

// Initialize with Leicester by default (Hanafi method)
document.addEventListener('DOMContentLoaded', () => {
    // Set Leicester as default city
    document.getElementById('citySelect').value = 'Leicester';
    // MWL is already set as default in HTML (option selected)
    // Hanafi is already set as default in HTML (option selected)
    
    // Show mosque selector for Leicester
    toggleMosqueSelector();
    
    // Load default mosque (Jame Masjid)
    const mosqueSelect = document.getElementById('mosqueSelect');
    if (mosqueSelect) {
        mosqueSelect.value = 'jame-masjid';
        // Display the mosque times immediately
        const mosque = leicesterMosques['jame-masjid'];
        if (mosque) {
            displayMosquePrayerTimes(mosque);
        }
    }
});
