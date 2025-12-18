# Islamic Utility Hub

A clean, professional Islamic utilities website providing authentic Islamic knowledge and practical tools for Muslims worldwide.

## Features

### 🏠 Home Page
- Hero section with inspiring message
- Rotating Islamic reminders with authentic sources
- Quick access cards to all tools

### 🧮 Zakat Calculator
- Calculate Zakat obligation based on gold, silver, cash, and business assets
- Automatic Nisab threshold calculation
- Clear explanations about who must pay Zakat and when
- Support for both gold and silver Nisab

### 🕋 Salah Times
- Accurate UK prayer times using Aladhan API
- Auto-location detection or manual city selection
- Multiple calculation methods (ISNA, MWL, Umm Al-Qura, etc.)
- Hanafi and Standard Asr calculation options
- Current prayer highlighting
- Next prayer countdown

### ✈️ Umrah Guide
- Complete step-by-step guide for performing Umrah
- Detailed instructions for:
  - Preparation and entering Ihram
  - Miqat rules
  - Tawaf procedure
  - Sa'i between Safa and Marwah
  - Halq/Qasr (hair cutting)
- Arabic duas with English translations
- Common mistakes to avoid
- Recommended supplications

### 🤖 AI Islamic Q&A
- Interface for Islamic questions and answers
- Strict guidelines for authentic sources only
- Placeholder for AI integration (ready for OpenAI/Claude API)
- Topics covered: Qur'an, Hadith, Fiqh, Seerah, Islamic manners

## Design

- **Color Theme**: Gradient background from Dark Blue (#0A1F44) to Light Blue (#1E88E5)
- **Mobile-First**: Fully responsive design
- **No Non-Islamic Images**: Only geometric patterns and Islamic-appropriate design elements
- **Accessible**: High contrast, clear fonts, easy navigation

## Technology Stack

- **HTML5**: Semantic, accessible markup
- **CSS3**: Modern styling with gradients, flexbox, and grid
- **Vanilla JavaScript**: No framework dependencies
- **Aladhan API**: Accurate prayer times
- **Firebase Hosting**: Fast, secure hosting with clean URLs

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)

### Local Development

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. For local testing with live server:
   ```bash
   npx serve .
   ```

### Firebase Deployment

1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase (if needed):
   ```bash
   firebase init hosting
   ```
   - Select "Use an existing project" or create new
   - Set public directory as `.` (current directory)
   - Configure as single-page app: No
   - Don't overwrite existing files

3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

4. Your site will be live at: `https://your-project-id.web.app`

## Project Structure

```
islamic-utility-hub/
├── index.html              # Home page
├── zakat.html             # Zakat calculator
├── salah-times.html       # Prayer times
├── umrah-guide.html       # Umrah guide
├── ai-qa.html             # AI Q&A interface
├── styles.css             # Global styles
├── script.js              # Main JavaScript
├── salah-times.js         # Prayer times API integration
├── firebase.json          # Firebase hosting config
├── .firebaserc           # Firebase project config
└── README.md             # This file
```

## API Integration

### Aladhan Prayer Times API

The Salah Times page uses the [Aladhan API](https://aladhan.com/prayer-times-api) for accurate prayer times.

**Endpoints used:**
- By City: `https://api.aladhan.com/v1/timingsByCity`
- By Coordinates: `https://api.aladhan.com/v1/timings`

**Parameters:**
- `method`: Calculation method (1-7)
- `school`: Asr calculation (0=Standard, 1=Hanafi)

### AI Integration (Placeholder)

The AI Q&A page is currently a demo interface. To connect to a real AI:

1. Sign up for OpenAI API or Anthropic Claude API
2. Create a system prompt with strict Islamic guidelines
3. Add API call in `ai-qa.html` askQuestion() function
4. Parse and display structured responses

**Example System Prompt:**
```
You are an Islamic knowledge assistant. You must:
- Always provide references (Qur'an Surah:Ayah, Hadith collection & number)
- Never give personal opinions
- Never invent or misquote Hadith
- Label all sources clearly (Qur'an, Sahih Bukhari, Ibn Kathir, etc.)
- State "Allah knows best" if unsure
- Recommend consulting scholars for complex matters
```

## Future Enhancements

- 🗓️ Hijri Calendar converter
- 📝 Hadith of the Day
- 🎯 Islamic Quiz
- 👶 Kids Section with Islamic stories
- 💰 Donation links to verified charities
- 📱 Progressive Web App (PWA) support
- 🔔 Prayer time notifications
- 📍 Qibla direction finder

## Content Sources

All Islamic content is based on:
- **Qur'an**: The final revelation from Allah
- **Authentic Hadith**: Sahih Bukhari, Sahih Muslim, Sunan collections
- **Classical Scholars**: Ibn Kathir, Nawawi, Ibn Hajar, and others
- **Verified Websites**: IslamQA, SeekersGuidance, etc.

## Disclaimer

This website provides general Islamic guidance. For specific matters, personal circumstances, or religious rulings (fatwa), please consult qualified Islamic scholars. Different schools of Islamic jurisprudence may have varying opinions on certain matters.

## Contributing

This is an open project. Contributions are welcome:
- Report bugs or suggest features
- Improve existing content with authentic sources
- Enhance UI/UX design
- Add new Islamic tools

## License

This project is created for the benefit of the Muslim community. You are free to use, modify, and distribute it for non-commercial purposes.

## Contact

For questions, suggestions, or corrections, please reach out through the website.

---

**May Allah accept this effort and make it beneficial for Muslims worldwide. Ameen.**

*"The best of people are those who bring most benefit to others." - Hadith*
