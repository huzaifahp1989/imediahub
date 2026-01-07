// ==============================
// ADMIN PANEL - EVENTS MANAGEMENT
// ==============================

// Initialize Firebase
let db;
let storage;
let auth;
let currentUser = null;
let isEditMode = false;
let currentEditId = null;

function initializeFirebase() {
    if (typeof firebase !== 'undefined' && typeof FIREBASE_CONFIG !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(FIREBASE_CONFIG);
        }
        db = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();
        console.log('Firebase initialized for Admin Panel');
        
        // Check auth state
        auth.onAuthStateChanged(user => {
            if (user) {
                currentUser = user;
                showAdminPanel();
                loadAdminEvents();
            } else {
                showLoginScreen();
            }
        });
    } else {
        console.error('Firebase or config not available');
        document.getElementById('loginError').textContent = 'Firebase configuration missing';
        document.getElementById('loginError').style.display = 'block';
    }
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminPanel').style.display = 'none';
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminUserEmail').textContent = currentUser.email;
}

// Login handler
document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const loginError = document.getElementById('loginError');
    const loginBtn = document.getElementById('loginBtn');
    
    if (!email || !password) {
        loginError.textContent = 'Please enter both email and password';
        loginError.style.display = 'block';
        return;
    }
    
    loginBtn.disabled = true;
    loginBtn.textContent = 'Logging in...';
    loginError.style.display = 'none';
    
    try {
        await auth.signInWithEmailAndPassword(email, password);
        // Auth state change will handle showing admin panel
    } catch (error) {
        console.error('Login error:', error);
        loginError.textContent = getErrorMessage(error.code);
        loginError.style.display = 'block';
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await auth.signOut();
        showLoginScreen();
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
});

// Get friendly error message
function getErrorMessage(code) {
    switch (code) {
        case 'auth/invalid-email':
            return 'Invalid email address';
        case 'auth/user-disabled':
            return 'This account has been disabled';
        case 'auth/user-not-found':
            return 'Invalid email or password';
        case 'auth/wrong-password':
            return 'Invalid email or password';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later';
        default:
            return 'Login failed. Please check your credentials';
    }
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
    });
});

