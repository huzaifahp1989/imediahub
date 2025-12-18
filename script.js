// ==============================
// ISLAMIC UTILITY HUB - MAIN SCRIPT
// ==============================

// Islamic Reminders Data
const islamicReminders = [
    {
        text: "The best of deeds are those done consistently, even if small.",
        source: "Sahih Bukhari & Sahih Muslim"
    },
    {
        text: "Whoever fears Allah – He will make for him a way out.",
        source: "Qur'an 65:2"
    },
    {
        text: "Time is life; if it passes, a part of you is gone.",
        source: "Hasan al-Basri (rahimahullah)"
    },
    {
        text: "The most beloved deed to Allah is the most regular and constant even if it were little.",
        source: "Sahih Bukhari"
    },
    {
        text: "When Allah desires good for someone, He tries him with hardships.",
        source: "Sahih Bukhari"
    },
    {
        text: "And whoever puts his trust in Allah, then He will suffice him.",
        source: "Qur'an 65:3"
    },
    {
        text: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.",
        source: "Sahih Bukhari & Sahih Muslim"
    },
    {
        text: "Verily, with hardship comes ease.",
        source: "Qur'an 94:6"
    },
    {
        text: "Remember Me, and I will remember you.",
        source: "Qur'an 2:152"
    },
    {
        text: "The believer who mixes with people and bears their annoyance with patience will have a greater reward than the believer who does not mix with people.",
        source: "Ibn Majah"
    }
];

// Display Random Reminder
function displayReminder() {
    const reminderCard = document.getElementById('reminderCard');
    if (!reminderCard) return;

    const randomIndex = Math.floor(Math.random() * islamicReminders.length);
    const reminder = islamicReminders[randomIndex];

    document.getElementById('reminderText').textContent = `"${reminder.text}"`;
    document.getElementById('reminderSource').textContent = `— ${reminder.source}`;
}

// Mobile Navigation Toggle
function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Display reminder if on home page
    displayReminder();

    // Initialize mobile navigation
    initMobileNav();

    // Rotate reminder every 10 seconds on home page
    if (document.getElementById('reminderCard')) {
        setInterval(displayReminder, 10000);
    }
});

// Scroll to Top Button (Optional)
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    }
});
