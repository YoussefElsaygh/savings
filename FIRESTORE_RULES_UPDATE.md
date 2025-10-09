# Firestore Security Rules Update Guide

## What Changed

We've added a new collection called `dataRegistry` that needs to be accessible to authenticated users. This collection stores timestamps for cache invalidation.

## How to Update Rules

### Option 1: Firebase Console (Recommended for Quick Updates)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `savings-b9cfc`
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab
5. Copy and paste the contents of `firestore.rules` into the editor
6. Click **Publish**

### Option 2: Firebase CLI

If you have Firebase CLI installed:

```bash
# Make sure you're in the project directory
cd /Users/youssef.elsaygh/Desktop/savings

# Login to Firebase (if not already logged in)
firebase login

# Initialize Firebase (if not already initialized)
firebase init firestore

# Deploy the rules
firebase deploy --only firestore:rules
```

## Rules Summary

### Collections and Access Control

#### 1. `savingsData` Collection

- **Document ID Format**: `{userId}_savings` or `{userId}_rateHistory`
- **Access**: Users can only read/write their own documents
- **Example**: `abc123_savings` (user abc123's savings data)

#### 2. `calorieData` Collection

- **Document ID Format**: `{userId}_goal` or `{userId}_dailyData`
- **Access**: Users can only read/write their own documents
- **Example**: `abc123_goal` (user abc123's calorie goal)

#### 3. `dataRegistry` Collection (NEW!)

- **Document ID Format**: `{userId}`
- **Access**: Users can only read/write their own registry document
- **Example**: `abc123` (user abc123's data registry)
- **Purpose**: Stores last updated timestamps for cache invalidation

### Security Features

✅ **Authentication Required**: All operations require user to be signed in
✅ **User Isolation**: Users can only access their own data
✅ **Default Deny**: All other paths are denied by default

## Testing the Rules

### Test in Firebase Console

1. Go to Firestore Database → Rules tab
2. Click on **Rules Playground**
3. Test scenarios:

**Test 1: User can read their own registry**

```
Location: /dataRegistry/USER_ID
Authenticated as: USER_ID
Operation: get
Result: Should be ALLOWED ✅
```

**Test 2: User cannot read another user's registry**

```
Location: /dataRegistry/OTHER_USER_ID
Authenticated as: USER_ID
Operation: get
Result: Should be DENIED ❌
```

**Test 3: Unauthenticated user cannot access anything**

```
Location: /dataRegistry/USER_ID
Authenticated as: (none)
Operation: get
Result: Should be DENIED ❌
```

## Verification

After deploying, verify the rules are working:

1. Sign in to your app
2. Open browser console
3. Run: `await window.__cacheDebug.logCacheStatus('your-user-id')`
4. Check for any permission errors in the console

If you see errors like:

- `"Missing or insufficient permissions"` → Rules not deployed correctly
- `"PERMISSION_DENIED"` → Check user authentication status

## Rollback

If you need to rollback to previous rules:

1. Go to Firebase Console → Firestore Database → Rules
2. Click on **History** tab
3. Select a previous version
4. Click **Restore**

## Important Notes

⚠️ **Do NOT** modify the rules to allow public access
⚠️ **Always** test rules in the playground before deploying to production
✅ Rules are deployed instantly (no app restart needed)
✅ Changes apply to all users immediately

## Common Issues

### Issue: "Permission Denied" errors after deployment

**Solution**:

- Clear browser cache and localStorage
- Sign out and sign in again
- Verify user is authenticated: `firebase.auth().currentUser`

### Issue: Rules don't seem to take effect

**Solution**:

- Wait 1-2 minutes for propagation
- Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
- Check Firebase Console to confirm rules were published

### Issue: Can't access dataRegistry

**Solution**:

- Verify the document ID matches the user ID exactly
- Check that the user is authenticated
- Review the rules in Firebase Console

## Need Help?

If you encounter issues:

1. Check the Firebase Console → Firestore → Usage tab for errors
2. Look at browser console for detailed error messages
3. Use the Rules Playground to test specific scenarios
