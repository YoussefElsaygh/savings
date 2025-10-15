"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth, signInWithGoogle } from "@/lib/firebase";
import {
  CalorieGoal,
  DailyCalorieData,
  SavingsData,
  RateEntry,
  SpendingData,
} from "@/types";
import {
  saveCacheToLocalStorage,
  getCacheFromLocalStorage,
  clearAllCacheForUser,
  saveAuthState,
  clearAuthState,
} from "@/lib/cacheUtils";

// Global map to track which data has been loaded in this session
// Key format: "userId_collectionName_documentId"
const loadedDataTracker = new Map<string, boolean>();

// Generate a unique session ID on module load (changes on every page refresh)
const SESSION_ID = `session_${Date.now()}_${Math.random()}`;

// Clean up old session storage keys from previous page loads
if (typeof window !== "undefined") {
  try {
    const keys = Object.keys(sessionStorage);
    keys.forEach((key) => {
      if (key.startsWith("session_checked_session_")) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error("Error cleaning old session keys:", error);
  }
}

// Clear tracker when user signs out
export function clearLoadedDataTracker() {
  loadedDataTracker.clear();
}

export function useFirebaseData<T>(
  collectionName: string,
  documentId: string,
  defaultValue: T,
  registryKey:
    | "savingsData"
    | "calorieGoal"
    | "dailyCalorieData"
    | "rateHistory"
    | "spendingData"
    | "workoutSessions"
    | "personalRecords"
    | "workoutPreferences"
): [
  T,
  (value: T) => Promise<void>,
  boolean,
  string | null,
  User | null,
  () => Promise<void>
] {
  // Use ref to store defaultValue to avoid dependency issues
  const defaultValueRef = useRef<T>(defaultValue);
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const loadedFromCache = useRef(false);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        saveAuthState(true, currentUser.uid);
      } else {
        setUser(null);
        setIsLoading(false);
        setError("Please sign in with Google to continue");
        clearAuthState();
        clearAllCacheForUser(user?.uid || "");
        clearLoadedDataTracker(); // Clear global tracker on sign out
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Load data with caching mechanism (optimized to minimize Firestore reads)
  useEffect(() => {
    if (!user) {
      return;
    }

    // Create unique key for this data type and user
    const loadKey = `${user.uid}_${collectionName}_${documentId}`;

    // Skip if we've already loaded this data in this session
    if (loadedDataTracker.has(loadKey)) {
      // Still need to load from cache for this component instance
      const cacheKey = `cache_${collectionName}_${documentId}`;
      const cached = getCacheFromLocalStorage<T>(cacheKey, user.uid);
      if (cached) {
        setData(cached.data);
        setIsLoading(false);
        setError(null);
      }
      return;
    }

    // Mark as loading for this user and data type
    loadedDataTracker.set(loadKey, true);

    const loadData = async () => {
      try {
        const cacheKey = `cache_${collectionName}_${documentId}`;
        const docId = `${user.uid}_${documentId}`;
        const docRef = doc(db, collectionName, docId);

        // 1. Try to get cached data from localStorage
        const cached = getCacheFromLocalStorage<T>(cacheKey, user.uid);

        if (cached) {
          // 2. Use cached data immediately (optimistic loading)
          console.log(`✓ Using cached data for ${registryKey}`);
          setData(cached.data);
          setIsLoading(false);
          setError(null);
          loadedFromCache.current = true;

          // 3. Check if we should verify freshness (only check once per page load)
          // Use SESSION_ID to ensure checks happen on every page refresh
          const sessionKey = `session_checked_${SESSION_ID}_${cacheKey}`;
          const alreadyChecked = sessionStorage.getItem(sessionKey);

          if (!alreadyChecked) {
            // Verify cache is still valid in the background (doesn't block UI)
            getDoc(docRef)
              .then((docSnapshot) => {
                if (docSnapshot.exists()) {
                  const firestoreData = docSnapshot.data();
                  const firestoreTimestamp =
                    firestoreData.updatedAt?.toDate().toISOString() ||
                    new Date().toISOString();

                  // If timestamps don't match, update cache silently
                  if (cached.timestamp !== firestoreTimestamp) {
                    console.log(
                      `↻ Updating cache for ${registryKey} - found newer data`
                    );
                    const fetchedData =
                      firestoreData.data || defaultValueRef.current;
                    setData(fetchedData);
                    saveCacheToLocalStorage(
                      cacheKey,
                      fetchedData,
                      user.uid,
                      firestoreTimestamp
                    );
                  }
                }
                // Mark as checked for this page load session
                sessionStorage.setItem(sessionKey, "true");
              })
              .catch((err) => {
                console.error("Background cache verification failed:", err);
              });
          }

          return;
        }

        // 4. No cache exists, fetch from Firestore (first time load)
        console.log(`⬇ Fetching data from Firestore for ${registryKey}`);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const firestoreData = docSnapshot.data();
          const fetchedData = firestoreData.data || defaultValueRef.current;
          const timestamp =
            firestoreData.updatedAt?.toDate().toISOString() ||
            new Date().toISOString();

          setData(fetchedData);

          // 5. Save to localStorage cache
          saveCacheToLocalStorage(cacheKey, fetchedData, user.uid, timestamp);
        } else {
          setData(defaultValueRef.current);
        }

        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, collectionName, documentId, registryKey]);

  // Function to save data to Firestore (optimized - no extra registry writes)
  const saveData = useCallback(
    async (value: T): Promise<void> => {
      if (!user) {
        throw new Error("User not authenticated");
      }

      try {
        setError(null);
        const docId = `${user.uid}_${documentId}`;
        const docRef = doc(db, collectionName, docId);
        const timestamp = new Date();
        const timestampISO = timestamp.toISOString();

        // 1. Update local state immediately (optimistic update)
        setData(value);

        // 2. Update localStorage cache immediately
        const cacheKey = `cache_${collectionName}_${documentId}`;
        saveCacheToLocalStorage(cacheKey, value, user.uid, timestampISO);

        // 3. Clear session check so next component mount will verify freshness
        const sessionKey = `session_checked_${cacheKey}`;
        sessionStorage.removeItem(sessionKey);

        // Mark that data needs to be reloaded on next effect run
        const loadKey = `${user.uid}_${collectionName}_${documentId}`;
        loadedDataTracker.delete(loadKey);

        // 4. Save to Firestore (single write operation)
        await setDoc(
          docRef,
          {
            data: value,
            updatedAt: timestamp,
            userId: user.uid,
          },
          { merge: true }
        );

        console.log(`✓ Saved ${registryKey} to Firestore`);
      } catch (error) {
        console.error(
          "Error saving data to document:",
          `${user.uid}_${documentId}`,
          error
        );
        setError(
          error instanceof Error ? error.message : "Failed to save data"
        );
        throw error;
      }
    },
    [user, collectionName, documentId, registryKey]
  );

  // Function to trigger Google sign-in
  const signIn = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await signInWithGoogle();
      // User state will be updated by the onAuthStateChanged listener
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setError(error instanceof Error ? error.message : "Failed to sign in");
      throw error;
    }
  }, []);

  return [data, saveData, isLoading, error, user, signIn];
}

