"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, signInWithGoogle } from '@/lib/firebase';
import { CalorieGoal, DailyCalorieData } from '@/types';

export function useFirebaseData<T>(
  collectionName: string,
  documentId: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean, string | null, User | null, () => Promise<void>] {
  // Use ref to store defaultValue to avoid dependency issues
  const defaultValueRef = useRef<T>(defaultValue);
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        setIsLoading(false);
        setError('Please sign in with Google to continue');
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up real-time listener for data
  useEffect(() => {
    if (!user) return;

    const docId = `${user.uid}_${documentId}`;
    const docRef = doc(db, collectionName, docId);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const firestoreData = docSnapshot.data();
          setData(firestoreData.data || defaultValueRef.current);
        } else {
          setData(defaultValueRef.current);
        }
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching data for document:', docId, error);
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, collectionName, documentId]);

  // Function to save data to Firestore
  const saveData = useCallback(async (value: T): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      const docId = `${user.uid}_${documentId}`;
      const docRef = doc(db, collectionName, docId);
      
      await setDoc(docRef, {
        data: value,
        updatedAt: new Date(),
        userId: user.uid
      }, { merge: true });
      
      // Don't update local state here - let the listener handle it to avoid conflicts
    } catch (error) {
      console.error('Error saving data to document:', `${user.uid}_${documentId}`, error);
      setError(error instanceof Error ? error.message : 'Failed to save data');
      throw error;
    }
  }, [user, collectionName, documentId]);

  // Function to trigger Google sign-in
  const signIn = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await signInWithGoogle();
      // User state will be updated by the onAuthStateChanged listener
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
      throw error;
    }
  }, []);

  return [data, saveData, isLoading, error, user, signIn];
}

// Stable default values to prevent unnecessary re-renders
const DEFAULT_CALORIE_GOAL = null;
const DEFAULT_DAILY_DATA: DailyCalorieData[] = [];

// Specialized hook for calorie goal
export function useCalorieGoalFirebase() {
  return useFirebaseData<CalorieGoal | null>('calorieData', 'goal', DEFAULT_CALORIE_GOAL);
}

// Specialized hook for daily calorie data
export function useDailyCalorieDataFirebase() {
  return useFirebaseData<DailyCalorieData[]>('calorieData', 'dailyData', DEFAULT_DAILY_DATA);
}
