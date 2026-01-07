// Today's Prayer Times Data - Source: salaahtimes.co.uk
// Last updated: January 7, 2026

const prayerTimesData = [
    { name: "Al Ehsaan Academy", fajr: "07:00", dhuhr: "13:15", asr: "15:30", maghrib: "16:11", isha: "19:30" },
    { name: "Al Furqan Centre", fajr: "07:00", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "19:00" },
    { name: "Al Ma'rifah Academy", fajr: "07:15", dhuhr: "13:00", asr: "15:15", maghrib: "16:11", isha: "19:15" },
    { name: "As-Salaam (The Peace Centre)", fajr: "07:30", dhuhr: "12:30", asr: "14:40", maghrib: "16:11", isha: "19:10" },
    { name: "Baytul Ihsaan (Darul Fath)", fajr: "06:50", dhuhr: "12:45", asr: "14:45", maghrib: "16:12", isha: "20:00" },
    { name: "Beaumont Leys Muslims", fajr: "06:53", dhuhr: "12:30", asr: "14:30", maghrib: "16:16", isha: "19:30" },
    { name: "Central Mosque", fajr: "07:15", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "City Retreat Leicester", fajr: "06:45", dhuhr: "12:30", asr: "14:30", maghrib: "16:11", isha: "18:15" },
    { name: "Coleman Lodge Prayer Room", fajr: "06:50", dhuhr: "12:40", asr: "14:50", maghrib: "16:10", isha: "18:30" },
    { name: "Darul Arqam Education Centre", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:08", isha: "19:15" },
    { name: "Darul Ihsaan (The Mayflower)", fajr: "07:00", dhuhr: "13:00", asr: "14:45", maghrib: "16:11", isha: "19:30" },
    { name: "Darus-Salam Masjid", fajr: "07:30", dhuhr: "13:00", asr: "15:15", maghrib: "16:12", isha: "19:00" },
    { name: "Faizan-E-Madina", fajr: "07:30", dhuhr: "13:30", asr: "15:15", maghrib: "16:10", isha: "20:00" },
    { name: "Faiz-E-Raza Academy", fajr: "07:15", dhuhr: "13:00", asr: "14:45", maghrib: "16:11", isha: "20:00" },
    { name: "Gulzar-E-Madina", fajr: "07:15", dhuhr: "13:15", asr: "15:15", maghrib: "16:11", isha: "19:15" },
    { name: "Hajra Mosque", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "18:15" },
    { name: "Islamic Da'wah Academy (IDA)", fajr: "06:20", dhuhr: "12:40", asr: "15:00", maghrib: "16:11", isha: "20:30" },
    { name: "Jame Masjid", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Jamia Sufiya", fajr: "07:00", dhuhr: "13:30", asr: "15:20", maghrib: "16:11", isha: "18:30" },
    { name: "Khadijatul Kubra Mosque", fajr: "07:00", dhuhr: "12:30", asr: "14:30", maghrib: "16:11", isha: "18:30" },
    { name: "Leicester Mosque (Sutherland St)", fajr: "07:15", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "Leicester Turkish Education & Cultural Society", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:14", isha: "20:00" },
    { name: "Madani Education Centre", fajr: "07:00", dhuhr: "12:45", asr: "15:00", maghrib: "16:11", isha: "19:45" },
    { name: "Madani School Masjid", fajr: "06:30", dhuhr: "--", asr: "--", maghrib: "16:11", isha: "20:00" },
    { name: "Madrasah Baytul 'ilm (Masjid Ibraheem)", fajr: "07:00", dhuhr: "12:40", asr: "14:55", maghrib: "16:11", isha: "20:00" },
    { name: "Madrasah Hamidiya (HCO)", fajr: "07:25", dhuhr: "12:35", asr: "15:10", maghrib: "16:11", isha: "19:15" },
    { name: "Madrasah Ta'leemul Qur'an (Knighton CEC)", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Majlis e Dawatul Haq", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Markaz Attawheed", fajr: "06:40", dhuhr: "12:30", asr: "14:00", maghrib: "16:11", isha: "18:01" },
    { name: "Markaz Quba", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:16", isha: "19:00" },
    { name: "Masjid Abdullah ibn Mas'ood", fajr: "07:15", dhuhr: "12:30", asr: "15:00", maghrib: "16:11", isha: "20:15" },
    { name: "Masjid Abu Bakr", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:45" },
    { name: "Masjid Adam (Oadby Community Hub)", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Aisha", fajr: "07:00", dhuhr: "13:00", asr: "14:40", maghrib: "16:11", isha: "18:21" },
    { name: "Masjid Al Furqan", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:00" },
    { name: "Masjid Al-Ansar", fajr: "07:00", dhuhr: "12:45", asr: "14:15", maghrib: "16:16", isha: "20:00" },
    { name: "Masjid Al-Falah", fajr: "07:20", dhuhr: "13:00", asr: "15:00", maghrib: "16:10", isha: "19:45" },
    { name: "Masjid Al-Huda", fajr: "07:00", dhuhr: "12:45", asr: "14:30", maghrib: "16:11", isha: "18:30" },
    { name: "Masjid Ali", fajr: "07:15", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Al-Khaleel (MIQ)", fajr: "07:15", dhuhr: "12:30", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid An Noor (Belgrave)", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "18:30" },
    { name: "Masjid An Noor (Highfields)", fajr: "07:15", dhuhr: "12:45", asr: "15:15", maghrib: "16:11", isha: "19:40" },
    { name: "Masjid Ar-Rahmaan", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:10", isha: "18:15" },
    { name: "Masjid At-Taqwa", fajr: "06:45", dhuhr: "12:45", asr: "14:15", maghrib: "16:11", isha: "19:30" },
    { name: "Masjid Bilal", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "Masjid Darul Sunnah (Welford Rd)", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:16", isha: "19:30" },
    { name: "Masjid Fatima Zahra R.A", fajr: "07:10", dhuhr: "12:25", asr: "15:20", maghrib: "16:11", isha: "18:25" },
    { name: "Masjid Fida", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "19:10" },
    { name: "Masjid Mu'adh ibn Jabal", fajr: "07:00", dhuhr: "13:00", asr: "14:45", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Muhammad", fajr: "07:00", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Noor-ul-Islam", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:20" },
    { name: "Masjid Quba", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "19:00" },
    { name: "Masjid Salahuddin", fajr: "06:45", dhuhr: "12:45", asr: "14:30", maghrib: "16:11", isha: "19:40" },
    { name: "Masjid Taybah", fajr: "07:00", dhuhr: "12:30", asr: "14:00", maghrib: "16:11", isha: "18:45" },
    { name: "Masjid Umar", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Usman (Markaz)", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:15" },
    { name: "Masjid-al-Ameen Oadby", fajr: "07:15", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "Masjidul Islah", fajr: "06:45", dhuhr: "13:00", asr: "14:30", maghrib: "16:10", isha: "19:30" },
    { name: "Mostyn Street Musalla", fajr: "06:40", dhuhr: "12:45", asr: "15:10", maghrib: "16:11", isha: "19:05" },
    { name: "Muhaddith E Azam Mission Leicester", fajr: "--", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "New Parks Academy Musalla", fajr: "07:00", dhuhr: "--", asr: "--", maghrib: "16:11", isha: "19:15" },
    { name: "Northfields Education Centre", fajr: "06:30", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:40" },
    { name: "Raza Centre", fajr: "07:00", dhuhr: "13:30", asr: "15:00", maghrib: "16:10", isha: "19:00" },
    { name: "Sayyidah Zahra Centre", fajr: "07:15", dhuhr: "13:30", asr: "15:30", maghrib: "16:11", isha: "19:30" },
    { name: "Tajdaar-E-Madina", fajr: "07:00", dhuhr: "13:15", asr: "15:15", maghrib: "16:11", isha: "18:45" },
    { name: "The Hamilton Hub (Darul Fath)", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:12", isha: "20:15" },
    { name: "Usmani Mosque", fajr: "07:00", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "20:00" }
];

let filteredData = [...prayerTimesData];
let currentView = 'table';

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    updateStatistics();
    renderTableView();
    setupSearch();
});

// Update current date
function updateDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const today = new Date();
    const dayName = days[today.getDay()];
    const monthName = months[today.getMonth()];
    const date = today.getDate();
    const year = today.getFullYear();
    
    document.getElementById('currentDate').textContent = `${dayName}, ${monthName} ${date}, ${year}`;
}

// Update statistics
function updateStatistics() {
    const validTimes = filteredData.filter(m => m.fajr !== '--');
    
    document.getElementById('totalMosques').textContent = filteredData.length;
    
    if (validTimes.length > 0) {
        // Find earliest Fajr
        const earliestFajr = validTimes.reduce((earliest, current) => {
            return current.fajr < earliest.fajr ? current : earliest;
        }).fajr;
        
        // Find latest Isha
        const latestIsha = validTimes.reduce((latest, current) => {
            return current.isha !== '--' && current.isha > latest.isha ? current : latest;
        }).isha;
        
        document.getElementById('earliestFajr').textContent = earliestFajr;
        document.getElementById('latestIsha').textContent = latestIsha;
    }
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
            <td class="prayer-time ${mosque.fajr === '--' ? 'no-time' : ''}">${mosque.fajr}</td>
            <td class="prayer-time ${mosque.dhuhr === '--' ? 'no-time' : ''}">${mosque.dhuhr}</td>
            <td class="prayer-time ${mosque.asr === '--' ? 'no-time' : ''}">${mosque.asr}</td>
            <td class="prayer-time ${mosque.maghrib === '--' ? 'no-time' : ''}">${mosque.maghrib}</td>
            <td class="prayer-time ${mosque.isha === '--' ? 'no-time' : ''}">${mosque.isha}</td>
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
                    <span class="time-value">${mosque.fajr}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Dhuhr</span>
                    <span class="time-value">${mosque.dhuhr}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Asr</span>
                    <span class="time-value">${mosque.asr}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Maghrib</span>
                    <span class="time-value">${mosque.maghrib}</span>
                </div>
                <div class="time-item">
                    <span class="time-label">Isha</span>
                    <span class="time-value">${mosque.isha}</span>
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
        
        updateStatistics();
        
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
