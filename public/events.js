// ==============================
// EVENTS & COMPETITIONS - FRONTEND
// ==============================

// Initialize Firebase (check if already initialized)
let db;
let storage;

function initializeFirebase() {
    if (typeof firebase !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        db = firebase.firestore();
        storage = firebase.storage();
        console.log('Firebase initialized for Events');
        loadEvents();
    } else {
        console.error('Firebase or config not available');
        showError('Firebase configuration missing. Please check config.js');
    }
}

// State management
let allEvents = [];
let filteredEvents = [];
let currentStatusFilter = 'all';
let currentTypeFilter = 'all';
let searchQuery = '';

// Load events from Firestore
async function loadEvents() {
    showLoading();
    
    try {
        const eventsRef = db.collection('events');
        const snapshot = await eventsRef.orderBy('date', 'desc').get();
        
        allEvents = [];
        snapshot.forEach(doc => {
            allEvents.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        // Sort events: Upcoming first, then Live, then Completed
        allEvents.sort((a, b) => {
            const statusOrder = { upcoming: 1, live: 2, completed: 3 };
            const statusDiff = statusOrder[a.status] - statusOrder[b.status];
            
            if (statusDiff !== 0) return statusDiff;
            
            // Within same status, sort by date
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB - dateA;
        });
        
        applyFilters();
    } catch (error) {
        console.error('Error loading events:', error);
        showError('Failed to load events. Please try again.');
    }
}

// Apply filters
function applyFilters() {
    filteredEvents = allEvents.filter(event => {
        // Status filter
        const statusMatch = currentStatusFilter === 'all' || event.status === currentStatusFilter;
        
        // Type filter
        const typeMatch = currentTypeFilter === 'all' || event.type === currentTypeFilter;
        
        // Search filter
        const searchMatch = searchQuery === '' || 
            event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase()));
        
        return statusMatch && typeMatch && searchMatch;
    });
    
    displayEvents();
}

// Display events
function displayEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    
    loadingState.style.display = 'none';
    
    if (filteredEvents.length === 0) {
        eventsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    eventsGrid.style.display = 'grid';
    eventsGrid.innerHTML = '';
    
    filteredEvents.forEach(event => {
        const eventCard = createEventCard(event);
        eventsGrid.appendChild(eventCard);
    });
}

// Create event card
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.onclick = () => {
        window.location.href = `event-details.html?id=${event.id}`;
    };
    
    // Format date and time
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
    
    // Countdown for upcoming events
    let countdownHTML = '';
    if (event.status === 'upcoming') {
        const eventDateTime = new Date(`${event.date}T${event.time}`);
        const now = new Date();
        const diff = eventDateTime - now;
        
        if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            
            if (days > 0) {
                countdownHTML = `<div class="countdown-small">Starts in ${days} day${days > 1 ? 's' : ''}</div>`;
            } else if (hours > 0) {
                countdownHTML = `<div class="countdown-small">Starts in ${hours} hour${hours > 1 ? 's' : ''}</div>`;
            } else {
                countdownHTML = `<div class="countdown-small">Starting soon!</div>`;
            }
        }
    }
    
    card.innerHTML = `
        <img src="${event.image_url}" alt="${event.title}" class="event-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22200%22%3E%3Crect fill=%22%23667eea%22 width=%22400%22 height=%22200%22/%3E%3Ctext fill=%22white%22 font-family=%22Arial%22 font-size=%2220%22 x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22%3EEvent Image%3C/text%3E%3C/svg%3E'">
        <div class="event-content">
            <div class="event-header">
                <span class="event-type ${event.type}">${event.type}</span>
                <span class="event-status ${event.status}">${event.status}</span>
            </div>
            <h3 class="event-title-text">${event.title}</h3>
            <p class="event-description-text">${event.description}</p>
            ${countdownHTML}
            <div class="event-meta-info">
                <div class="event-meta-item">
                    <span class="icon">📅</span>
                    <span>${formattedDate}</span>
                </div>
                <div class="event-meta-item">
                    <span class="icon">🕐</span>
                    <span>${event.time}</span>
                </div>
                ${event.location ? `
                    <div class="event-meta-item">
                        <span class="icon">📍</span>
                        <span>${event.location}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Show loading state
function showLoading() {
    document.getElementById('loadingState').style.display = 'block';
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('eventsGrid').style.display = 'none';
}

// Show error
function showError(message) {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.style.display = 'block';
    eventsGrid.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Error</h3>
            <p>${message}</p>
        </div>
    `;
    document.getElementById('loadingState').style.display = 'none';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    initializeFirebase();
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            applyFilters();
        });
    }
    
    // Status filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStatusFilter = btn.dataset.filter;
            applyFilters();
        });
    });
    
    // Type filter buttons
    const typeBtns = document.querySelectorAll('.type-btn');
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentTypeFilter = btn.dataset.type;
            applyFilters();
        });
    });
});

// Real-time updates (optional)
function enableRealTimeUpdates() {
    if (!db) return;
    
    db.collection('events').onSnapshot(snapshot => {
        loadEvents();
    });
}

// Enable real-time updates
// enableRealTimeUpdates();
