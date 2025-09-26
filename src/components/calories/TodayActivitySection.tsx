"use client";

import { DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";

interface TodayActivitySectionProps {
  todayData: DailyCalorieData;
  onDeleteFood: (foodId: string) => void;
  onDeleteExercise: (exerciseId: string) => void;
}

export default function TodayActivitySection({ 
  todayData, 
  onDeleteFood, 
  onDeleteExercise 
}: TodayActivitySectionProps) {
  const hasActivity = todayData.foodEntries.length > 0 || 
    (todayData.exerciseEntries && todayData.exerciseEntries.length > 0);

  if (!hasActivity) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Today&apos;s Activity</h3>
      
      {/* Food Entries */}
      {todayData.foodEntries.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            🍎 Food Entries ({todayData.foodEntries.length} items)
          </h4>
          <div className="space-y-2">
            {todayData.foodEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-100">
                <div>
                  <div className="font-medium">{entry.name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {formatNumber(entry.calories)} calories
                  </div>
                </div>
                <button
                  onClick={() => onDeleteFood(entry.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                  title="Delete food entry"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exercise Entries */}
      {todayData.exerciseEntries && todayData.exerciseEntries.length > 0 && (
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            🏃 Exercise Entries ({todayData.exerciseEntries.length} items)
          </h4>
          <div className="space-y-2">
            {todayData.exerciseEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between bg-orange-50 p-3 rounded border border-orange-100">
                <div>
                  <div className="font-medium">{entry.name}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - {entry.durationMinutes} min - {formatNumber(entry.caloriesBurned)} calories burned
                  </div>
                </div>
                <button
                  onClick={() => onDeleteExercise(entry.id)}
                  className="text-red-500 hover:text-red-700 font-bold"
                  title="Delete exercise entry"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
