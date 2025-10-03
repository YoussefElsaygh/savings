import { CalorieGoal, DailyCalorieData, SavingsData, RateEntry } from '@/types';
import { STORAGE_KEYS } from '@/constants/localStorage';

export interface MigrationResult {
  success: boolean;
  message: string;
  dataFound: {
    calorieGoal: boolean;
    dailyCalorieData: boolean;
  };
  errors: string[];
}

export interface SavingsMigrationResult {
  success: boolean;
  message: string;
  dataFound: {
    savingsData: boolean;
    rateHistory: boolean;
  };
  errors: string[];
}

/**
 * Get data from localStorage for migration
 */
export function getLocalStorageData() {
  const result = {
    calorieGoal: null as CalorieGoal | null,
    dailyCalorieData: [] as DailyCalorieData[],
    found: {
      calorieGoal: false,
      dailyCalorieData: false,
    }
  };

  try {
    // Get calorie goal from localStorage
    const calorieGoalData = localStorage.getItem(STORAGE_KEYS.CALORIE_GOAL);
    if (calorieGoalData) {
      result.calorieGoal = JSON.parse(calorieGoalData);
      result.found.calorieGoal = true;
    }

    // Get daily calorie data from localStorage
    const dailyCalorieData = localStorage.getItem(STORAGE_KEYS.DAILY_CALORIE_DATA);
    if (dailyCalorieData) {
      result.dailyCalorieData = JSON.parse(dailyCalorieData);
      result.found.dailyCalorieData = true;
    }
  } catch (error) {
    console.error('Error reading localStorage data:', error);
  }

  return result;
}

/**
 * Migrate calorie data from localStorage to Firebase
 */
