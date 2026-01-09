// Today's Prayer Times - Auto-updated from salaahtimes.co.uk
// Data fetched dynamically via Vercel serverless function

let prayerTimesData = [];
let filteredData = [];
let currentView = 'table';
let currentDate = '';
let stats = {
    totalMosques: 0,
    earliestFajr: '--',
    latestIsha: '--'
};

// Fetch prayer times from API or local data
async function fetchPrayerTimes() {
    try {
        // Show loading state
        document.getElementById('prayersTableBody').innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px;">Loading prayer times...</td></tr>';
        document.getElementById('cardView').innerHTML = '<p style="text-align: center; padding: 40px;">Loading prayer times...</p>';
        
        // 1. Try to use local mosques.js data first (fastest and most reliable for static site)
        // Wait for mosques data if not immediately available
        let retries = 0;
        const MAX_RETRIES = 10; // 5 seconds
        
        while (typeof window.mosques === 'undefined' && retries < MAX_RETRIES) {
            console.log(`Waiting for mosques data... (${retries + 1}/${MAX_RETRIES})`);
            await new Promise(resolve => setTimeout(resolve, 500));
            retries++;
        }

        if (typeof window.mosques !== 'undefined' && Array.isArray(window.mosques) && window.mosques.length > 0) {
            console.log(`✅ Using local mosques.js data (${window.mosques.length} mosques)`);
            prayerTimesData = window.mosques;
            
            // Set date to today
            currentDate = new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            updateStatsAndRender();
            return;
        }

        console.warn('⚠️ Local mosques data not found after retries. Trying API...');

        // 2. Fallback to API if local data missing
        // Determine API URL based on environment
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/api/prayer-times-fallback.json'  // Use fallback for local dev
            : '/api/prayer-times';  // Use serverless function on Vercel
        
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data.success && data.mosques && data.mosques.length > 0) {
            prayerTimesData = data.mosques;
            currentDate = data.date || new Date().toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            updateStatsAndRender();
            console.log(`Loaded ${prayerTimesData.length} mosques from API`);
        } else {
            throw new Error('Invalid API response');
        }
    } catch (error) {
        console.warn('Failed to fetch from API, using fallback data:', error);
        await loadFallbackData();
    }
}

function updateStatsAndRender() {
    stats.totalMosques = prayerTimesData.length;
    
    // Calculate earliest Fajr and latest Isha
    // Simple string comparison for HH:MM format works for finding min/max in same day usually
    // But better to be robust
    const validFajrs = prayerTimesData.map(m => m.fajr).filter(t => t && t.includes(':')).sort();
    const validIshas = prayerTimesData.map(m => m.isha).filter(t => t && t.includes(':')).sort();
    
    stats.earliestFajr = validFajrs.length > 0 ? validFajrs[0] : '--';
    stats.latestIsha = validIshas.length > 0 ? validIshas[validIshas.length - 1] : '--';
    
    // Update UI
    document.getElementById('currentDate').textContent = currentDate;
    updateStatistics();
    
    // Initial render
    filteredData = [...prayerTimesData];
    if (currentView === 'table') {
        renderTableView();
    } else {
        renderCardView();
    }
}


