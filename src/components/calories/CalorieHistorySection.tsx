"use client";

import { CalorieGoal, DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";

interface CalorieHistorySectionProps {
  dailyData: DailyCalorieData[];
  calorieGoal: CalorieGoal | null;
  normalizeData: (data: DailyCalorieData[]) => DailyCalorieData[];
  getTotalDeficitAchieved: () => number;
  getTodayDate: () => string;
}

export default function CalorieHistorySection({ 
  dailyData, 
  calorieGoal, 
  normalizeData, 
  getTotalDeficitAchieved,
  getTodayDate
}: CalorieHistorySectionProps) {
  if (dailyData.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">📅 Daily Calorie History ({dailyData.length} days)</h3>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatNumber(Math.round(dailyData.reduce((sum, day) => sum + day.totalCalories, 0) / dailyData.length))}
            </div>
            <div className="text-sm text-gray-600">Avg Calories/Day</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {normalizeData(dailyData).filter(day => {
                const foodDeficit = calorieGoal?.maintenanceCalories ? Math.max(calorieGoal.maintenanceCalories - day.totalCalories, 0) : 0;
                const exerciseBonus = day.totalCaloriesBurned || 0;
                return (foodDeficit + exerciseBonus) > 0;
              }).length}
            </div>
            <div className="text-sm text-gray-600">Deficit Days</div>
          </div>
          <div className="text-2xl font-bold text-purple-600 text-center">
            <div>{formatNumber(getTotalDeficitAchieved())}</div>
            <div className="text-sm text-gray-600">Total Deficit</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {normalizeData(dailyData).reduce((sum, day) => sum + day.foodEntries.length + (day.exerciseEntries?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Activities</div>
          </div>
        </div>

        {/* Daily History List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {normalizeData(dailyData)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((day, index) => {
            const isToday = day.date === getTodayDate();
            const foodDeficit = calorieGoal?.maintenanceCalories 
              ? calorieGoal.maintenanceCalories - day.totalCalories
              : 0;
            const exerciseBonus = day.totalCaloriesBurned || 0;
            const totalDayDeficit = foodDeficit + exerciseBonus;
            
            return (
              <div key={day.date} className={`border rounded-lg p-4 ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                {/* Date Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    {isToday && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">
                        Today
                      </span>
                    )}
                    {index === 1 && (
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                        Yesterday
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">
                      {formatNumber(day.totalCalories)} cal
                    </div>
                    <div className={`text-sm font-medium ${totalDayDeficit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNumber(totalDayDeficit)} {totalDayDeficit > 0 ? 'deficit' : 'gain'}
                    </div>
                    
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>vs Target ({formatNumber(day.calorieLimit)} cal)</span>
                    <span>{((day.totalCalories / day.calorieLimit) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        day.totalCalories <= day.calorieLimit ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min((day.totalCalories / day.calorieLimit) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Activities */}
                {(day.foodEntries.length > 0 || (day.exerciseEntries && day.exerciseEntries.length > 0)) ? (
                  <div className="space-y-3">
                    {/* Food Entries */}
                    {day.foodEntries.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          🍎 Food ({day.foodEntries.length}):
                        </div>
                        <div className="grid gap-1 text-sm">
                          {day.foodEntries
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((entry) => (
                            <div key={entry.id} className="flex justify-between items-center py-1 px-2 bg-green-50 rounded border border-green-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                <span className="text-gray-700">{entry.name}</span>
                              </div>
                              <span className="font-medium text-gray-900">
                                {formatNumber(entry.calories)} cal
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exercise Entries */}
                    {day.exerciseEntries && day.exerciseEntries.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                          🏃 Exercise ({day.exerciseEntries.length}):
                        </div>
                        <div className="grid gap-1 text-sm">
                          {day.exerciseEntries
                            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                            .map((entry) => (
                            <div key={entry.id} className="flex justify-between items-center py-1 px-2 bg-orange-50 rounded border border-orange-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {new Date(entry.timestamp).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                <span className="text-gray-700">{entry.name}</span>
                                <span className="text-xs text-gray-500">({entry.durationMinutes}min)</span>
                              </div>
                              <span className="font-medium text-orange-700">
                                +{formatNumber(entry.caloriesBurned)} cal
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic text-center py-2">
                    No activities recorded
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {dailyData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No history yet. Start tracking your meals!</p>
          </div>
        )}
      </div>
    </div>
  );
}
