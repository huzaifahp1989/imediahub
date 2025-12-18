# 🔑 API Key Setup Guide

## Quick Setup - Add Your OpenAI API Key

### Option 1: Direct Edit (Easiest)

1. **Open `ai-qa.html`** in a text editor
2. **Find line 189** (search for: `const OPENAI_API_KEY`)
3. **Replace** `'your-openai-api-key-here'` with your actual API key
4. **Save** the file

Example:
```javascript
// Change this:
const OPENAI_API_KEY = 'your-openai-api-key-here';

// To this:
const OPENAI_API_KEY = 'sk-proj-abc123...'; // Your actual key
```

### Option 2: Use Config File (Recommended)

1. **Open `config.js`**
2. **Update line 9**:
```javascript
OPENAI_API_KEY: 'sk-proj-abc123...', // Your actual key
```
3. **Add this line** to the `<head>` section of `ai-qa.html` (before other scripts):
```html
<script src="config.js"></script>
```
4. **Update** the API key reference in ai-qa.html:
```javascript
const OPENAI_API_KEY = CONFIG.OPENAI_API_KEY;
```

---

## Getting Your OpenAI API Key

### Step 1: Create OpenAI Account
1. Go to: https://platform.openai.com/signup
2. Sign up with email or Google account
3. Verify your email

### Step 2: Get API Key
1. Log in to: https://platform.openai.com/
2. Click your profile icon (top right)
3. Select **"API keys"** or go to: https://platform.openai.com/api-keys
4. Click **"+ Create new secret key"**
5. Name it: "Islamic Utility Hub"
6. **Copy the key immediately** (you won't see it again!)

### Step 3: Add Billing (Required)
1. Go to: https://platform.openai.com/account/billing
2. Add payment method
3. Set spending limit (recommended: $10-20/month)

**Note:** OpenAI charges per use:
- GPT-4: ~$0.03 per question
- GPT-3.5-turbo: ~$0.002 per question

---

## Testing the Integration

1. **Open** `ai-qa.html` in your browser
2. **Type a test question**: "What are the 5 pillars of Islam?"
3. **Click** "Ask Question"
4. **Wait** for AI response (5-10 seconds)

### If It Works ✅
You'll see a structured answer with:
- Main response
- References (Qur'an, Hadith)
- Notes

### If You Get an Error ❌

**Error: "API key not configured"**
- You haven't replaced the placeholder API key
- Solution: Follow Option 1 or 2 above

**Error: "API Error: 401 Unauthorized"**
- Your API key is incorrect or invalid
- Solution: Generate a new key from OpenAI Platform

**Error: "API Error: 429 Too Many Requests"**
- You've exceeded rate limits or have no credits
- Solution: Add billing or wait for rate limit reset

**Error: "API Error: 500"**
- OpenAI server issue
- Solution: Wait a few minutes and try again

---

## Security Best Practices

### ⚠️ Important Security Notes

**For Testing Only:**
The current setup with API key in frontend is for testing only. For production:

### Production Security Options:

#### Option A: Backend Proxy (Recommended)
```javascript
// Instead of calling OpenAI directly, call your backend
const response = await fetch('/api/ask-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
});
// Backend handles OpenAI API call with stored key
```

#### Option B: Firebase Cloud Functions
1. Create Firebase Cloud Function
2. Store API key in Firebase environment variables
3. Call function from frontend

#### Option C: Environment Variables (Build Time)
Use build tools to inject API key at build time, not in source code.

---

## Mosque Times Configuration

Leicester mosque times are now configured with adjustments!

### Current Mosques:
- ✅ Masjid Umar (Green Lane)
- ✅ Jame Masjid (Conduit Street)
- ✅ Madinah Masjid (Evington)
- ✅ Central Mosque (Melbourne Road)
- ✅ Abu Bakr Mosque (Queens Road)
- ✅ Umar Masjid (East Park Road)

### To Update Mosque Times:

**Edit `config.js`** or **`salah-times.js`** (line 5-45):

```javascript
'masjid-umar': {
    name: 'Masjid Umar (Green Lane)',
    adjustments: {
        Fajr: 0,     // No adjustment
        Dhuhr: +5,   // 5 minutes after calculated time
        Asr: +5,     // 5 minutes after calculated time
        Maghrib: +3, // 3 minutes after calculated time
        Isha: +5     // 5 minutes after calculated time
    }
}
```

**Adjustment Examples:**
- `+5` = 5 minutes after Aladhan time
- `-5` = 5 minutes before Aladhan time
- `0` = Use Aladhan time exactly

---

## Defaults Now Set ✅

### Salah Times Defaults:
- **City**: Leicester (changed from London)
- **Asr Method**: Hanafi (changed from Standard)
- **Calculation Method**: Muslim World League
- **Mosque Selector**: Visible for Leicester

### To Change Defaults:
Edit `config.js`:
```javascript
DEFAULT_CITY: 'Leicester',
DEFAULT_ASR_METHOD: 1, // 1 = Hanafi, 0 = Standard
DEFAULT_CALCULATION_METHOD: 3, // 3 = MWL
```

---

## Cost Estimates

### OpenAI API Costs:

**GPT-4:**
- ~$0.03 per question (1000 tokens)
- 100 questions = ~$3.00
- 1000 questions = ~$30.00

**GPT-3.5-turbo (Cheaper):**
- ~$0.002 per question
- 100 questions = ~$0.20
- 1000 questions = ~$2.00

### To Use GPT-3.5 Instead:
In `ai-qa.html`, change line 190:
```javascript
model: 'gpt-3.5-turbo', // Changed from 'gpt-4'
```

---

## Troubleshooting

### Q: Where exactly do I put my API key?
**A:** Open `ai-qa.html` in a text editor, find line 189, replace the placeholder text.

### Q: How do I know if it's working?
**A:** Open `ai-qa.html` in browser, ask a question. If you get an answer with references, it's working!

### Q: Can I use this without paying?
**A:** No, OpenAI requires billing info. But GPT-3.5-turbo is very cheap (~$0.002 per question).

### Q: Is my API key secure?
**A:** Current setup is for testing. For production, use backend proxy (see Security section above).

### Q: How do I add more mosques?
**A:** Edit `config.js` or `salah-times.js`, add new mosque object with name and time adjustments.

### Q: Can I use a different AI service?
**A:** Yes! You can replace OpenAI with Anthropic Claude, Google Gemini, etc. The system prompt is designed to work with any AI.

---

## Quick Commands

### Test locally:
```bash
cd "C:\Users\huzai\Imedia hub\islamic-utility-hub"
npx serve .
```

### Deploy to Firebase:
```bash
firebase deploy
```

### Check API usage:
https://platform.openai.com/usage

---

## Need Help?

1. **API Key Issues**: https://platform.openai.com/docs/api-reference/authentication
2. **Rate Limits**: https://platform.openai.com/docs/guides/rate-limits
3. **Billing**: https://platform.openai.com/account/billing
4. **OpenAI Status**: https://status.openai.com/

---

**Your Islamic Utility Hub is now ready with:**
✅ OpenAI API integration (add your key)
✅ Leicester as default city
✅ Hanafi madhab default
✅ Leicester mosque times
✅ Full functionality!

**May Allah accept this effort. Ameen! 🤲**