export async function migrateCalorieDataToFirebase(
  saveCalorieGoal: (goal: CalorieGoal | null) => Promise<void>,
  saveDailyData: (data: DailyCalorieData[]) => Promise<void>
): Promise<MigrationResult> {
  const result: MigrationResult = {
    success: false,
    message: '',
    dataFound: {
      calorieGoal: false,
      dailyCalorieData: false,
    },
    errors: []
  };

  try {
    const localData = getLocalStorageData();
    result.dataFound = localData.found;

    // Check if there's any data to migrate
    if (!localData.found.calorieGoal && !localData.found.dailyCalorieData) {
      result.message = 'No calorie data found in localStorage to migrate.';
      result.success = true; // Not an error, just no data
      return result;
    }

    const migrations = [];

    // Migrate calorie goal if found
    if (localData.found.calorieGoal && localData.calorieGoal) {
      migrations.push(
        saveCalorieGoal(localData.calorieGoal)
          .then(() => console.log('✅ Calorie goal migrated successfully'))
          .catch((error) => {
            const errorMsg = `Failed to migrate calorie goal: ${error.message}`;
            result.errors.push(errorMsg);
            console.error('❌', errorMsg);
          })
      );
    }

    // Migrate daily calorie data if found
    if (localData.found.dailyCalorieData && localData.dailyCalorieData.length > 0) {
      // Normalize data to ensure all required fields exist
      const normalizedData = localData.dailyCalorieData.map(day => ({
        ...day,
        totalCaloriesBurned: day.totalCaloriesBurned || 0,
        exerciseEntries: day.exerciseEntries || [],
      }));

      migrations.push(
        saveDailyData(normalizedData)
          .then(() => console.log(`✅ ${normalizedData.length} days of calorie data migrated successfully`))
          .catch((error) => {
            const errorMsg = `Failed to migrate daily calorie data: ${error.message}`;
            result.errors.push(errorMsg);
            console.error('❌', errorMsg);
          })
      );
    }

    // Wait for all migrations to complete
    await Promise.all(migrations);

    if (result.errors.length === 0) {
      result.success = true;
      result.message = 'All calorie data migrated successfully to Firebase!';
    } else {
      result.success = false;
      result.message = `Migration completed with ${result.errors.length} error(s).`;
    }

  } catch (error) {
    result.success = false;
    result.message = `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    result.errors.push(result.message);
    console.error('❌ Migration error:', error);
  }

  return result;
}

/**
 * Clear migrated data from localStorage (call only after successful migration)
 */
export function clearMigratedLocalStorageData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CALORIE_GOAL);
    localStorage.removeItem(STORAGE_KEYS.DAILY_CALORIE_DATA);
    console.log('✅ Migrated data cleared from localStorage');
  } catch (error) {
    console.error('❌ Error clearing localStorage:', error);
  }
}

/**
 * Check if user has any calorie data in localStorage
 */
export function hasCalorieDataInLocalStorage(): boolean {
  try {
    const calorieGoal = localStorage.getItem(STORAGE_KEYS.CALORIE_GOAL);
    const dailyData = localStorage.getItem(STORAGE_KEYS.DAILY_CALORIE_DATA);
    return !!(calorieGoal || dailyData);
  } catch (error) {
    console.error('Error checking localStorage:', error);
    return false;
  }
}

/**
 * Get savings data from localStorage for migration
 */
export function getSavingsLocalStorageData() {
  const result = {
    savingsData: null as SavingsData | null,
    rateHistory: [] as RateEntry[],
    found: {
      savingsData: false,
      rateHistory: false,
    }
  };

  try {
    // Get savings data from localStorage
    const savingsData = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    if (savingsData) {
      result.savingsData = JSON.parse(savingsData);
      result.found.savingsData = true;
    }

    // Get rate history data from localStorage
    const rateHistoryData = localStorage.getItem(STORAGE_KEYS.ALL_HISTORY);
    if (rateHistoryData) {
      result.rateHistory = JSON.parse(rateHistoryData);
      result.found.rateHistory = true;
    }
  } catch (error) {
    console.error('Error reading savings localStorage data:', error);
  }

  return result;
}

/**
 * Migrate savings data from localStorage to Firebase
 */
export async function migrateSavingsDataToFirebase(
  saveSavingsData: (data: SavingsData) => Promise<void>,
  saveRateHistory: (data: RateEntry[]) => Promise<void>
): Promise<SavingsMigrationResult> {
  const result: SavingsMigrationResult = {
    success: false,
    message: '',
    dataFound: {
      savingsData: false,
      rateHistory: false,
    },
    errors: []
  };

  try {
    const localData = getSavingsLocalStorageData();
    result.dataFound = localData.found;

    // Check if there's any data to migrate
    if (!localData.found.savingsData && !localData.found.rateHistory) {
      result.message = 'No savings data found in localStorage to migrate.';
      result.success = true; // Not an error, just no data
      return result;
    }

    const migrations = [];

    // Migrate savings data if found
    if (localData.found.savingsData && localData.savingsData) {
      migrations.push(
        saveSavingsData(localData.savingsData)
          .then(() => console.log('✅ Savings data migrated successfully'))
          .catch((error) => {
            const errorMsg = `Failed to migrate savings data: ${error.message}`;
            result.errors.push(errorMsg);
            console.error('❌', errorMsg);
          })
      );
    }

    // Migrate rate history if found
    if (localData.found.rateHistory && localData.rateHistory.length > 0) {
      migrations.push(
        saveRateHistory(localData.rateHistory)
          .then(() => console.log(`✅ ${localData.rateHistory.length} rate history entries migrated successfully`))
          .catch((error) => {
            const errorMsg = `Failed to migrate rate history: ${error.message}`;
            result.errors.push(errorMsg);
            console.error('❌', errorMsg);
          })
      );
    }

    // Wait for all migrations to complete
    await Promise.all(migrations);

    if (result.errors.length === 0) {
      result.success = true;
      result.message = 'All savings data migrated successfully to Firebase!';
    } else {
      result.success = false;
      result.message = `Migration completed with ${result.errors.length} error(s).`;
    }

  } catch (error) {
    result.success = false;
    result.message = `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    result.errors.push(result.message);
    console.error('❌ Savings migration error:', error);
  }

  return result;
}

/**
 * Clear migrated savings data from localStorage (call only after successful migration)
 */
export function clearMigratedSavingsLocalStorageData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SAVINGS);
    localStorage.removeItem(STORAGE_KEYS.ALL_HISTORY);
    console.log('✅ Migrated savings data cleared from localStorage');
  } catch (error) {
    console.error('❌ Error clearing savings localStorage:', error);
  }
}

/**
 * Check if user has any savings data in localStorage
 */
export function hasSavingsDataInLocalStorage(): boolean {
  try {
    const savings = localStorage.getItem(STORAGE_KEYS.SAVINGS);
    const rateHistory = localStorage.getItem(STORAGE_KEYS.ALL_HISTORY);
    return !!(savings || rateHistory);
  } catch (error) {
    console.error('Error checking savings localStorage:', error);
    return false;
  }
}
