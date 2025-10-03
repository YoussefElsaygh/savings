/**
 * Console Migration Script
 * 
 * Run this script in the browser console to migrate localStorage data to Firebase.
 * Make sure you're on the calories page and have Firebase loaded before running.
 * 
 * To use:
 * 1. Open browser console (F12)
 * 2. Navigate to the calories page
 * 3. Copy and paste this entire script
 * 4. Press Enter to execute
 */

// This script should be run in the browser console on your site
(function() {
  'use strict';

  console.log('🚀 Starting localStorage to Firebase migration...');

  // Check if we're on the right page
  if (!window.location.pathname.includes('calories')) {
    console.warn('⚠️  Please navigate to the calories page first!');
    return;
  }

  // Helper function to get localStorage data
  function getLocalStorageData() {
    const STORAGE_KEYS = {
      CALORIE_GOAL: "calorieGoal",
      DAILY_CALORIE_DATA: "dailyCalorieData",
    };

    const result = {
      calorieGoal: null,
      dailyCalorieData: [],
      found: {
        calorieGoal: false,
        dailyCalorieData: false,
      }
    };

    try {
      // Get calorie goal
      const calorieGoalData = localStorage.getItem(STORAGE_KEYS.CALORIE_GOAL);
      if (calorieGoalData) {
        result.calorieGoal = JSON.parse(calorieGoalData);
        result.found.calorieGoal = true;
        console.log('✅ Found calorie goal in localStorage');
      }

      // Get daily data
      const dailyCalorieData = localStorage.getItem(STORAGE_KEYS.DAILY_CALORIE_DATA);
      if (dailyCalorieData) {
        result.dailyCalorieData = JSON.parse(dailyCalorieData);
        result.found.dailyCalorieData = true;
        console.log(`✅ Found ${result.dailyCalorieData.length} days of data in localStorage`);
      }

      if (!result.found.calorieGoal && !result.found.dailyCalorieData) {
        console.log('ℹ️  No calorie data found in localStorage');
      }
    } catch (error) {
      console.error('❌ Error reading localStorage:', error);
    }

    return result;
  }

  // Helper function to clear localStorage
  function clearLocalStorage() {
    const STORAGE_KEYS = {
      CALORIE_GOAL: "calorieGoal",
      DAILY_CALORIE_DATA: "dailyCalorieData",
    };

    try {
      localStorage.removeItem(STORAGE_KEYS.CALORIE_GOAL);
      localStorage.removeItem(STORAGE_KEYS.DAILY_CALORIE_DATA);
      console.log('🗑️  LocalStorage data cleared');
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
    }
  }

  // Main migration function
  async function migrate() {
    const localData = getLocalStorageData();
    
    if (!localData.found.calorieGoal && !localData.found.dailyCalorieData) {
      console.log('✨ Migration complete - no data to migrate');
      return;
    }

    // Check if Firebase is available
    try {
      // Try to access the Firebase functions from the global scope
      // This assumes your Firebase hooks are accessible globally or you're on the calories page
      
      console.log('📤 Starting data upload to Firebase...');
      console.log('⚠️  Note: This console script requires the Firebase migration modal for full functionality.');
      console.log('💡 Recommendation: Use the "📦 Migrate Data" button on the calories page instead.');
      
      // Display what would be migrated
      if (localData.found.calorieGoal) {
        console.log('📊 Calorie goal to migrate:', localData.calorieGoal);
      }
      
      if (localData.found.dailyCalorieData) {
        console.log(`📅 Daily data to migrate: ${localData.dailyCalorieData.length} entries`);
        console.log('Sample:', localData.dailyCalorieData.slice(0, 2));
      }

      console.log('\n🔧 To complete the migration:');
      console.log('1. Use the "📦 Migrate Data" button on the calories page, OR');
      console.log('2. Call window.migrationFunctions.migrate() if available');

    } catch (error) {
      console.error('❌ Migration error:', error);
      console.log('\n💡 Please use the migration button on the calories page instead.');
    }
  }

  // Utility functions available in console
  window.migrationUtils = {
    getData: getLocalStorageData,
    clearData: clearLocalStorage,
    migrate: migrate,
  };

  console.log('\n🛠️  Migration utilities loaded!');
  console.log('Available commands:');
  console.log('- window.migrationUtils.getData() - Check localStorage data');
  console.log('- window.migrationUtils.clearData() - Clear localStorage (use after successful migration)');
  console.log('- window.migrationUtils.migrate() - Show migration preview');
  
  // Auto-run the migration preview
  migrate();

})();

export {}; // Make this a module
