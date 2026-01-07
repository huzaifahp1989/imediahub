// ==============================
// EVENT DETAILS PAGE
// ==============================

// Initialize Firebase
let db;

function initializeFirebase() {
    if (typeof firebase !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        db = firebase.firestore();
        console.log('Firebase initialized for Event Details');
        loadEventDetails();
    } else {
        console.error('Firebase or config not available');
        showError();
    }
}

// Get event ID from URL
function getEventIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// Load event details
async function loadEventDetails() {
    const eventId = getEventIdFromURL();
    
    if (!eventId) {
        showError();
        return;
    }
    
    try {
        const doc = await db.collection('events').doc(eventId).get();
        
        if (!doc.exists) {
            showError();
            return;
        }
        
        const event = { id: doc.id, ...doc.data() };
        displayEventDetails(event);
    } catch (error) {
        console.error('Error loading event details:', error);
        showError();
    }
}

// Display event details
function displayEventDetails(event) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('eventDetailsContent').style.display = 'block';
    
    // Set page title
    document.title = `${event.title} - Islamic Utility Hub`;
    
    // Event image
    const eventImage = document.getElementById('eventImage');
    eventImage.src = event.image_url;
    eventImage.alt = event.title;
    
    // Status badge
    const statusBadge = document.getElementById('eventStatusBadge');
    statusBadge.textContent = event.status;
    statusBadge.className = `event-status-badge event-status ${event.status}`;
    
    // Event type tag
    const typeTag = document.getElementById('eventTypeTag');
    typeTag.textContent = event.type;
    typeTag.className = `event-type-tag event-type ${event.type}`;
    
    // Event title
    document.getElementById('eventTitle').textContent = event.title;
    
    // Countdown timer for upcoming events
    if (event.status === 'upcoming') {
        setupCountdown(event.date, event.time);
    }
    
    // Event date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('eventDate').textContent = formattedDate;
    
    // Event time
    document.getElementById('eventTime').textContent = event.time;
    
    // Location (optional)
    if (event.location && event.location.trim() !== '') {
        document.getElementById('locationMeta').style.display = 'flex';
        document.getElementById('eventLocation').textContent = event.location;
    }
    
    // Event description
    document.getElementById('eventDescription').textContent = event.description;
    
    // Added date
    const createdDate = event.created_at ? new Date(event.created_at.seconds * 1000) : new Date();
    const formattedCreatedDate = createdDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    document.getElementById('addedDate').textContent = formattedCreatedDate;
    
    // Setup share button
    setupShareButton(event);
}

// Setup countdown timer
function setupCountdown(date, time) {
    const countdownTimer = document.getElementById('countdownTimer');
    const eventDateTime = new Date(`${date}T${time}`);
    
    function updateCountdown() {
        const now = new Date();
        const diff = eventDateTime - now;
        
        if (diff <= 0) {
            countdownTimer.style.display = 'none';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.getElementById('daysValue').textContent = days;
        document.getElementById('hoursValue').textContent = hours;
        document.getElementById('minutesValue').textContent = minutes;
        document.getElementById('secondsValue').textContent = seconds;
        
        countdownTimer.style.display = 'block';
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Setup share button
function setupShareButton(event) {
    const shareBtn = document.getElementById('shareBtn');
    
    shareBtn.addEventListener('click', async () => {
        const shareData = {
            title: event.title,
            text: `Check out this event: ${event.title}\n\n${event.description.substring(0, 100)}...`,
            url: window.location.href
        };
        
        // Try using Web Share API
        if (navigator.share) {
            try {
                await navigator.share(shareData);
                console.log('Shared successfully');
            } catch (error) {
                if (error.name !== 'AbortError') {
                    fallbackShare(shareData);
                }
            }
        } else {
            fallbackShare(shareData);
        }
    });
}

// Fallback share method
function fallbackShare(shareData) {
    // Copy to clipboard
    const textToCopy = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification('Link copied to clipboard!');
        }).catch(() => {
            showShareDialog(textToCopy);
        });
    } else {
        showShareDialog(textToCopy);
    }
}

// Show share dialog
function showShareDialog(text) {
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 10000;
        max-width: 500px;
        width: 90%;
    `;
    
    dialog.innerHTML = `
        <h3 style="margin-bottom: 15px;">Share Event</h3>
        <textarea readonly style="width: 100%; padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-family: inherit; min-height: 150px; resize: vertical;">${text}</textarea>
        <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 10px 20px; background: #1E88E5; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600;">Close</button>
    `;
    
    document.body.appendChild(dialog);
    
    // Select text
    const textarea = dialog.querySelector('textarea');
    textarea.select();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: #2E7D32;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show error state
function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
