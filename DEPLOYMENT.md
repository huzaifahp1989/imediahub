# Firebase Deployment Guide for Islamic Utility Hub

## Quick Start

### Option 1: Test Locally First

1. **Open the website directly**
   - Simply double-click `index.html` to open in your browser
   - Or right-click → Open with → Your preferred browser

2. **Use a local server (recommended for testing)**
   ```bash
   # Using Python (if installed)
   python -m http.server 8000
   
   # Or using Node.js
   npx serve .
   
   # Then open: http://localhost:8000
   ```

### Option 2: Deploy to Firebase Hosting

#### Step 1: Install Firebase CLI

```bash
npm install -g firebase-tools
```

#### Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for you to sign in with your Google account.

#### Step 3: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `islamic-utility-hub` (or your preferred name)
4. Disable Google Analytics (not needed for static hosting)
5. Click "Create project"

#### Step 4: Initialize Firebase in Your Project

```bash
# Navigate to project directory
cd "C:\Users\huzai\Imedia hub\islamic-utility-hub"

# Initialize Firebase
firebase init hosting
```

When prompted:
- **Existing project or new**: Select your project from the list
- **Public directory**: Type `.` (current directory)
- **Single-page app**: Select **No**
- **Overwrite files**: Select **No** for all

#### Step 5: Deploy to Firebase

```bash
firebase deploy
```

Your website will be live at: `https://your-project-id.web.app`

## Updating Your Website

After making changes to any files:

```bash
firebase deploy
```

## Testing Before Deployment

```bash
# Test locally with Firebase hosting behavior
firebase serve

# Opens at: http://localhost:5000
```

## Custom Domain (Optional)

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the instructions to:
   - Add domain
   - Verify ownership
   - Update DNS records

## Troubleshooting

### Issue: `firebase: command not found`
**Solution**: Install Firebase CLI globally
```bash
npm install -g firebase-tools
```

### Issue: Permission denied
**Solution**: Run with admin/sudo
```bash
# Windows (run PowerShell as Administrator)
npm install -g firebase-tools

# Mac/Linux
sudo npm install -g firebase-tools
```

### Issue: Cannot find module 'firebase-tools'
**Solution**: Clear npm cache and reinstall
```bash
npm cache clean --force
npm install -g firebase-tools
```

### Issue: Prayer times not loading
**Check**:
- Internet connection
- Browser console for errors (F12 → Console tab)
- Aladhan API status at https://aladhan.com/

### Issue: CORS errors in local testing
**Solution**: Use a local server instead of file:// protocol
```bash
npx serve .
```

## Project Files Overview

```
islamic-utility-hub/
├── index.html              # Home page with reminders
├── zakat.html             # Zakat calculator (fully functional)
├── salah-times.html       # Prayer times with Aladhan API
├── umrah-guide.html       # Complete Umrah guide
├── ai-qa.html             # AI Q&A interface (demo)
├── styles.css             # All styling with blue gradient theme
├── script.js              # Navigation and reminders rotation
├── salah-times.js         # Aladhan API integration
├── firebase.json          # Firebase hosting configuration
├── .firebaserc           # Firebase project settings
├── .gitignore            # Files to ignore in git
└── README.md             # Full documentation
```

## Features Verification Checklist

- ✅ **Home Page**: Rotating Islamic reminders every 10 seconds
- ✅ **Navigation**: Sticky navbar with mobile hamburger menu
- ✅ **Zakat Calculator**: Full calculation with Nisab thresholds
- ✅ **Salah Times**: Real-time UK prayer times via Aladhan API
- ✅ **Umrah Guide**: Complete step-by-step with Arabic duas
- ✅ **AI Q&A**: Interface ready (needs AI API integration)
- ✅ **Responsive**: Works on mobile, tablet, and desktop
- ✅ **Theme**: Blue gradient (#0A1F44 to #1E88E5)
- ✅ **No Images**: Pure CSS design, Islamic-appropriate

## Next Steps for AI Integration

The AI Q&A page is currently a demo. To make it functional:

1. **Sign up for an AI API**:
   - [OpenAI Platform](https://platform.openai.com/)
   - [Anthropic Claude](https://console.anthropic.com/)

2. **Get API Key**

3. **Add API call in ai-qa.html**:
   ```javascript
   // Replace the displayDemoAnswer function with:
   async function askQuestion() {
       const question = document.getElementById('questionInput').value.trim();
       
       const response = await fetch('https://api.openai.com/v1/chat/completions', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer YOUR_API_KEY'
           },
           body: JSON.stringify({
               model: 'gpt-4',
               messages: [
                   {
                       role: 'system',
                       content: 'You are an Islamic knowledge assistant...'
                   },
                   {
                       role: 'user',
                       content: question
                   }
               ]
           })
       });
       
       const data = await response.json();
       // Parse and display response
   }
   ```

4. **Security Note**: Never expose API keys in frontend code. Use:
   - Firebase Cloud Functions
   - Backend proxy server
   - Environment variables with build process

## Support

For issues or questions:
1. Check README.md for detailed documentation
2. Review Firebase Hosting docs: https://firebase.google.com/docs/hosting
3. Aladhan API docs: https://aladhan.com/prayer-times-api

---

**May Allah make this project beneficial. Ameen.**