// Event form submission
document.getElementById('eventForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = document.getElementById('btnText');
    const formMessage = document.getElementById('formMessage');
    
    // Get form values
    const title = document.getElementById('eventTitleInput').value.trim();
    const type = document.getElementById('eventTypeInput').value;
    const status = document.getElementById('eventStatusInput').value;
    const date = document.getElementById('eventDateInput').value;
    const time = document.getElementById('eventTimeInput').value;
    const location = document.getElementById('eventLocationInput').value.trim();
    const description = document.getElementById('eventDescriptionInput').value.trim();
    const imageFile = document.getElementById('eventImageInput').files[0];
    
    // Validation
    if (!title || !type || !status || !date || !time || !description) {
        showFormMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Check if image is required (new event)
    if (!isEditMode && !imageFile) {
        showFormMessage('Please upload an event image', 'error');
        return;
    }
    
    // Disable button
    submitBtn.disabled = true;
    btnText.textContent = isEditMode ? 'Updating...' : 'Creating...';
    formMessage.style.display = 'none';
    
    try {
        let imageUrl = null;
        
        // Upload image if provided
        if (imageFile) {
            imageUrl = await uploadImage(imageFile);
        } else if (isEditMode) {
            // Keep existing image
            const existingEvent = await db.collection('events').doc(currentEditId).get();
            imageUrl = existingEvent.data().image_url;
        }
        
        // Prepare event data
        const eventData = {
            title,
            type,
            status,
            date,
            time,
            location: location || '',
            description,
            image_url: imageUrl
        };
        
        if (isEditMode) {
            // Update existing event
            await db.collection('events').doc(currentEditId).update(eventData);
            showFormMessage('Event updated successfully!', 'success');
        } else {
            // Create new event
            eventData.created_at = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('events').add(eventData);
            showFormMessage('Event created successfully!', 'success');
        }
        
        // Reset form
        resetForm();
        
        // Reload events list
        loadAdminEvents();
        
        // Switch to manage tab after a delay
        setTimeout(() => {
            document.querySelector('[data-tab="manage"]').click();
        }, 1500);
        
    } catch (error) {
        console.error('Error saving event:', error);
        showFormMessage('Error saving event. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        btnText.textContent = isEditMode ? 'Update Event' : 'Create Event';
    }
});

// Upload image to Firebase Storage
async function uploadImage(file) {
    const timestamp = Date.now();
    const fileName = `events/${timestamp}_${file.name}`;
    const storageRef = storage.ref(fileName);
    
    const snapshot = await storageRef.put(file);
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    return downloadURL;
}

// Show form message
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    if (type === 'success') {
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
}

// Reset form
function resetForm() {
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    document.getElementById('currentImagePreview').style.display = 'none';
    document.getElementById('formTitle').textContent = 'Create New Event';
    document.getElementById('btnText').textContent = 'Create Event';
    document.getElementById('cancelBtn').style.display = 'none';
    isEditMode = false;
    currentEditId = null;
}

// Cancel edit
document.getElementById('cancelBtn').addEventListener('click', () => {
    resetForm();
});

// Load events for admin list
async function loadAdminEvents() {
    const loadingState = document.getElementById('adminLoadingState');
    const emptyState = document.getElementById('adminEmptyState');
    const eventsList = document.getElementById('adminEventsList');
    
    loadingState.style.display = 'block';
    emptyState.style.display = 'none';
    eventsList.style.display = 'none';
    
    try {
        const snapshot = await db.collection('events').orderBy('created_at', 'desc').get();
        
        if (snapshot.empty) {
            loadingState.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }
        
        eventsList.innerHTML = '';
        
        snapshot.forEach(doc => {
            const event = { id: doc.id, ...doc.data() };
            const eventItem = createAdminEventItem(event);
            eventsList.appendChild(eventItem);
        });
        
        loadingState.style.display = 'none';
        eventsList.style.display = 'flex';
        
    } catch (error) {
        console.error('Error loading events:', error);
        loadingState.style.display = 'none';
        eventsList.innerHTML = '<p style="color: red; padding: 20px;">Error loading events</p>';
        eventsList.style.display = 'block';
    }
}

// Create admin event item
function createAdminEventItem(event) {
    const item = document.createElement('div');
    item.className = 'admin-event-item';
    
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
    
    item.innerHTML = `
        <img src="${event.image_url}" alt="${event.title}" class="admin-event-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23667eea%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'">
        <div class="admin-event-info">
            <h3 class="admin-event-title">${event.title}</h3>
            <div class="admin-event-meta">
                <span class="event-type ${event.type}">${event.type}</span>
                <span class="event-status ${event.status}">${event.status}</span>
                <span>📅 ${formattedDate}</span>
                <span>🕐 ${event.time}</span>
            </div>
        </div>
        <div class="admin-event-actions">
            <button class="btn-edit" onclick="editEvent('${event.id}')">✏️ Edit</button>
            <button class="btn-delete" onclick="deleteEvent('${event.id}', '${event.title}')">🗑️ Delete</button>
        </div>
    `;
    
    return item;
}

// Edit event
window.editEvent = async function(eventId) {
    try {
        const doc = await db.collection('events').doc(eventId).get();
        
        if (!doc.exists) {
            alert('Event not found');
            return;
        }
        
        const event = doc.data();
        
        // Switch to create tab
        document.querySelector('[data-tab="create"]').click();
        
        // Fill form with event data
        document.getElementById('eventId').value = eventId;
        document.getElementById('eventTitleInput').value = event.title;
        document.getElementById('eventTypeInput').value = event.type;
        document.getElementById('eventStatusInput').value = event.status;
        document.getElementById('eventDateInput').value = event.date;
        document.getElementById('eventTimeInput').value = event.time;
        document.getElementById('eventLocationInput').value = event.location || '';
        document.getElementById('eventDescriptionInput').value = event.description;
        
        // Show current image
        if (event.image_url) {
            document.getElementById('currentImage').src = event.image_url;
            document.getElementById('currentImagePreview').style.display = 'block';
        }
        
        // Update form UI
        document.getElementById('formTitle').textContent = 'Edit Event';
        document.getElementById('btnText').textContent = 'Update Event';
        document.getElementById('cancelBtn').style.display = 'inline-block';
        
        isEditMode = true;
        currentEditId = eventId;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error loading event for edit:', error);
        alert('Error loading event. Please try again.');
    }
};

// Delete event
window.deleteEvent = async function(eventId, eventTitle) {
    if (!confirm(`Are you sure you want to delete "${eventTitle}"?\n\nThis action cannot be undone.`)) {
        return;
    }
    
    try {
        // Delete from Firestore
        await db.collection('events').doc(eventId).delete();
        
        // Reload events list
        loadAdminEvents();
        
        alert('Event deleted successfully');
        
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFirebase();
});
