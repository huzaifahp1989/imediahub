// ==============================
// CONFIGURATION FILE
// ==============================

// OpenAI API Configuration
// Get your API key from: https://platform.openai.com/api-keys
const CONFIG = {
    // OpenAI API Key for AI Islamic Q&A
    // IMPORTANT: Replace with your actual API key
    OPENAI_API_KEY: 'your-openai-api-key-here',
    
    // OpenAI Model Selection
    OPENAI_MODEL: 'gpt-4', // Options: 'gpt-4', 'gpt-3.5-turbo'
    
    // Default Settings
    DEFAULT_CITY: 'Leicester',
    DEFAULT_ASR_METHOD: 1, // 0 = Standard, 1 = Hanafi
    DEFAULT_CALCULATION_METHOD: 3, // 3 = Muslim World League
    
    // Mosque Times (Leicester)
    MOSQUE_ADJUSTMENTS: {
        'masjid-umar': {
            name: 'Masjid Umar (Green Lane)',
            // Time adjustments in minutes from calculated prayer time
            Fajr: 0,
            Dhuhr: +5,
            Asr: +5,
            Maghrib: +3,
            Isha: +5
        },
        'jame-masjid': {
            name: 'Jame Masjid (Conduit Street)',
            Fajr: 0,
            Dhuhr: +5,
            Asr: +5,
            Maghrib: +3,
            Isha: +5
        },
        'madinah-masjid': {
            name: 'Madinah Masjid (Evington)',
            Fajr: 0,
            Dhuhr: +5,
            Asr: +5,
            Maghrib: +3,
            Isha: +5
        },
        'central-masjid': {
            name: 'Central Mosque (Melbourne Road)',
            Fajr: 0,
            Dhuhr: +5,
            Asr: +5,
            Maghrib: +3,
            Isha: +5
        },
        'abu-bakr': {
            name: 'Abu Bakr Mosque (Queens Road)',
            Fajr: 0,
            Dhuhr: +5,
            Asr: +5,
            Maghrib: +3,
            Isha: +5
        },
        'umar-masjid': {
            name: 'Umar Masjid (East Park Road)',
            Fajr: 0,
            Dhuhr: +5,
            Asr: +5,
            Maghrib: +3,
            Isha: +5
        }
    }
};

// Firebase Configuration
// Get your Firebase config from: https://console.firebase.google.com/
const FIREBASE_CONFIG = {
    apiKey: "your-firebase-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
