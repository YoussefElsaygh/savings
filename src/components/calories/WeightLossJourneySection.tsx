"use client";

import { CalorieGoal } from "@/types";
import { formatNumber } from "@/lib/utils";

interface WeightLossJourneySectionProps {
  calorieGoal: CalorieGoal | null;
  totalDeficitAchieved: number;
  remainingCaloriesToLose: number;
}

export default function WeightLossJourneySection({ 
  calorieGoal, 
  totalDeficitAchieved, 
  remainingCaloriesToLose 
}: WeightLossJourneySectionProps) {
  if (!calorieGoal?.totalCaloriesToLose) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
      <h3 className="text-xl font-bold mb-6 text-center">🎯 Your Weight Loss Journey</h3>
      
      <div className="grid gap-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-lg">Goal:</span>
          <span className="text-lg font-bold text-purple-600">
            {formatNumber(calorieGoal.totalCaloriesToLose)} calories to lose
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg">Achieved:</span>
          <span className="text-lg font-bold text-green-600">
            {formatNumber(totalDeficitAchieved)} calories
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg">Remaining:</span>
          <span className="text-lg font-bold text-orange-600">
            {formatNumber(remainingCaloriesToLose)} calories
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress:</span>
          <span className="font-medium">
            {calorieGoal.totalCaloriesToLose > 0 ? 
              ((totalDeficitAchieved / calorieGoal.totalCaloriesToLose) * 100).toFixed(1) : 0}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="h-4 rounded-full transition-all duration-500 bg-gradient-to-r from-purple-500 to-green-500"
            style={{ 
              width: `${Math.min((totalDeficitAchieved / calorieGoal.totalCaloriesToLose) * 100, 100)}%` 
            }}
          ></div>
        </div>
      </div>
      
      {totalDeficitAchieved >= calorieGoal.totalCaloriesToLose && (
        <div className="bg-green-100 border border-green-300 rounded p-4 text-center">
          <div className="text-2xl mb-2">🎉 🏆 🎉</div>
          <div className="text-green-800 font-bold text-lg">
            Congratulations! You&apos;ve reached your goal!
          </div>
          <div className="text-green-700 text-sm mt-1">
            You&apos;ve successfully created a deficit of {formatNumber(totalDeficitAchieved)} calories!
          </div>
        </div>
      )}
      
      {totalDeficitAchieved < calorieGoal.totalCaloriesToLose && (
        <div className="bg-blue-100 border border-blue-300 rounded p-3 text-center text-sm">
          <strong>Keep going!</strong> You&apos;re {formatNumber(remainingCaloriesToLose)} calories away from your goal.
          <br />
          At {formatNumber((calorieGoal.targetWeightLoss * 7700) / 7)} calories/day, you&apos;ll reach it in about {Math.ceil(remainingCaloriesToLose / ((calorieGoal.targetWeightLoss * 7700) / 7))} days.
        </div>
      )}
    </div>
  );
}
