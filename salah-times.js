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

// Leicester Mosque Prayer Times
// Jamaat times based on mosque websites (Dec 2025)
const leicesterMosques = {
    'jame-masjid': {
        name: 'Jame Masjid',
        website: 'jamemasjid.co.uk',
        adjustments: { Fajr: +71, Dhuhr: +54, Asr: +56, Maghrib: +3, Isha: +120 }
    },
    'masjid-ali': {
        name: 'Masjid Ali',
        website: 'masjidali.co.uk',
        adjustments: { Fajr: +71, Dhuhr: +54, Asr: +56, Maghrib: +3, Isha: +121 }
    },
    'masjid-muhammad': {
        name: 'Masjid Muhammad',
        website: 'masjidmuhammad.uk',
        adjustments: { Fajr: +71, Dhuhr: +54, Asr: +56, Maghrib: +3, Isha: +120 }
    },
    'masjid-fatimah-zahra': {
        name: 'Masjid Fatimah Zahra',
        website: 'masjidfatimahzahra.org',
        adjustments: { Fajr: +71, Dhuhr: +54, Asr: +56, Maghrib: +3, Isha: +121 }
    }
};

// Update mosque times based on selection
function updateMosqueTimes() {
    const mosqueId = document.getElementById('mosqueSelect').value;
    const city = document.getElementById('citySelect').value;
    
    // If general or not Leicester, reload times
    if (city !== 'Leicester' || mosqueId === 'general') {
        getTimesForCity();
        return;
    }
    
    // Apply mosque adjustments
    const mosque = leicesterMosques[mosqueId];
    if (!mosque) {
        getTimesForCity();
        return;
    }
    
    // If we don't have current timings yet, fetch them first
    if (!currentTimings) {
        getTimesForCity();
        setTimeout(() => {
            applyMosqueAdjustments(mosque, mosqueId);
        }, 500);
    } else {
        applyMosqueAdjustments(mosque, mosqueId);
    }
}

// Apply mosque prayer time adjustments
function applyMosqueAdjustments(mosque, mosqueId) {
    if (!currentTimings) return;
    
    console.log(`Applying adjustments for ${mosque.name}`);
    
    const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    prayers.forEach(prayer => {
        const prayerElement = document.querySelector(`[data-prayer="${prayer}"] .prayer-time-value`);
        if (prayerElement && currentTimings[prayer]) {
            const adjustment = mosque.adjustments[prayer] || 0;
            const adjustedTime = adjustPrayerTime(currentTimings[prayer], adjustment);
            prayerElement.textContent = formatTime(adjustedTime);
            console.log(`${prayer}: ${currentTimings[prayer]} + ${adjustment}min = ${adjustedTime}`);
        }
    });
    
    // Update location name to show mosque
    document.getElementById('locationName').textContent = `${mosque.name}, Leicester`;
    
    // Show prayer times if not visible
    document.getElementById('prayerTimesCard').style.display = 'block';
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
    // Hanafi is already set as default in HTML (option selected)
    // MWL is already set as default in HTML (option selected)
    
    // Show mosque selector for Leicester
    toggleMosqueSelector();
    
    // Load Leicester prayer times
    getTimesForCity();
});
