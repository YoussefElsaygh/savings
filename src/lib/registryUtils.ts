/**
 * Firestore registry utilities for tracking last updated timestamps
 */

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface DataRegistry {
  savingsData?: string; // ISO timestamp
  calorieGoal?: string; // ISO timestamp
  dailyCalorieData?: string; // ISO timestamp
  rateHistory?: string; // ISO timestamp
}

/**
 * Get the registry document for a user
 */
export async function getUserRegistry(
  userId: string
): Promise<DataRegistry | null> {
  try {
    const registryRef = doc(db, "dataRegistry", userId);
    const registryDoc = await getDoc(registryRef);

    if (registryDoc.exists()) {
      return registryDoc.data() as DataRegistry;
    }
    return null;
  } catch (error) {
    console.error("Error fetching registry:", error);
    return null;
  }
}

/**
 * Update the registry for a specific data type
 */
export async function updateRegistry(
  userId: string,
  dataType: keyof DataRegistry,
  timestamp: string
): Promise<void> {
  try {
    const registryRef = doc(db, "dataRegistry", userId);
    await setDoc(
      registryRef,
      {
        [dataType]: timestamp,
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error updating registry:", error);
    throw error;
  }
}

/**
 * Get the last updated timestamp for a specific data type
 */
export async function getLastUpdated(
  userId: string,
  dataType: keyof DataRegistry
): Promise<string | null> {
  try {
    const registry = await getUserRegistry(userId);
    return registry?.[dataType] || null;
  } catch (error) {
    console.error("Error getting last updated:", error);
    return null;
  }
}