// Load fallback data if API fails
async function loadFallbackData() {
    // Use static fallback data for local development
    prayerTimesData = [
        { name: "Al Ehsaan Academy", fajr: "07:00", dhuhr: "13:15", asr: "15:30", maghrib: "16:11", isha: "19:30" },
        { name: "Jame Masjid", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
        { name: "Central Mosque", fajr: "07:15", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
        { name: "As-Salaam (The Peace Centre)", fajr: "07:30", dhuhr: "12:30", asr: "14:40", maghrib: "16:11", isha: "19:10" }
    ];
    
    currentDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    stats.totalMosques = prayerTimesData.length;
    stats.earliestFajr = '07:00';
    stats.latestIsha = '20:00';
}

// Update statistics display
function updateStatistics() {
    document.getElementById('totalMosques').textContent = stats.totalMosques;
    document.getElementById('earliestFajr').textContent = stats.earliestFajr;
    document.getElementById('latestIsha').textContent = stats.latestIsha;
}

// Render table view
function renderTableView() {
    const tbody = document.getElementById('prayersTableBody');
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    filteredData.forEach(mosque => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="mosque-name">${mosque.name}</td>
            <td class="prayer-time ${mosque.fajr === '--' || mosque.fajr === '-' ? 'no-time' : ''}">${mosque.fajr || '-'}</td>
            <td class="prayer-time ${mosque.dhuhr === '--' || mosque.dhuhr === '-' ? 'no-time' : ''}">${mosque.dhuhr || '-'}</td>
            <td class="prayer-time ${mosque.asr === '--' || mosque.asr === '-' ? 'no-time' : ''}">${mosque.asr || '-'}</td>
            <td class="prayer-time ${mosque.maghrib === '--' || mosque.maghrib === '-' ? 'no-time' : ''}">${mosque.maghrib || '-'}</td>
            <td class="prayer-time ${mosque.isha === '--' || mosque.isha === '-' ? 'no-time' : ''}">${mosque.isha || '-'}</td>
        `;
        tbody.appendChild(row);
    });
}

// Render card view
function renderCardView() {
    const cardView = document.getElementById('cardView');
    cardView.innerHTML = '';
    
    if (filteredData.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    filteredData.forEach(mosque => {
        const card = document.createElement('div');
        card.className = 'prayer-card';
        card.innerHTML = `
            <h3>${mosque.name}</h3>
            <div class="times-grid">
                <div class="time-item">
                    <span class="time-label">Fajr</span>
                    <span class="time-value">${mosque.fajr || '-'}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Dhuhr</span>
                    <span class="time-value">${mosque.dhuhr || '-'}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Asr</span>
                    <span class="time-value">${mosque.asr || '-'}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Maghrib</span>
                    <span class="time-value">${mosque.maghrib || '-'}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Isha</span>
                    <span class="time-value">${mosque.isha || '-'}</span>
                </div>
            </div>
        `;
        cardView.appendChild(card);
    });
}

// Switch between table and card view
function switchView(view) {
    currentView = view;
    
    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    const tableBtn = document.getElementById('tableViewBtn');
    const cardBtn = document.getElementById('cardViewBtn');
    
    if (view === 'table') {
        tableView.style.display = 'block';
        cardView.style.display = 'none';
        tableBtn.classList.add('active');
        cardBtn.classList.remove('active');
        renderTableView();
    } else {
        tableView.style.display = 'none';
        cardView.style.display = 'grid';
        cardBtn.classList.add('active');
        tableBtn.classList.remove('active');
        renderCardView();
    }
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        filteredData = prayerTimesData.filter(mosque => {
            return mosque.name.toLowerCase().includes(searchTerm);
        });
        
        // Update statistics for filtered results
        document.getElementById('totalMosques').textContent = filteredData.length;
        
        if (currentView === 'table') {
            renderTableView();
        } else {
            renderCardView();
        }
    });
}

// Show/hide no results message
function showNoResults() {
    document.getElementById('noResults').style.display = 'block';
    document.getElementById('tableView').style.display = 'none';
    document.getElementById('cardView').style.display = 'none';
}

function hideNoResults() {
    document.getElementById('noResults').style.display = 'none';
}

// Initialize the page
async function init() {
    // Fetch prayer times from API
    await fetchPrayerTimes();
    
    // Update date display
    document.getElementById('currentDate').textContent = currentDate;
    
    // Initialize filtered data
    filteredData = [...prayerTimesData];
    
    // Update statistics
    updateStatistics();
    
    // Setup search
    setupSearch();
    
    // Render initial view (table)
    renderTableView();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
