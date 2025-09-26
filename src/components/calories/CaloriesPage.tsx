"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CalorieGoal, FoodEntry, ExerciseEntry, DailyCalorieData } from "@/types";
import { STORAGE_KEYS } from "@/constants/localStorage";
import CalorieGoalSection from "@/components/calories/CalorieGoalSection";
import WeightLossJourneySection from "@/components/calories/WeightLossJourneySection";
import TodayProgressSection from "@/components/calories/TodayProgressSection";
import QuickActionsSection from "@/components/calories/QuickActionsSection";
import TodayActivitySection from "@/components/calories/TodayActivitySection";
import CalorieHistorySection from "@/components/calories/CalorieHistorySection";
import AddFoodModal from "./AddFoodModal";

export default function CaloriesPage() {
  // localStorage for calorie goal and daily data
  const [calorieGoal, setCalorieGoal, calorieGoalLoaded] = useLocalStorage<CalorieGoal | null>(
    STORAGE_KEYS.CALORIE_GOAL,
    null
  );
  const [dailyData, setDailyData, dailyDataLoaded] = useLocalStorage<DailyCalorieData[]>(
    STORAGE_KEYS.DAILY_CALORIE_DATA,
    []
  );

  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Intl.DateTimeFormat('en-CA').format(new Date());
  };

  // Ensure all daily data has exercise fields for backward compatibility
  const normalizeData = (data: DailyCalorieData[]): DailyCalorieData[] => {
    return data.map(day => ({
      ...day,
      totalCaloriesBurned: day.totalCaloriesBurned || 0,
      exerciseEntries: day.exerciseEntries || [],
    }));
  };

  // Get today's data or create new one
  const getTodayData = (): DailyCalorieData => {
    const today = getTodayDate();
    const normalizedData = normalizeData(dailyData);
    const existingData = normalizedData.find(d => d.date === today);
    
    if (existingData) {
      return existingData;
    }
    
    // Create new day data
    const newDayData: DailyCalorieData = {
      date: today,
      totalCalories: 0,
      totalCaloriesBurned: 0,
      foodEntries: [],
      exerciseEntries: [],
      remainingCalories: calorieGoal?.dailyCalorieLimit || 2000,
      calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
    };
    
    return newDayData;
  };

  const todayData = getTodayData();

  // Calculate total deficit achieved so far
  const getTotalDeficitAchieved = () => {
    if (!calorieGoal?.maintenanceCalories) return 0;
    
    const normalizedData = normalizeData(dailyData);
    return normalizedData.reduce((total, day) => {
      // Deficit = (maintenance calories - calories consumed) + calories burned from exercise
      const foodDeficit = Math.max(calorieGoal.maintenanceCalories - day.totalCalories, 0);
      const exerciseBonus = day.totalCaloriesBurned || 0;
      const totalDayDeficit = foodDeficit + exerciseBonus;
      return total + totalDayDeficit;
    }, 0);
  };

  const totalDeficitAchieved = getTotalDeficitAchieved();
  const remainingCaloriesToLose = (calorieGoal?.totalCaloriesToLose || 0) > 0
    ? Math.max((calorieGoal?.totalCaloriesToLose || 0) - totalDeficitAchieved, 0) 
    : 0;

  const handleSaveGoal = (newGoal: CalorieGoal) => {
    setCalorieGoal(newGoal);
    
    // Update existing daily data with new calorie limit
    const updatedDailyData = dailyData.map(day => ({
      ...day,
      calorieLimit: newGoal.dailyCalorieLimit,
      remainingCalories: newGoal.dailyCalorieLimit - day.totalCalories,
    }));
    
    setDailyData(updatedDailyData);
  };

  const handleModalAddFood = (foodData: { name: string; calories: number; description: string }) => {
    const newFoodEntry: FoodEntry = {
      id: Date.now().toString(),
      name: foodData.name,
      calories: foodData.calories,
      timestamp: new Date().toISOString(),
      date: getTodayDate(),
    };
    
    const today = getTodayDate();
    const existingDayIndex = dailyData.findIndex(d => d.date === today);
    
    let updatedDailyData: DailyCalorieData[];
    
    if (existingDayIndex >= 0) {
      // Update existing day
      updatedDailyData = [...dailyData];
      const updatedDay = { 
        ...updatedDailyData[existingDayIndex],
        // Ensure backward compatibility
        totalCaloriesBurned: updatedDailyData[existingDayIndex].totalCaloriesBurned || 0,
        exerciseEntries: updatedDailyData[existingDayIndex].exerciseEntries || [],
      };
      updatedDay.foodEntries = [...updatedDay.foodEntries, newFoodEntry];
      updatedDay.totalCalories += foodData.calories;
      updatedDay.remainingCalories = updatedDay.calorieLimit - updatedDay.totalCalories;
      updatedDailyData[existingDayIndex] = updatedDay;
    } else {
      // Create new day
      const newDayData: DailyCalorieData = {
        date: today,
        totalCalories: foodData.calories,
        totalCaloriesBurned: 0,
        foodEntries: [newFoodEntry],
        exerciseEntries: [],
        remainingCalories: (calorieGoal?.dailyCalorieLimit || 2000) - foodData.calories,
        calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
      };
      updatedDailyData = [newDayData, ...dailyData];
    }
    
    setDailyData(updatedDailyData);
  };

  const handleModalAddExercise = (exerciseData: { name: string; caloriesBurned: number; durationMinutes: number; description: string }) => {
    const newExerciseEntry: ExerciseEntry = {
      id: Date.now().toString(),
      name: exerciseData.name,
      caloriesBurned: exerciseData.caloriesBurned,
      durationMinutes: exerciseData.durationMinutes,
      timestamp: new Date().toISOString(),
      date: getTodayDate(),
    };
    
    const today = getTodayDate();
    const existingDayIndex = dailyData.findIndex(d => d.date === today);
    
    let updatedDailyData: DailyCalorieData[];
    
    if (existingDayIndex >= 0) {
      // Update existing day
      updatedDailyData = [...dailyData];
      const updatedDay = { 
        ...updatedDailyData[existingDayIndex],
        // Ensure backward compatibility
        totalCaloriesBurned: (updatedDailyData[existingDayIndex].totalCaloriesBurned || 0),
        exerciseEntries: updatedDailyData[existingDayIndex].exerciseEntries || [],
      };
      updatedDay.exerciseEntries = [...updatedDay.exerciseEntries, newExerciseEntry];
      updatedDay.totalCaloriesBurned += exerciseData.caloriesBurned;
      updatedDailyData[existingDayIndex] = updatedDay;
    } else {
      // Create new day
      const newDayData: DailyCalorieData = {
        date: today,
        totalCalories: 0,
        totalCaloriesBurned: exerciseData.caloriesBurned,
        foodEntries: [],
        exerciseEntries: [newExerciseEntry],
        remainingCalories: calorieGoal?.dailyCalorieLimit || 2000,
        calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
      };
      updatedDailyData = [newDayData, ...dailyData];
    }
    
    setDailyData(updatedDailyData);
  };

  const handleDeleteFood = (foodId: string) => {
    const today = getTodayDate();
    const dayIndex = dailyData.findIndex(d => d.date === today);
    
    if (dayIndex >= 0) {
      const updatedDailyData = [...dailyData];
      const dayData = { ...updatedDailyData[dayIndex] };
      const foodToDelete = dayData.foodEntries.find(f => f.id === foodId);
      
      if (foodToDelete) {
        dayData.foodEntries = dayData.foodEntries.filter(f => f.id !== foodId);
        dayData.totalCalories -= foodToDelete.calories;
        dayData.remainingCalories = dayData.calorieLimit - dayData.totalCalories;
        updatedDailyData[dayIndex] = dayData;
        setDailyData(updatedDailyData);
      }
    }
  };

  const handleDeleteExercise = (exerciseId: string) => {
    const today = getTodayDate();
    const dayIndex = dailyData.findIndex(d => d.date === today);
    
    if (dayIndex >= 0) {
      const updatedDailyData = [...dailyData];
      const dayData = { 
        ...updatedDailyData[dayIndex],
        // Ensure backward compatibility
        totalCaloriesBurned: updatedDailyData[dayIndex].totalCaloriesBurned || 0,
        exerciseEntries: updatedDailyData[dayIndex].exerciseEntries || [],
      };
      const exerciseToDelete = dayData.exerciseEntries.find(e => e.id === exerciseId);
      
      if (exerciseToDelete) {
        dayData.exerciseEntries = dayData.exerciseEntries.filter(e => e.id !== exerciseId);
        dayData.totalCaloriesBurned -= exerciseToDelete.caloriesBurned;
        updatedDailyData[dayIndex] = dayData;
        setDailyData(updatedDailyData);
      }
    }
  };

  if (!calorieGoalLoaded || !dailyDataLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Calorie Tracker</h1>
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column - Goal & Progress */}
        <div className="space-y-6">
          <CalorieGoalSection 
            calorieGoal={calorieGoal}
            onSaveGoal={handleSaveGoal}
          />
          
          {calorieGoal && (
            <WeightLossJourneySection 
              calorieGoal={calorieGoal}
              totalDeficitAchieved={totalDeficitAchieved}
              remainingCaloriesToLose={remainingCaloriesToLose}
            />
          )}
          
          <TodayProgressSection 
            calorieGoal={calorieGoal}
            todayData={todayData}
          />
        </div>

        {/* Right Column - Quick Actions & Today's Activity */}
        <div className="space-y-6">
          <QuickActionsSection 
          handleModalAddFood={handleModalAddFood}
          handleModalAddExercise={handleModalAddExercise}
          />

          <TodayActivitySection 
            todayData={todayData}
            onDeleteFood={handleDeleteFood}
            onDeleteExercise={handleDeleteExercise}
          />
        </div>
      </div>

      <CalorieHistorySection 
        dailyData={dailyData}
        calorieGoal={calorieGoal}
        normalizeData={normalizeData}
        getTotalDeficitAchieved={getTotalDeficitAchieved}
        getTodayDate={getTodayDate}
      />

    
    </div>
  );
}