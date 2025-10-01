"use client";

import { useState } from "react";
import { DailyCalorieData, FoodEntry, ExerciseEntry, CalorieGoal } from "@/types";
import { formatNumber } from "@/lib/utils";
import AddFoodModal from "./AddFoodModal";
import AddExerciseModal from "./AddExerciseModal";

interface EditDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: DailyCalorieData;
  calorieGoal: CalorieGoal | null;
  onUpdateDay: (updatedDay: DailyCalorieData) => void;
}

export default function EditDayModal({ 
  isOpen, 
  onClose, 
  dayData, 
  calorieGoal, 
  onUpdateDay 
}: EditDayModalProps) {
  const [currentDayData, setCurrentDayData] = useState<DailyCalorieData>(dayData);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);

  if (!isOpen) return null;

  const handleAddFood = (foodData: { name: string; calories: number; description: string }) => {
    const newFoodEntry: FoodEntry = {
      id: Date.now().toString(),
      name: foodData.name,
      calories: foodData.calories,
      timestamp: new Date().toISOString(),
      date: currentDayData.date,
    };

    const updatedDay = {
      ...currentDayData,
      foodEntries: [...currentDayData.foodEntries, newFoodEntry],
      totalCalories: currentDayData.totalCalories + foodData.calories,
    };
    
    updatedDay.remainingCalories = updatedDay.calorieLimit - updatedDay.totalCalories;
    setCurrentDayData(updatedDay);
  };

  const handleAddExercise = (exerciseData: { name: string; caloriesBurned: number; durationMinutes: number; description: string }) => {
    const newExerciseEntry: ExerciseEntry = {
      id: Date.now().toString(),
      name: exerciseData.name,
      caloriesBurned: exerciseData.caloriesBurned,
      durationMinutes: exerciseData.durationMinutes,
      timestamp: new Date().toISOString(),
      date: currentDayData.date,
    };

    const updatedDay = {
      ...currentDayData,
      exerciseEntries: [...(currentDayData.exerciseEntries || []), newExerciseEntry],
      totalCaloriesBurned: (currentDayData.totalCaloriesBurned || 0) + exerciseData.caloriesBurned,
    };
    
    setCurrentDayData(updatedDay);
  };

  const handleDeleteFood = (foodId: string) => {
    const foodToDelete = currentDayData.foodEntries.find(f => f.id === foodId);
    if (foodToDelete) {
      const updatedDay = {
        ...currentDayData,
        foodEntries: currentDayData.foodEntries.filter(f => f.id !== foodId),
        totalCalories: currentDayData.totalCalories - foodToDelete.calories,
      };
      updatedDay.remainingCalories = updatedDay.calorieLimit - updatedDay.totalCalories;
      setCurrentDayData(updatedDay);
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const exerciseToDelete = currentDayData.exerciseEntries?.find(e => e.id === exerciseId);
    if (exerciseToDelete) {
      const updatedDay = {
        ...currentDayData,
        exerciseEntries: (currentDayData.exerciseEntries || []).filter(e => e.id !== exerciseId),
        totalCaloriesBurned: (currentDayData.totalCaloriesBurned || 0) - exerciseToDelete.caloriesBurned,
      };
      setCurrentDayData(updatedDay);
    }
  };

  const handleSave = () => {
    onUpdateDay(currentDayData);
    onClose();
  };

  const handleCancel = () => {
    setCurrentDayData(dayData); // Reset to original data
    onClose();
  };

  const foodDeficit = calorieGoal?.maintenanceCalories 
    ? calorieGoal.maintenanceCalories - currentDayData.totalCalories
    : 0;
  const exerciseBonus = currentDayData.totalCaloriesBurned || 0;
  const totalDayDeficit = foodDeficit + exerciseBonus;

  return (
    <>
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4 z-40">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                📝 Edit Day - {new Date(currentDayData.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className="text-gray-600">
                  {formatNumber(currentDayData.totalCalories)} cal consumed
                </span>
                <span className="text-gray-600">
                  {formatNumber(currentDayData.totalCaloriesBurned || 0)} cal burned
                </span>
                <span className={`font-medium ${totalDayDeficit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatNumber(totalDayDeficit)} {totalDayDeficit > 0 ? 'deficit' : 'surplus'}
                </span>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>vs Target ({formatNumber(currentDayData.calorieLimit)} cal)</span>
                <span>{((currentDayData.totalCalories / currentDayData.calorieLimit) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentDayData.totalCalories <= currentDayData.calorieLimit ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min((currentDayData.totalCalories / currentDayData.calorieLimit) * 100, 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Food Entries */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🍎 Food Entries ({currentDayData.foodEntries.length})
                  </h3>
                  <button
                    onClick={() => setShowAddFoodModal(true)}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    + Add Food
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentDayData.foodEntries.length > 0 ? (
                    currentDayData.foodEntries
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                          <div>
                            <div className="font-medium text-gray-800">{entry.name}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {formatNumber(entry.calories)} cal
                            </span>
                            <button
                              onClick={() => handleDeleteFood(entry.id)}
                              className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-3xl mb-2">🍽️</div>
                      <p>No food entries yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Exercise Entries */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    🏃 Exercise Entries ({(currentDayData.exerciseEntries || []).length})
                  </h3>
                  <button
                    onClick={() => setShowAddExerciseModal(true)}
                    className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                  >
                    + Add Exercise
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {(currentDayData.exerciseEntries || []).length > 0 ? (
                    (currentDayData.exerciseEntries || [])
                      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                      .map((entry) => (
                        <div key={entry.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                          <div>
                            <div className="font-medium text-gray-800">{entry.name}</div>
                            <div className="text-xs text-gray-500 flex gap-2">
                              <span>
                                {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                              <span>• {entry.durationMinutes}min</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-orange-700">
                              +{formatNumber(entry.caloriesBurned)} cal
                            </span>
                            <button
                              onClick={() => handleDeleteExercise(entry.id)}
                              className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-3xl mb-2">💪</div>
                      <p>No exercise entries yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Sub-modals */}
      <AddFoodModal
        isOpen={showAddFoodModal}
        onClose={() => setShowAddFoodModal(false)}
        onAddFood={handleAddFood}
      />

      <AddExerciseModal
        isOpen={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        onAddExercise={handleAddExercise}
      />
    </>
  );
}
