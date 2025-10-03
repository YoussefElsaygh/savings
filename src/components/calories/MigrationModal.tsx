"use client";

import { useState } from 'react';
import { useCalorieGoalFirebase, useDailyCalorieDataFirebase } from '@/hooks/useFirebaseData';
import { 
  migrateCalorieDataToFirebase, 
  clearMigratedLocalStorageData,
  getLocalStorageData,
  MigrationResult 
} from '@/utils/migration';

interface MigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MigrationModal({ isOpen, onClose }: MigrationModalProps) {
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed' | 'error'>('idle');
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [dataPreview, setDataPreview] = useState<{
    calorieGoal: any;
    dailyDataCount: number;
    found: { calorieGoal: boolean; dailyCalorieData: boolean };
  } | null>(null);

  // Firebase hooks
  const [, saveCalorieGoal] = useCalorieGoalFirebase();
  const [, saveDailyData] = useDailyCalorieDataFirebase();

  if (!isOpen) return null;

  const checkLocalStorageData = () => {
    setMigrationStatus('checking');
    
    try {
      const localData = getLocalStorageData();
      setDataPreview({
        calorieGoal: localData.calorieGoal,
        dailyDataCount: localData.dailyCalorieData.length,
        found: localData.found,
      });
      setMigrationStatus('idle');
    } catch (error) {
      console.error('Error checking data:', error);
      setMigrationStatus('error');
    }
  };

  const startMigration = async () => {
    setMigrationStatus('migrating');
    
    try {
      const result = await migrateCalorieDataToFirebase(saveCalorieGoal, saveDailyData);
      setMigrationResult(result);
      
      if (result.success) {
        setMigrationStatus('completed');
      } else {
        setMigrationStatus('error');
      }
    } catch (error) {
      setMigrationStatus('error');
      setMigrationResult({
        success: false,
        message: `Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        dataFound: { calorieGoal: false, dailyCalorieData: false },
        errors: [error instanceof Error ? error.message : 'Unknown error']
      });
    }
  };

  const clearLocalStorage = () => {
    clearMigratedLocalStorageData();
    alert('LocalStorage data cleared successfully!');
    onClose();
  };

  const handleClose = () => {
    setMigrationStatus('idle');
    setMigrationResult(null);
    setDataPreview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              📦 Migrate LocalStorage to Firebase
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {migrationStatus === 'idle' && !dataPreview && (
            <div className="space-y-4">
              <p className="text-gray-600">
                This will migrate your calorie tracking data from localStorage to Firebase for cloud sync.
              </p>
              <button
                onClick={checkLocalStorageData}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔍 Check LocalStorage Data
              </button>
            </div>
          )}

          {migrationStatus === 'checking' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Checking localStorage data...</p>
            </div>
          )}

          {migrationStatus === 'idle' && dataPreview && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Data Found:</h3>
              
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span>Calorie Goal:</span>
                  <span className={dataPreview.found.calorieGoal ? "text-green-600" : "text-gray-400"}>
                    {dataPreview.found.calorieGoal ? '✅ Found' : '❌ Not found'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span>Daily Data:</span>
                  <span className={dataPreview.found.dailyCalorieData ? "text-green-600" : "text-gray-400"}>
                    {dataPreview.found.dailyCalorieData ? `✅ ${dataPreview.dailyDataCount} days` : '❌ Not found'}
                  </span>
                </div>
              </div>

              {dataPreview.calorieGoal && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Calorie Goal Preview:</h4>
                  <p className="text-sm text-blue-700">
                    Daily: {dataPreview.calorieGoal.dailyCalories} cal | 
                    Weekly Loss: {dataPreview.calorieGoal.weeklyWeightLoss} lbs
                  </p>
                </div>
              )}

              {(dataPreview.found.calorieGoal || dataPreview.found.dailyCalorieData) ? (
                <button
                  onClick={startMigration}
                  className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  🚀 Start Migration
                </button>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">No calorie data found in localStorage to migrate.</p>
                  <button
                    onClick={handleClose}
                    className="mt-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}

          {migrationStatus === 'migrating' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Migrating data to Firebase...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          )}

          {migrationStatus === 'completed' && migrationResult && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="font-semibold text-green-600 mb-2">Migration Successful!</h3>
                <p className="text-gray-600 text-sm">{migrationResult.message}</p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">What was migrated:</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  {migrationResult.dataFound.calorieGoal && (
                    <li>✅ Calorie goal settings</li>
                  )}
                  {migrationResult.dataFound.dailyCalorieData && (
                    <li>✅ Daily calorie tracking data</li>
                  )}
                </ul>
              </div>

              <div className="space-y-3">
                <button
                  onClick={clearLocalStorage}
                  className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  🗑️ Clear Old LocalStorage Data
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {migrationStatus === 'error' && migrationResult && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">❌</div>
                <h3 className="font-semibold text-red-600 mb-2">Migration Failed</h3>
                <p className="text-gray-600 text-sm">{migrationResult.message}</p>
              </div>

              {migrationResult.errors.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {migrationResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => setMigrationStatus('idle')}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
