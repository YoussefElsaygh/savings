"use client";

import { CalorieGoal, DailyCalorieData } from "@/types";
import { formatNumber } from "@/lib/utils";

interface TodayProgressSectionProps {
  calorieGoal: CalorieGoal | null;
  todayData: DailyCalorieData;
}

export default function TodayProgressSection({ calorieGoal, todayData }: TodayProgressSectionProps) {
  if (!calorieGoal) return null;

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Today&apos;s Progress</h3>
      
      <div className="grid gap-3 mb-4">
        <div className="flex justify-between">
          <span>Calorie Limit:</span>
          <span className="font-medium">{formatNumber(todayData.calorieLimit)} calories</span>
        </div>
        <div className="flex justify-between">
          <span>Calories Consumed:</span>
          <span className="font-medium">{formatNumber(todayData.totalCalories)} calories</span>
        </div>
        <div className="flex justify-between">
          <span>Remaining Calories:</span>
          <span className={`font-bold ${todayData.remainingCalories >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatNumber(todayData.remainingCalories)} calories
          </span>
        </div>
        <div className="flex justify-between">
          <span>Calories Burned (Exercise):</span>
          <span className="font-bold text-orange-600">
            {formatNumber(todayData.totalCaloriesBurned || 0)} calories
          </span>
        </div>
        <div className="flex justify-between">
          <span>Today&apos;s Total Deficit:</span>
          <span className={`font-bold ${
            calorieGoal?.maintenanceCalories 
              ? 'text-green-600' : 'text-red-600'
          }`}>
            {calorieGoal?.maintenanceCalories 
              ? formatNumber(Math.max(calorieGoal.maintenanceCalories - todayData.totalCalories, 0) + (todayData.totalCaloriesBurned || 0))
              : '0'} calories
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
        <div 
          className={`h-4 rounded-full transition-all duration-300 ${
            todayData.totalCalories <= todayData.calorieLimit ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ 
            width: `${Math.min((todayData.totalCalories / todayData.calorieLimit) * 100, 100)}%` 
          }}
        ></div>
      </div>
      
      <div className="text-center text-sm text-gray-600">
        {(todayData.totalCalories / todayData.calorieLimit * 100).toFixed(1)}% of daily limit used
      </div>
    </div>
  );
}
