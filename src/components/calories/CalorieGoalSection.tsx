"use client";

import { useState, useEffect } from "react";
import { CalorieGoal } from "@/types";
import { formatNumber, formatDate } from "@/lib/utils";

interface CalorieGoalSectionProps {
  calorieGoal: CalorieGoal | null;
  onSaveGoal: (goal: CalorieGoal) => void;
}

export default function CalorieGoalSection({ calorieGoal, onSaveGoal }: CalorieGoalSectionProps) {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [maintenanceCalories, setMaintenanceCalories] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [targetWeightLoss, setTargetWeightLoss] = useState("");
  const [totalCaloriesToLose, setTotalCaloriesToLose] = useState("");

  // Initialize goal form when editing
  useEffect(() => {
    if (calorieGoal && showGoalForm) {
      setMaintenanceCalories(calorieGoal.maintenanceCalories?.toString() || "");
      setDailyLimit(calorieGoal.dailyCalorieLimit.toString());
      setTargetWeightLoss(calorieGoal.targetWeightLoss.toString());
      setTotalCaloriesToLose(calorieGoal.totalCaloriesToLose?.toString() || "");
    }
  }, [calorieGoal, showGoalForm]);

  const handleSaveGoal = () => {
    const maintenance = parseFloat(maintenanceCalories);
    const limit = parseFloat(dailyLimit);
    const weightLoss = parseFloat(targetWeightLoss);
    const totalCalories = parseFloat(totalCaloriesToLose);
    
    if (maintenance > 0 && limit > 0 && weightLoss > 0 && totalCalories > 0) {
      const newGoal: CalorieGoal = {
        maintenanceCalories: maintenance,
        dailyCalorieLimit: limit,
        targetWeightLoss: weightLoss,
        totalCaloriesToLose: totalCalories,
        createdAt: new Date().toISOString(),
      };
      
      onSaveGoal(newGoal);
      setShowGoalForm(false);
      setMaintenanceCalories("");
      setDailyLimit("");
      setTargetWeightLoss("");
      setTotalCaloriesToLose("");
    }
  };

  const handleCancel = () => {
    setShowGoalForm(false);
    setMaintenanceCalories("");
    setDailyLimit("");
    setTargetWeightLoss("");
    setTotalCaloriesToLose("");
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Calorie Goal</h3>
        <button
          onClick={() => setShowGoalForm(!showGoalForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          {calorieGoal ? "Edit Goal" : "Set Goal"}
        </button>
      </div>
      
      {calorieGoal && !showGoalForm && (
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span>Maintenance Calories:</span>
            <span className="font-medium">{formatNumber(calorieGoal.maintenanceCalories || 0)} calories</span>
          </div>
          <div className="flex justify-between">
            <span>Daily Target:</span>
            <span className="font-medium">{formatNumber(calorieGoal.dailyCalorieLimit)} calories</span>
          </div>
          <div className="flex justify-between">
            <span>Total Calories to Lose:</span>
            <span className="font-medium">{formatNumber(calorieGoal.totalCaloriesToLose)} calories</span>
          </div>
          <div className="flex justify-between">
            <span>Target Weight Loss:</span>
            <span className="font-medium">{calorieGoal.targetWeightLoss} kg/week</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Goal Set:</span>
            <span>{formatDate(calorieGoal.createdAt)}</span>
          </div>
        </div>
      )}
      
      {showGoalForm && (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Calories
            </label>
            <input
              type="number"
              step="1"
              placeholder="e.g. 1600"
              value={maintenanceCalories}
              onChange={(e) => setMaintenanceCalories(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Calories needed to maintain current weight
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Target Calories
            </label>
            <input
              type="number"
              step="1"
              placeholder="e.g. 1500"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Target calories to eat for weight loss
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Weight Loss (kg/week)
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 0.5"
              value={targetWeightLoss}
              onChange={(e) => setTargetWeightLoss(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Total Calories to Lose
            </label>
            <input
              type="number"
              step="1000"
              placeholder="e.g. 77000"
              value={totalCaloriesToLose}
              onChange={(e) => setTotalCaloriesToLose(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="md:col-span-2 bg-blue-50 p-3 rounded text-sm">
            <strong>Example:</strong> If your maintenance is 1600 calories and you eat 1500 calories, 
            you create a 100-calorie deficit that gets subtracted from your total goal.
          </div>
          
          <div className="md:col-span-2 flex gap-2">
            <button
              onClick={handleSaveGoal}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Save Goal
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
