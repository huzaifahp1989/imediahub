// Leicester Mosques Data - Source: salaahtimes.co.uk
// Prayer times updated: January 7, 2026
const mosques = [
    { name: "Al Ehsaan Academy", address: "96 Evington Road", postcode: "LE2 1HH", fajr: "07:00", dhuhr: "13:15", asr: "15:30", maghrib: "16:11", isha: "19:30" },
    { name: "Al Furqan Centre", address: "1 Kamloops Crescent", postcode: "LE1 2HX", fajr: "07:00", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "19:00" },
    { name: "Al Khayr Building (IDA)", address: "9 Dale Street", postcode: "LE2 0FY", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Al Ma'rifah Academy", address: "140 Armadale Drive", postcode: "LE5 1GZ", fajr: "07:15", dhuhr: "13:00", asr: "15:15", maghrib: "16:11", isha: "19:15" },
    { name: "As-Salaam (The Peace Centre)", address: "Thurncourt Road", postcode: "LE5 2NG", fajr: "07:30", dhuhr: "12:30", asr: "14:40", maghrib: "16:11", isha: "19:10" },
    { name: "Baytul Ihsaan (Darul Fath)", address: "202 Sandhills Avenue", postcode: "LE5 1PL", fajr: "06:50", dhuhr: "12:45", asr: "14:45", maghrib: "16:12", isha: "20:00" },
    { name: "Beaumont Leys Muslims", address: "Home Farm Close", postcode: "LE4 0SU", fajr: "06:53", dhuhr: "12:30", asr: "14:30", maghrib: "16:16", isha: "19:30" },
    { name: "Central Mosque", address: "Conduit Street", postcode: "LE2 0JN", fajr: "07:15", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "City Retreat Leicester", address: "70-74 Churchgate", postcode: "LE1 4AL", fajr: "06:45", dhuhr: "12:30", asr: "14:30", maghrib: "16:11", isha: "18:15" },
    { name: "Coleman Lodge Prayer Room", address: "The Wayne Way", postcode: "LE5 4PP", fajr: "06:50", dhuhr: "12:40", asr: "14:50", maghrib: "16:10", isha: "18:30" },
    { name: "Darul Arqam Education Centre", address: "16 Thurmaston Lane", postcode: "LE5 0TE", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:08", isha: "19:15" },
    { name: "Darul Ihsaan (The Mayflower)", address: "1 Gervas Road", postcode: "LE5 2EH", fajr: "07:00", dhuhr: "13:00", asr: "14:45", maghrib: "16:11", isha: "19:30" },
    { name: "Darul Uloom Al- Imam Muhammad Adam Al-Islamiyyah", address: "190 Tithe Street", postcode: "LE5 4BN", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Darus-Salam Masjid", address: "55-57 Upper Tichborne Street", postcode: "LE2 1GL", fajr: "07:30", dhuhr: "13:00", asr: "15:15", maghrib: "16:12", isha: "19:00" },
    { name: "Eyres Monsell Community Centre", address: "268 Hillsborough Road", postcode: "LE2 9PQ", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Faizan-E-Madina", address: "Malabar Road", postcode: "LE1 2LG", fajr: "07:30", dhuhr: "13:30", asr: "15:15", maghrib: "16:10", isha: "20:00" },
    { name: "Faiz-E-Raza Academy", address: "Humberstone Road", postcode: "LE5 3DF", fajr: "07:15", dhuhr: "13:00", asr: "14:45", maghrib: "16:11", isha: "20:00" },
    { name: "Gulzar-E-Madina", address: "Melbourne Road", postcode: "LE2 0GU", fajr: "07:15", dhuhr: "13:15", asr: "15:15", maghrib: "16:11", isha: "19:15" },
    { name: "Hajra Mosque", address: "24 Madras Road", postcode: "LE1 2LT", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "18:15" },
    { name: "Islamic Da'wah Academy (IDA)", address: "120 Melbourne Road", postcode: "LE2 0DS", fajr: "06:20", dhuhr: "12:40", asr: "15:00", maghrib: "16:11", isha: "20:30" },
    { name: "Jame Masjid", address: "51 Asfordby Street", postcode: "LE5 3QG", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Jamia Sufiya", address: "44 Highfield Street", postcode: "LE2 1AD", fajr: "07:00", dhuhr: "13:30", asr: "15:20", maghrib: "16:11", isha: "18:30" },
    { name: "Khadijatul Kubra Mosque", address: "3 Dore Road", postcode: "LE5 5HG", fajr: "07:00", dhuhr: "12:30", asr: "14:30", maghrib: "16:11", isha: "18:30" },
    { name: "Leicester General Hospital", address: "Gwendolen Road", postcode: "LE5 4PW", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Leicester Mosque (Sutherland St)", address: "2a Sutherland Street", postcode: "LE2 1DS", fajr: "07:15", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "Leicester Turkish Education & Cultural Society", address: "277 Saffron Lane", postcode: "LE2 6UD", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:14", isha: "20:00" },
    { name: "Madani Education Centre", address: "60 Malabar Road", postcode: "LE1 2PD", fajr: "07:00", dhuhr: "12:45", asr: "15:00", maghrib: "16:11", isha: "19:45" },
    { name: "Madani School Masjid", address: "77 Evington Valley Road", postcode: "LE5 5LL", fajr: "06:30", dhuhr: "--", asr: "--", maghrib: "16:11", isha: "20:00" },
    { name: "Madrasah Baytul 'ilm (Masjid Ibraheem)", address: "Spinney Hill Road", postcode: "LE5 3GH", fajr: "07:00", dhuhr: "12:40", asr: "14:55", maghrib: "16:11", isha: "20:00" },
    { name: "Madrasah Faruqiyyah (Woodgate)", address: "36 Woodgate", postcode: "LE3 5GE", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Madrasah Hamidiya (HCO)", address: "11 Abbotsford Road", postcode: "LE5 4DA", fajr: "07:25", dhuhr: "12:35", asr: "15:10", maghrib: "16:11", isha: "19:15" },
    { name: "Madrasah Ta'leemul Qur'an (Knighton CEC)", address: "355 Welford Road", postcode: "LE2 6AF", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Majlis e Dawatul Haq", address: "126-130 Earl Howe Street", postcode: "LE2 0DG", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Markaz Attawheed", address: "2-6 Britannia Street", postcode: "LE1 3LE", fajr: "06:40", dhuhr: "12:30", asr: "14:00", maghrib: "16:11", isha: "18:01" },
    { name: "Markaz Quba", address: "21 Tichborne Street", postcode: "LE2 0NQ", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:16", isha: "19:00" },
    { name: "Markfield Mosque", address: "Ratby Lane", postcode: "LE67 9SY", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Masjid Abdullah ibn Mas'ood", address: "Hallaton Street", postcode: "LE2 8QU", fajr: "07:15", dhuhr: "12:30", asr: "15:00", maghrib: "16:11", isha: "20:15" },
    { name: "Masjid Abu Bakr", address: "55 Barclay Street", postcode: "LE3 0JD", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:45" },
    { name: "Masjid Abu Hurairah", address: "9 Haynes Road", postcode: "LE5 4AR", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Masjid Adam (Oadby Community Hub)", address: "31 Wigston Road", postcode: "LE2 5QF", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Aisha", address: "22-28 Cork Street", postcode: "LE5 5AN", fajr: "07:00", dhuhr: "13:00", asr: "14:40", maghrib: "16:11", isha: "18:21" },
    { name: "Masjid Al Furqan", address: "298 East Park Road", postcode: "LE5 5AY", fajr: "06:45", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:00" },
    { name: "Masjid Al-Ansar", address: "39 Edgehill Road", postcode: "LE4 9EA", fajr: "07:00", dhuhr: "12:45", asr: "14:15", maghrib: "16:16", isha: "20:00" },
    { name: "Masjid Al-Falah", address: "3-13 Keythorpe Street", postcode: "LE2 0AL", fajr: "07:20", dhuhr: "13:00", asr: "15:00", maghrib: "16:10", isha: "19:45" },
    { name: "Masjid Al-Huda", address: "8 Brittania Street", postcode: "LE1 3LE", fajr: "07:00", dhuhr: "12:45", asr: "14:30", maghrib: "16:11", isha: "18:30" },
    { name: "Masjid Ali", address: "42-52 Smith Dorrien Road", postcode: "LE5 4BG", fajr: "07:15", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Al-Khaleel (MIQ)", address: "49 Donnington Street", postcode: "LE2 0DE", fajr: "07:15", dhuhr: "12:30", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid An Noor (Belgrave)", address: "170a Belgrave Gate", postcode: "LE1 3XL", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "18:30" },
    { name: "Masjid An Noor (Highfields)", address: "146 Berners Street", postcode: "LE2 0FU", fajr: "07:15", dhuhr: "12:45", asr: "15:15", maghrib: "16:11", isha: "19:40" },
    { name: "Masjid Ar-Rahmaan", address: "71 Guthlaxton Street", postcode: "LE2 0SF", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:10", isha: "18:15" },
    { name: "Masjid At-Taqwa", address: "1 Harewood Street", postcode: "LE5 3LX", fajr: "06:45", dhuhr: "12:45", asr: "14:15", maghrib: "16:11", isha: "19:30" },
    { name: "Masjid Bilal", address: "80 Evington Valley Road", postcode: "LE5 5NH", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "Masjid Darul Sunnah (Welford Rd)", address: "Muslim Welfare House", postcode: "LE2 6BD", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:16", isha: "19:30" },
    { name: "Masjid e Baitul Mukarram", address: "22-24 St. Stephens Road", postcode: "LE2 1DQ", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Masjid Fatima Zahra R.A", address: "72-72 Osmaston Road", postcode: "LE5 5JG", fajr: "07:10", dhuhr: "12:25", asr: "15:20", maghrib: "16:11", isha: "18:25" },
    { name: "Masjid Fida", address: "33 Rowsley Street & 9 Osmaston Road", postcode: "LE5 5JN", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "19:10" },
    { name: "Masjid Mu'adh ibn Jabal", address: "60 Gamel Road", postcode: "LE5 6TB", fajr: "07:00", dhuhr: "13:00", asr: "14:45", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Muhammad", address: "5 Claymill Road, Thurmaston", postcode: "LE4 9JJ", fajr: "07:00", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Noor-ul-Islam", address: "Linden Street", postcode: "LE5 5EE", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:20" },
    { name: "Masjid Quba", address: "19 Brunswick Street", postcode: "LE1 2LP", fajr: "06:45", dhuhr: "12:30", asr: "14:15", maghrib: "16:11", isha: "19:00" },
    { name: "Masjid Salahuddin", address: "9 Upper George Street", postcode: "LE1 3LQ", fajr: "06:45", dhuhr: "12:45", asr: "14:30", maghrib: "16:11", isha: "19:40" },
    { name: "Masjid Taybah", address: "362 St Saviours Road", postcode: "LE5 4HJ", fajr: "07:00", dhuhr: "12:30", asr: "14:00", maghrib: "16:11", isha: "18:45" },
    { name: "Masjid Ul Imam il Bukhari", address: "159 Loughborough Road", postcode: "LE4 5LR", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Masjid Umar", address: "1-3 Evington Drive", postcode: "LE5 5PF", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:00" },
    { name: "Masjid Usman (Markaz)", address: "162 Nedham Street", postcode: "LE2 0HB", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "20:15" },
    { name: "Masjid-al-Ameen Oadby", address: "Sandhurst Street", postcode: "LE2 5AR", fajr: "07:15", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "Masjidul Islah", address: "Northfields Neighbourhood Centre", postcode: "LE5 0HA", fajr: "06:45", dhuhr: "13:00", asr: "14:30", maghrib: "16:10", isha: "19:30" },
    { name: "Melton Mowbray", address: "Harwood House, Park Road", postcode: "LE13 1TX", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Mostyn Street Musalla", address: "6 Mostyn Street", postcode: "LE3 6DT", fajr: "06:40", dhuhr: "12:45", asr: "15:10", maghrib: "16:11", isha: "19:05" },
    { name: "Mubashırun Community Center", address: "Unit3 10 Gough Road", postcode: "LE5 4AL", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Muhaddith E Azam Mission Leicester", address: "170 Prestwold Road", postcode: "LE5 0EZ", fajr: "--", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "19:30" },
    { name: "New Parks Academy Musalla", address: "22 Dillon Road", postcode: "LE3 9PF", fajr: "07:00", dhuhr: "--", asr: "--", maghrib: "16:11", isha: "19:15" },
    { name: "New Parks Community Centre", address: "St Oswalds Road", postcode: "LE3 6JR", fajr: "--", dhuhr: "--", asr: "--", maghrib: "--", isha: "--" },
    { name: "Northfields Education Centre", address: "8 Essex Road", postcode: "LE4 9EE", fajr: "06:30", dhuhr: "13:00", asr: "15:00", maghrib: "16:11", isha: "19:40" },
    { name: "Raza Centre", address: "28a Egginton Street", postcode: "LE5 5BA", fajr: "07:00", dhuhr: "13:30", asr: "15:00", maghrib: "16:10", isha: "19:00" },
    { name: "Sayyidah Zahra Centre", address: "22 Devana Road", postcode: "LE2 1PN", fajr: "07:15", dhuhr: "13:30", asr: "15:30", maghrib: "16:11", isha: "19:30" },
    { name: "Tajdaar-E-Madina", address: "1a Garendon Street", postcode: "LE2 0AH", fajr: "07:00", dhuhr: "13:15", asr: "15:15", maghrib: "16:11", isha: "18:45" },
    { name: "The Hamilton Hub (Darul Fath)", address: "Unit 1 Maidenwell Avenue", postcode: "LE5 1BJ", fajr: "07:00", dhuhr: "13:00", asr: "15:00", maghrib: "16:12", isha: "20:15" },
    { name: "Usmani Mosque", address: "308 St Saviours Road", postcode: "LE5 4HJ", fajr: "07:00", dhuhr: "13:15", asr: "15:00", maghrib: "16:11", isha: "20:00" }
];

let filteredMosques = [...mosques];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayMosques(mosques);
    updateStats();
    setupSearch();
    setupFilters();
});

// Display mosques in grid
function displayMosques(mosquesToDisplay) {
    const grid = document.getElementById('mosqueGrid');
    const noResults = document.getElementById('noResults');
    
    grid.innerHTML = '';
    
    if (mosquesToDisplay.length === 0) {
        noResults.style.display = 'block';
        grid.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    grid.style.display = 'grid';
    
    mosquesToDisplay.forEach(mosque => {
        const card = document.createElement('div');
        card.className = 'mosque-card';
        
        const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mosque.address + ', ' + mosque.postcode + ', Leicester')}`;
        
        // Format prayer times display
        const hasTimes = mosque.fajr !== '--';
        const prayerTimesHTML = hasTimes ? `
            <div class="prayer-times">
                <div class="prayer-row">
                    <span>Fajr</span><strong>${mosque.fajr}</strong>
                </div>
                <div class="prayer-row">
                    <span>Dhuhr</span><strong>${mosque.dhuhr}</strong>
                </div>
                <div class="prayer-row">
                    <span>Asr</span><strong>${mosque.asr}</strong>
                </div>
                <div class="prayer-row">
                    <span>Maghrib</span><strong>${mosque.maghrib}</strong>
                </div>
                <div class="prayer-row">
                    <span>Isha</span><strong>${mosque.isha}</strong>
                </div>
            </div>
        ` : '<p class="no-times">Prayer times not available</p>';
        
        card.innerHTML = `
            <h3>${mosque.name}</h3>
            <div class="address">
                <span>📍</span>
                <span>${mosque.address}</span>
            </div>
            <span class="postcode">${mosque.postcode}</span>
            ${prayerTimesHTML}
            <a href="${mapUrl}" target="_blank" class="map-link">
                🗺️ Open in Maps →
            </a>
        `;
        
        grid.appendChild(card);
    });
}

// Update statistics
function updateStats() {
    document.getElementById('totalMosques').textContent = filteredMosques.length;
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        
        filteredMosques = mosques.filter(mosque => {
            return mosque.name.toLowerCase().includes(searchTerm) ||
                   mosque.address.toLowerCase().includes(searchTerm) ||
                   mosque.postcode.toLowerCase().includes(searchTerm);
        });
        
        displayMosques(filteredMosques);
        updateStats();
    });
}

// Setup filter functionality
function setupFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            tag.classList.add('active');
            
            const filter = tag.getAttribute('data-filter');
            
            if (filter === 'all') {
                filteredMosques = [...mosques];
            } else if (filter === 'masjid') {
                filteredMosques = mosques.filter(m => m.name.toLowerCase().includes('masjid'));
            } else if (filter === 'madrasah') {
                filteredMosques = mosques.filter(m => m.name.toLowerCase().includes('madrasah'));
            } else if (filter === 'centre') {
                filteredMosques = mosques.filter(m => 
                    m.name.toLowerCase().includes('centre') || 
                    m.name.toLowerCase().includes('center') ||
                    m.name.toLowerCase().includes('academy')
                );
            }
            
            // Clear search when filtering
            document.getElementById('searchInput').value = '';
            
            displayMosques(filteredMosques);
            updateStats();
        });
    });
}
