# Firebase Setup Guide

Your calorie tracking app has been updated to use Firebase for cloud data storage! Follow these steps to set up Firebase and start using cloud sync.

## 🔥 Firebase Setup Steps

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "my-calorie-tracker")
4. Follow the setup wizard (you can disable Google Analytics if you prefer)

### 2. Enable Firestore Database

1. In your Firebase project, go to **Build** > **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for now)
4. Select a location close to your users
5. Click "Done"

### 3. Enable Authentication

1. Go to **Build** > **Authentication**
2. Click "Get started"
3. Go to the **Sign-in method** tab
4. Enable **Anonymous** authentication
5. Click "Save"

### 4. Get Your Firebase Configuration

1. Go to **Project settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 5. Add Environment Variables

Create a `.env.local` file in your project root with your Firebase config:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012
```

Replace the placeholder values with your actual Firebase configuration values.

### 6. Update Firestore Security Rules (Optional but Recommended)

For better security, update your Firestore rules:

1. Go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /calorieData/{userId}_{document=**} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

3. Click "Publish"

## ✨ Features Enabled

With Firebase integration, you now have:

- **☁️ Cloud Storage**: Your data is safely stored in the cloud
- **🔄 Real-time Sync**: Data updates instantly across devices
- **📱 Cross-device Access**: Access your data from anywhere
- **🔒 Secure**: Anonymous authentication keeps your data private
- **💾 Automatic Backup**: Never lose your calorie tracking data

## 🚀 How It Works

1. **Anonymous Login**: The app automatically creates an anonymous user account
2. **Data Sync**: All your calorie goals and daily entries are saved to Firebase
3. **Real-time Updates**: Changes are immediately synced to the cloud
4. **Offline Support**: The app works offline and syncs when you're back online

## 🔧 Troubleshooting

### Connection Errors
- Check your internet connection
- Verify your Firebase configuration in `.env.local`
- Make sure Firestore is enabled in your Firebase project

### Authentication Issues  
- Ensure Anonymous authentication is enabled
- Check browser console for detailed error messages

### Data Not Saving
- Verify Firestore security rules allow your operations
- Check the browser network tab for failed requests

## 📱 Migration from localStorage

Your existing localStorage data will continue to work, but new data will be saved to Firebase. The old localStorage data won't be automatically migrated - you'll need to re-enter any existing data or manually export/import it.

## 🎯 Next Steps

- Your app is now ready to use with Firebase!
- Start tracking calories and they'll be automatically saved to the cloud
- You can access your data from any device by using the same Firebase project

---

**Need Help?** Check the [Firebase Documentation](https://firebase.google.com/docs) or the browser developer console for detailed error messages.
