# Cache Refresh Fix

## Problem

When the app was open in a browser and data was updated in Firestore from a mobile app:

- **Refreshing the page** ❌ did NOT load the new data
- **Opening a new tab** ✅ DID load the new data

## Root Cause

The caching system in `useFirebaseData.ts` uses `sessionStorage` to track which data has been verified for freshness. The issue was:

1. `sessionStorage` persists across page refreshes (in the same tab)
2. When you refreshed, the system saw the `session_checked_` flag and assumed it already verified the cache
3. It would skip the Firestore check and use stale cached data
4. When opening a new tab, fresh `sessionStorage` meant it would check Firestore and get the latest data

## Solution

Added a unique `SESSION_ID` that regenerates on every page load:

```typescript
const SESSION_ID = `session_${Date.now()}_${Math.random()}`;
```

Now the session check key includes the `SESSION_ID`:

```typescript
const sessionKey = `session_checked_${SESSION_ID}_${cacheKey}`;
```

This ensures:

- ✅ Every page refresh gets a new SESSION_ID
- ✅ The cache freshness check happens on every page load
- ✅ Updated data from Firestore is loaded when you refresh
- ✅ Still maintains the optimization of only checking once per page session

## Additional Improvements

- Added cleanup logic to remove old `session_checked_` keys from `sessionStorage`
- Prevents sessionStorage from growing unbounded over time
- Improved console logging to indicate when newer data is found

## How It Works Now

### On Page Load (Refresh or New Tab):

1. Generate new `SESSION_ID`
2. Clean up old session keys
3. Load cached data immediately (fast UI)
4. Check Firestore in background for updates
5. If newer data found, update cache and UI silently
6. Mark as checked for this session (prevent duplicate checks)

### Result:

- **Fast initial load** (uses cache)
- **Always fresh data** (verifies on every page load)
- **Efficient** (only checks once per session)
- **Works across devices** (mobile updates visible on browser refresh)

## Testing

To verify the fix works:

1. Open app in browser
2. Make a change from mobile app (add workout, update calories, etc.)
3. Refresh the browser page
4. ✅ You should see the updated data from mobile

## Files Modified

- `src/hooks/useFirebaseData.ts`
