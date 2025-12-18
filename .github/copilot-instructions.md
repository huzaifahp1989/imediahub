# Islamic Utility Hub - Workspace Instructions

## Project Overview
This is a complete Islamic utilities website with authentic sources and modern design. It includes:
- Zakat Calculator (fully functional)
- Salah Times (Aladhan API integrated for UK)
- Umrah Guide (complete step-by-step)
- AI Islamic Q&A (interface ready, needs AI API)
- Home page with rotating Islamic reminders

## Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Hosting**: Firebase Hosting
- **API**: Aladhan Prayer Times API
- **Design**: Blue gradient theme (#0A1F44 to #1E88E5)
- **Responsive**: Mobile-first design

## Project Structure Completed ✅

### HTML Pages (5 total)
- ✅ index.html - Home page with reminders and quick access
- ✅ zakat.html - Zakat calculator with full functionality
- ✅ salah-times.html - Prayer times with API integration
- ✅ umrah-guide.html - Complete Umrah guide with duas
- ✅ ai-qa.html - AI Q&A interface (demo mode)

### Styling & Scripts
- ✅ styles.css - Complete styling with blue gradient theme
- ✅ script.js - Navigation and Islamic reminders rotation
- ✅ salah-times.js - Aladhan API integration for prayer times

### Configuration Files
- ✅ firebase.json - Firebase hosting configuration
- ✅ .firebaserc - Firebase project settings
- ✅ package.json - npm configuration
- ✅ .gitignore - Git ignore rules

### Documentation
- ✅ README.md - Full project documentation
- ✅ DEPLOYMENT.md - Firebase deployment guide
- ✅ QUICKSTART.md - Quick start instructions
- ✅ AI_SYSTEM_PROMPT.md - AI integration system prompt

## Key Features Implemented

### 1. Zakat Calculator ✅
- Gold/Silver input with price per gram
- Cash and business assets
- Debts deduction
- Auto Nisab calculation (87.48g gold, 612.36g silver)
- 2.5% Zakat calculation
- Educational information
- Clear disclaimer

### 2. Salah Times (API Integrated) ✅
- Aladhan API integration
- Auto-location detection (geolocation)
- Manual UK city selection (13 cities)
- Multiple calculation methods (ISNA, MWL, Umm Al-Qura, etc.)
- Hanafi/Standard Asr options
- Current prayer highlighting
- Next prayer countdown
- Real-time updates

### 3. Umrah Guide ✅
- Step-by-step instructions (5 main steps)
- Ihram preparation and rules
- Miqat information
- Tawaf procedure (7 circuits)
- Sa'i between Safa and Marwah
- Halq/Qasr completion
- Arabic duas with English translations
- Common mistakes to avoid
- Recommended supplications

### 4. AI Q&A Interface ✅
- Prominent display of Islamic authenticity rules
- Large question input area
- Example questions
- Answer display sections (Answer, References, Notes)
- Demo mode active
- Ready for AI API integration
- Comprehensive system prompt provided

### 5. Design & UX ✅
- Blue gradient background (#0A1F44 → #1E88E5)
- Sticky navigation with mobile hamburger menu
- Responsive design (mobile, tablet, desktop)
- No non-Islamic images (pure CSS design)
- High contrast accessibility
- Smooth animations and transitions
- Card-based layout
- Clear visual hierarchy

## Testing Instructions

### Local Testing
1. Open `index.html` in browser (works immediately)
2. Or use: `npm start` (serves on localhost)

### Feature Testing
- **Zakat**: Enter values and verify 2.5% calculation
- **Salah Times**: Check London times load automatically
- **Navigation**: Test all page links and mobile menu
- **Responsive**: Use DevTools device toolbar (F12)

## Firebase Deployment

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy
firebase deploy
```

See DEPLOYMENT.md for detailed instructions.

## Future Enhancements

### Immediate Priorities
1. **AI Integration**: Connect OpenAI/Claude API to ai-qa.html
2. **Custom Domain**: Add custom domain in Firebase Console
3. **Analytics**: Add Firebase Analytics for usage tracking

### Future Features
- Hijri calendar converter
- Hadith of the Day
- Islamic quiz
- Kids section
- Qibla direction finder
- Prayer time notifications (PWA)
- Multi-language support

## Development Guidelines

### Code Standards
- Use semantic HTML5
- Keep CSS organized by sections
- Comment complex JavaScript logic
- Maintain accessibility standards
- Test on multiple browsers

### Islamic Content Guidelines
- ✅ Always cite sources (Qur'an, Hadith, Scholars)
- ✅ Use authentic references only
- ✅ Avoid personal opinions
- ✅ Include disclaimers for complex matters
- ✅ Respect different schools of thought (madhabs)

### Design Principles
- Mobile-first approach
- Islamic-appropriate imagery only (geometric patterns, abstract)
- Blue gradient theme throughout
- High contrast for readability
- Smooth, professional interactions

## Key Files Reference

### Main Pages
- `index.html` - Home page (reminders rotate every 10s)
- `zakat.html` - Zakat calculator (inline JS for calculations)
- `salah-times.html` - Prayer times (uses salah-times.js)
- `umrah-guide.html` - Umrah guide (pure content)
- `ai-qa.html` - AI Q&A (demo mode, inline JS)

### Styling
- `styles.css` - ALL styling in one file
  - Navigation styles (responsive)
  - Card styles
  - Form styles
  - Prayer time grid
  - Arabic text styling
  - Responsive breakpoints

### Scripts
- `script.js` - Navigation and reminders
  - Mobile menu toggle
  - Reminder rotation
  - Navbar shadow on scroll
- `salah-times.js` - Aladhan API integration
  - fetchPrayerTimes()
  - displayPrayerTimes()
  - highlightCurrentPrayer()
  - updateNextPrayerInfo()

### Configuration
- `firebase.json` - Hosting config with rewrites
- `.firebaserc` - Project name
- `package.json` - npm scripts

## API Usage

### Aladhan Prayer Times API
- **Base URL**: https://api.aladhan.com/v1/
- **Endpoints Used**:
  - `/timingsByCity` - Get times by city name
  - `/timings` - Get times by coordinates
- **Parameters**:
  - `method`: Calculation method (1-7)
  - `school`: Asr calculation (0=Standard, 1=Hanafi)
- **Rate Limits**: No authentication required, free to use

## Troubleshooting

### Common Issues
1. **Prayer times not loading**: Check internet connection and Aladhan API status
2. **CORS errors**: Use local server (not file://)
3. **Mobile menu not working**: Check script.js is loaded
4. **Styles not applying**: Clear browser cache

### Browser Console
Press F12 to open DevTools and check Console tab for errors.

## Project Status

✅ **Phase 1: Complete** - All core features implemented
✅ **Phase 2: Complete** - Salah Times API integrated
✅ **Phase 3: Complete** - Full documentation
🔄 **Phase 4: Pending** - AI API integration (optional)
🔄 **Phase 5: Pending** - Firebase deployment (user action)

## Notes

- All HTML pages are complete and functional
- Salah Times uses live Aladhan API (works immediately)
- Zakat Calculator is fully functional (no API needed)
- AI Q&A is interface only (needs API key for full function)
- Mobile responsive tested at 320px, 768px, 1024px, 1440px
- No external dependencies (pure vanilla JS)
- Firebase ready (just needs deployment)

---

**Project is 100% complete and ready to use/deploy!**

May Allah accept this effort and make it beneficial. Ameen.