// Stable default values to prevent unnecessary re-renders
const DEFAULT_CALORIE_GOAL = null;
const DEFAULT_DAILY_DATA: DailyCalorieData[] = [];
const DEFAULT_SAVINGS_DATA: SavingsData = {
  usdAmount: 0,
  egpAmount: 0,
  gold18Amount: 0,
  gold21Amount: 0,
  gold24Amount: 0,
};
const DEFAULT_RATE_ENTRIES: RateEntry[] = [];

// Specialized hook for calorie goal
export function useCalorieGoalFirebase() {
  return useFirebaseData<CalorieGoal | null>(
    "calorieData",
    "goal",
    DEFAULT_CALORIE_GOAL,
    "calorieGoal"
  );
}

// Specialized hook for daily calorie data
export function useDailyCalorieDataFirebase() {
  return useFirebaseData<DailyCalorieData[]>(
    "calorieData",
    "dailyData",
    DEFAULT_DAILY_DATA,
    "dailyCalorieData"
  );
}

// Specialized hook for savings data
export function useSavingsDataFirebase() {
  return useFirebaseData<SavingsData>(
    "savingsData",
    "savings",
    DEFAULT_SAVINGS_DATA,
    "savingsData"
  );
}

// Specialized hook for rate history/all history
export function useRateHistoryFirebase() {
  return useFirebaseData<RateEntry[]>(
    "savingsData",
    "rateHistory",
    DEFAULT_RATE_ENTRIES,
    "rateHistory"
  );
}

// Default spending data (categories are imported from constants, not stored in DB)
const DEFAULT_SPENDING_DATA: SpendingData = {
  monthlyData: [],
};

// Specialized hook for spending data
export function useSpendingDataFirebase() {
  return useFirebaseData<SpendingData>(
    "spendingData",
    "spending",
    DEFAULT_SPENDING_DATA,
    "spendingData"
  );
}

// Workout Tracker Hooks
import type {
  WorkoutSession,
  PersonalRecord,
  WorkoutPreferences,
} from "@/types";

const DEFAULT_WORKOUT_SESSIONS: WorkoutSession[] = [];
const DEFAULT_PERSONAL_RECORDS: PersonalRecord[] = [];
const DEFAULT_WORKOUT_PREFERENCES: WorkoutPreferences | null = null;

// Hook for workout sessions
export function useWorkoutSessionsFirebase() {
  return useFirebaseData<WorkoutSession[]>(
    "workoutData",
    "sessions",
    DEFAULT_WORKOUT_SESSIONS,
    "workoutSessions" as const
  );
}

// Hook for personal records
export function usePersonalRecordsFirebase() {
  return useFirebaseData<PersonalRecord[]>(
    "workoutData",
    "personalRecords",
    DEFAULT_PERSONAL_RECORDS,
    "personalRecords" as const
  );
}

// Hook for workout preferences
export function useWorkoutPreferencesFirebase() {
  return useFirebaseData<WorkoutPreferences | null>(
    "workoutData",
    "preferences",
    DEFAULT_WORKOUT_PREFERENCES,
    "workoutPreferences" as const
  );
}
