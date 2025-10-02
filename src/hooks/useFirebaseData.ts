"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, signInAnonymousUser } from '@/lib/firebase';
import { CalorieGoal, DailyCalorieData } from '@/types';

export function useFirebaseData<T>(
  collectionName: string,
  documentId: string,
  defaultValue: T
): [T, (value: T) => Promise<void>, boolean, string | null] {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        // Sign in anonymously if no user
        try {
          const anonymousUser = await signInAnonymousUser();
          setUser(anonymousUser);
        } catch (error) {
          console.error('Failed to sign in anonymously:', error);
          setError('Authentication failed');
          setIsLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Set up real-time listener for data
  useEffect(() => {
    if (!user) return;

    const docRef = doc(db, collectionName, `${user.uid}_${documentId}`);
    
    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const firestoreData = docSnapshot.data();
          setData(firestoreData.data || defaultValue);
        } else {
          setData(defaultValue);
        }
        setIsLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Error fetching data:', error);
        setError(error.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, collectionName, documentId, defaultValue]);

  // Function to save data to Firestore
  const saveData = async (value: T): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      setError(null);
      const docRef = doc(db, collectionName, `${user.uid}_${documentId}`);
      await setDoc(docRef, {
        data: value,
        updatedAt: new Date(),
        userId: user.uid
      }, { merge: true });
      
      // Update local state immediately for better UX
      setData(value);
    } catch (error) {
      console.error('Error saving data:', error);
      setError(error instanceof Error ? error.message : 'Failed to save data');
      throw error;
    }
  };

  return [data, saveData, isLoading, error];
}

// Specialized hook for calorie goal
export function useCalorieGoalFirebase() {
  return useFirebaseData<CalorieGoal | null>('calorieData', 'goal', null);
}

// Specialized hook for daily calorie data
export function useDailyCalorieDataFirebase() {
  return useFirebaseData<DailyCalorieData[]>('calorieData', 'dailyData', []);
}
