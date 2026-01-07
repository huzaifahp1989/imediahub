# 🚀 QUICK START GUIDE - Events System

## ⚡ 5-Minute Setup

### Step 1: Firebase Setup (2 minutes)

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click "Add project" → Name it → Continue → Disable Google Analytics (optional) → Create project
3. Click "Continue" when ready

### Step 2: Enable Services (2 minutes)

**Firestore:**
- Left menu → Firestore Database → Create database
- Choose "Start in test mode" → Next
- Select location (closest to you) → Enable

**Storage:**
- Left menu → Storage → Get started
- Choose "Start in test mode" → Done

**Authentication:**
- Left menu → Authentication → Get started
- Click "Email/Password" → Enable → Save

### Step 3: Get Config (30 seconds)

1. Click gear icon ⚙️ → Project settings
2. Scroll down → Click web icon `</>`
3. Register app → Copy the config object
4. Open `config.js` in your project
5. Replace the `FIREBASE_CONFIG` values

### Step 4: Create Admin (30 seconds)

1. Firebase Console → Authentication → Users
2. Click "Add user"
3. Email: `your-email@domain.com`
4. Password: Create strong password
5. Click "Add user"

### Step 5: Test Locally (30 seconds)

```bash
# Open your project in browser
python -m http.server 8000
```

Navigate to: `http://localhost:8000/admin-events.html`
Login with your admin credentials

---

## ✅ You're Done!

Now you can:
1. ✅ Create events from admin panel
2. ✅ View events on frontend
3. ✅ Share events with your community

---

## 📱 Access Points

- **Public Events Page:** `yourdomain.com/events.html`
- **Admin Panel:** `yourdomain.com/admin-events.html`
- **Event Details:** `yourdomain.com/event-details.html?id=EVENT_ID`

---

## 🆘 Need Help?

**Common Issues:**

**Can't login?**
- Check admin user exists in Firebase Authentication
- Verify email/password are correct

**No events showing?**
- Create your first event in admin panel
- Check browser console for errors

**Images not uploading?**
- Ensure Firebase Storage is enabled
- Check file size is under 5MB

---

## 🎯 First Event

Create your first event:
1. Login to admin panel
2. Fill in event details
3. Upload an image
4. Click "Create Event"
5. Check the events page!

---

**That's it! Your Events System is ready to use! 🎉**
