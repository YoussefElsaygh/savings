import { CalorieGoal, DailyCalorieData } from '@/types';
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
