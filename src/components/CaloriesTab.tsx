"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { CalorieGoal, FoodEntry, ExerciseEntry, DailyCalorieData } from "@/types";
import { STORAGE_KEYS } from "@/constants/localStorage";
import { FOOD_CATEGORIES, getFoodsByCategory, calculateCalories, type FoodConstant } from "@/constants/foods";
import { EXERCISE_CATEGORIES, getExercisesByCategory, calculateCaloriesBurned, COMMON_DURATIONS, type ExerciseConstant } from "@/constants/exercises";
import { formatNumber, formatDate } from "@/lib/utils";

export default function CaloriesTab() {
  // localStorage for calorie goal and daily data
  const [calorieGoal, setCalorieGoal, calorieGoalLoaded] = useLocalStorage<CalorieGoal | null>(
    STORAGE_KEYS.CALORIE_GOAL,
    null
  );
  const [dailyData, setDailyData, dailyDataLoaded] = useLocalStorage<DailyCalorieData[]>(
    STORAGE_KEYS.DAILY_CALORIE_DATA,
    []
  );

  // Form states
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [maintenanceCalories, setMaintenanceCalories] = useState("");
  const [dailyLimit, setDailyLimit] = useState("");
  const [targetWeightLoss, setTargetWeightLoss] = useState("");
  const [totalCaloriesToLose, setTotalCaloriesToLose] = useState("");
  
  // Entry mode state
  const [mainEntryMode, setMainEntryMode] = useState<'food' | 'exercise'>('food');

  // Food entry states
  const [foodEntryMode, setFoodEntryMode] = useState<'preset' | 'custom'>('preset');
  const [selectedFood, setSelectedFood] = useState<FoodConstant | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<'pieces' | 'grams' | 'ml'>('grams');
  const [customFoodName, setCustomFoodName] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  
  // Exercise entry states
  const [exerciseEntryMode, setExerciseEntryMode] = useState<'preset' | 'custom'>('preset');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseConstant | null>(null);
  const [duration, setDuration] = useState("");
  const [customExerciseName, setCustomExerciseName] = useState("");
  const [customCaloriesBurned, setCustomCaloriesBurned] = useState("");
  const [calculatedCaloriesBurned, setCalculatedCaloriesBurned] = useState(0);
  
  const foodsByCategory = getFoodsByCategory();
  const exercisesByCategory = getExercisesByCategory();
  
  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };



  // Get today's data or create new one
  const getTodayData = (): DailyCalorieData => {
    const today = getTodayDate();
    const existingData = dailyData.find(d => d.date === today);
    
    if (existingData) {
      // Ensure backward compatibility for existing data
      return {
        ...existingData,
        totalCaloriesBurned: existingData.totalCaloriesBurned || 0,
        exerciseEntries: existingData.exerciseEntries || [],
      };
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

  // Initialize goal form when editing
  useEffect(() => {
    if (calorieGoal && showGoalForm) {
      setMaintenanceCalories(calorieGoal.maintenanceCalories?.toString() || "");
      setDailyLimit(calorieGoal.dailyCalorieLimit.toString());
      setTargetWeightLoss(calorieGoal.targetWeightLoss.toString());
      setTotalCaloriesToLose(calorieGoal.totalCaloriesToLose?.toString() || "");
    }
  }, [calorieGoal, showGoalForm]);

  // Calculate total deficit achieved so far
  const getTotalDeficitAchieved = () => {
    if (!calorieGoal?.maintenanceCalories) return 0;
    
    return dailyData.reduce((total, day) => {
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
      
      setCalorieGoal(newGoal);
      
      // Update existing daily data with new calorie limit
      const updatedDailyData = dailyData.map(day => ({
        ...day,
        calorieLimit: limit,
        remainingCalories: limit - day.totalCalories,
      }));
      
      setDailyData(updatedDailyData);
      setShowGoalForm(false);
      setMaintenanceCalories("");
      setDailyLimit("");
      setTargetWeightLoss("");
      setTotalCaloriesToLose("");
    }
  };

  // Set appropriate unit when food is selected
  useEffect(() => {
    if (selectedFood) {
      // Auto-set unit based on food type
      if (selectedFood.unitType === 'piece') {
        setUnit('pieces');
      } else if (selectedFood.unitType === '100g') {
        setUnit('grams');
      } else if (selectedFood.unitType === '100ml') {
        setUnit('ml');
      }
    }
  }, [selectedFood]);

  // Calculate calories when preset food selection changes
  useEffect(() => {
    if (foodEntryMode === 'preset' && selectedFood && quantity) {
      const qty = parseFloat(quantity);
      if (qty > 0) {
        const calories = calculateCalories(selectedFood, qty, unit);
        setCalculatedCalories(Math.round(calories));
      } else {
        setCalculatedCalories(0);
      }
    } else {
      setCalculatedCalories(0);
    }
  }, [selectedFood, quantity, unit, foodEntryMode]);

  // Calculate calories burned when preset exercise selection changes
  useEffect(() => {
    if (exerciseEntryMode === 'preset' && selectedExercise && duration) {
      const durationNum = parseFloat(duration);
      if (durationNum > 0) {
        const caloriesBurned = calculateCaloriesBurned(selectedExercise, durationNum);
        setCalculatedCaloriesBurned(Math.round(caloriesBurned));
      } else {
        setCalculatedCaloriesBurned(0);
      }
    } else {
      setCalculatedCaloriesBurned(0);
    }
  }, [selectedExercise, duration, exerciseEntryMode]);

  const handleAddFood = () => {
    let calories: number;
    let name: string;
    let description: string;
    
    if (foodEntryMode === 'preset' && selectedFood && quantity) {
      const qty = parseFloat(quantity);
      if (qty > 0) {
        calories = calculateCalories(selectedFood, qty, unit);
        name = selectedFood.name;
        description = `${qty} ${
          unit === 'pieces' ? (qty === 1 ? 'piece' : 'pieces') : 
          unit === 'ml' ? 'ml' : 'g'
        }`;
      } else {
        return;
      }
    } else if (foodEntryMode === 'custom') {
      const customCals = parseFloat(customCalories);
      const customName = customFoodName.trim();
      if (!customName || customCals <= 0) {
        return;
      }
      calories = customCals;
      name = customName;
      description = 'custom entry';
    } else {
      return;
    }
    
    if (calories > 0) {
      const newFoodEntry: FoodEntry = {
        id: Date.now().toString(),
        name: `${name} (${description})`,
        calories: Math.round(calories),
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
        updatedDay.totalCalories += calories;
        updatedDay.remainingCalories = updatedDay.calorieLimit - updatedDay.totalCalories;
        updatedDailyData[existingDayIndex] = updatedDay;
      } else {
        // Create new day
        const newDayData: DailyCalorieData = {
          date: today,
          totalCalories: calories,
          totalCaloriesBurned: 0,
          foodEntries: [newFoodEntry],
          exerciseEntries: [],
          remainingCalories: (calorieGoal?.dailyCalorieLimit || 2000) - calories,
          calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
        };
        updatedDailyData = [newDayData, ...dailyData];
      }
      
      setDailyData(updatedDailyData);
      
      // Reset form
      setQuantity("");
      setCustomFoodName("");
      setCustomCalories("");
      setSelectedFood(null);
      setCalculatedCalories(0);
    }
  };

  const handleAddExercise = () => {
    let caloriesBurned: number;
    let name: string;
    let durationMins: number;
    let description: string;
    
    if (exerciseEntryMode === 'preset' && selectedExercise && duration) {
      const durationNum = parseFloat(duration);
      if (durationNum > 0) {
        caloriesBurned = calculateCaloriesBurned(selectedExercise, durationNum);
        name = selectedExercise.name;
        durationMins = durationNum;
        description = `${durationNum} min`;
      } else {
        return;
      }
    } else if (exerciseEntryMode === 'custom') {
      const customBurned = parseFloat(customCaloriesBurned);
      const customName = customExerciseName.trim();
      const durationNum = parseFloat(duration);
      if (!customName || customBurned <= 0 || durationNum <= 0) {
        return;
      }
      caloriesBurned = customBurned;
      name = customName;
      durationMins = durationNum;
      description = 'custom entry';
    } else {
      return;
    }
    
    if (caloriesBurned > 0) {
      const newExerciseEntry: ExerciseEntry = {
        id: Date.now().toString(),
        name: `${name} (${description})`,
        caloriesBurned: Math.round(caloriesBurned),
        durationMinutes: durationMins,
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
        updatedDay.totalCaloriesBurned += caloriesBurned;
        updatedDailyData[existingDayIndex] = updatedDay;
      } else {
        // Create new day
        const newDayData: DailyCalorieData = {
          date: today,
          totalCalories: 0,
          totalCaloriesBurned: caloriesBurned,
          foodEntries: [],
          exerciseEntries: [newExerciseEntry],
          remainingCalories: calorieGoal?.dailyCalorieLimit || 2000,
          calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
        };
        updatedDailyData = [newDayData, ...dailyData];
      }
      
      setDailyData(updatedDailyData);
      
      // Reset form
      setDuration("");
      setCustomExerciseName("");
      setCustomCaloriesBurned("");
      setSelectedExercise(null);
      setCalculatedCaloriesBurned(0);
    }
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
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Calorie Tracker</h2>
      
      {/* Calorie Goal Section */}
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
                onClick={() => {
                  setShowGoalForm(false);
                  setMaintenanceCalories("");
                  setDailyLimit("");
                  setTargetWeightLoss("");
                  setTotalCaloriesToLose("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Goal Progress */}
      {calorieGoal && calorieGoal.totalCaloriesToLose && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
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
      )}

      {/* Today's Progress */}
      {calorieGoal && (
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
      )}


      {/* Add Food/Exercise Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-bold mb-4">Add Entry</h3>
        
        {/* Main Entry Mode Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMainEntryMode('food')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              mainEntryMode === 'food'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🍎 Food
          </button>
          <button
            onClick={() => setMainEntryMode('exercise')}
            className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
              mainEntryMode === 'exercise'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🏃 Exercise
          </button>
        </div>

        {/* Food Entry Mode */}
        {mainEntryMode === 'food' && (
          <div>
            {/* Food Entry Type Selection */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setFoodEntryMode('preset')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  foodEntryMode === 'preset'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Preset Foods
              </button>
              <button
                onClick={() => setFoodEntryMode('custom')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  foodEntryMode === 'custom'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Custom Entry
              </button>
            </div>

            {/* Preset Foods Mode */}
            {foodEntryMode === 'preset' && (
          <div className="space-y-4">
            {/* Food Categories */}
            <div className="space-y-4">
              {Object.entries(foodsByCategory).map(([category, foods]) => (
                <div key={category} className={`border rounded-lg p-4 ${FOOD_CATEGORIES[category as keyof typeof FOOD_CATEGORIES].color}`}>
                  <h4 className="font-medium mb-3">{FOOD_CATEGORIES[category as keyof typeof FOOD_CATEGORIES].name}</h4>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {foods.map((food) => (
                      <button
                        key={food.id}
                        onClick={() => setSelectedFood(food)}
                        className={`text-left p-3 rounded border transition-colors ${
                          selectedFood?.id === food.id
                            ? 'bg-green-100 border-green-300'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{food.name}</div>
                        <div className="text-xs text-gray-600">
                          {food.caloriesPerUnit} cal/{food.unitType}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {food.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quantity Input */}
            {selectedFood && (
              <div className="bg-white border rounded-lg p-4">
                <h4 className="font-medium mb-3">Selected: {selectedFood.name}</h4>
                
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      placeholder="e.g. 1, 150, etc."
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as 'pieces' | 'grams' | 'ml')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="grams">Grams</option>
                      <option value="pieces">Pieces</option>
                      <option value="ml">Milliliters (ml)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calculated Calories
                    </label>
                    <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md font-medium text-green-700">
                      {calculatedCalories} calories
                    </div>
                  </div>
                </div>
              </div>
            )}
              </div>
            )}

            {/* Custom Food Entry Mode */}
            {foodEntryMode === 'custom' && (
          <div className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Name
              </label>
              <input
                type="text"
                placeholder="e.g. Homemade pasta, Restaurant meal, etc."
                value={customFoodName}
                onChange={(e) => setCustomFoodName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calories
              </label>
              <input
                type="number"
                step="1"
                min="0"
                placeholder="e.g. 250"
                value={customCalories}
                onChange={(e) => setCustomCalories(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
              </div>
            )}
            
            <button
              onClick={handleAddFood}
              disabled={
                (foodEntryMode === 'preset' && (!selectedFood || !quantity || parseFloat(quantity) <= 0)) ||
                (foodEntryMode === 'custom' && (!customFoodName.trim() || !customCalories || parseFloat(customCalories) <= 0))
              }
              className="mt-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
            >
              Add Food
            </button>
          </div>
        )}

        {/* Exercise Entry Mode */}
        {mainEntryMode === 'exercise' && (
          <div>
            {/* Exercise Entry Type Selection */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setExerciseEntryMode('preset')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  exerciseEntryMode === 'preset'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Preset Exercises
              </button>
              <button
                onClick={() => setExerciseEntryMode('custom')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  exerciseEntryMode === 'custom'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Custom Entry
              </button>
            </div>

            {/* Preset Exercises Mode */}
            {exerciseEntryMode === 'preset' && (
              <div className="space-y-4">
                {/* Exercise Categories */}
                <div className="space-y-4">
                  {Object.entries(exercisesByCategory).map(([category, exercises]) => (
                    <div key={category} className={`border rounded-lg p-4 ${EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES].color}`}>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <span>{EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES].icon}</span>
                        {EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES].name}
                      </h4>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {exercises.map((exercise) => (
                          <button
                            key={exercise.id}
                            onClick={() => setSelectedExercise(exercise)}
                            className={`text-left p-3 rounded border transition-colors ${
                              selectedExercise?.id === exercise.id
                                ? 'bg-orange-100 border-orange-300'
                                : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="font-medium text-sm">{exercise.name}</div>
                            <div className="text-xs text-gray-600">
                              {exercise.caloriesPerHour} cal/hour
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              <span className={`font-medium ${exercise.intensityLevel === 'high' ? 'text-red-600' : exercise.intensityLevel === 'moderate' ? 'text-yellow-600' : 'text-green-600'}`}>
                                {exercise.intensityLevel}
                              </span>
                              • {exercise.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Duration Input */}
                {selectedExercise && (
                  <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-3">Selected: {selectedExercise.name}</h4>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="1"
                          placeholder="e.g. 30, 60, 90"
                          value={duration}
                          onChange={(e) => setDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        {/* Quick Duration Buttons */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {COMMON_DURATIONS.map((dur) => (
                            <button
                              key={dur.value}
                              type="button"
                              onClick={() => setDuration(dur.value.toString())}
                              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded border"
                            >
                              {dur.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Intensity
                        </label>
                        <div className={`px-3 py-2 border rounded-md text-center ${
                          selectedExercise.intensityLevel === 'high' ? 'bg-red-50 border-red-200 text-red-700' :
                          selectedExercise.intensityLevel === 'moderate' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                          'bg-green-50 border-green-200 text-green-700'
                        }`}>
                          {selectedExercise.intensityLevel.toUpperCase()}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Calculated Calories Burned
                        </label>
                        <div className="px-3 py-2 bg-orange-50 border border-orange-200 rounded-md font-medium text-orange-700">
                          {calculatedCaloriesBurned} calories
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Custom Exercise Entry Mode */}
            {exerciseEntryMode === 'custom' && (
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Swimming, Dancing, etc."
                    value={customExerciseName}
                    onChange={(e) => setCustomExerciseName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    placeholder="e.g. 30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Calories Burned
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    placeholder="e.g. 300"
                    value={customCaloriesBurned}
                    onChange={(e) => setCustomCaloriesBurned(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            <button
              onClick={handleAddExercise}
              disabled={
                (exerciseEntryMode === 'preset' && (!selectedExercise || !duration || parseFloat(duration) <= 0)) ||
                (exerciseEntryMode === 'custom' && (!customExerciseName.trim() || !customCaloriesBurned || parseFloat(customCaloriesBurned) <= 0 || !duration || parseFloat(duration) <= 0))
              }
              className="mt-4 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
            >
              Add Exercise
            </button>
          </div>
        )}
      </div>

      {/* Today's Food & Exercise Entries */}
      {(todayData.foodEntries.length > 0 || (todayData.exerciseEntries && todayData.exerciseEntries.length > 0)) && (
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
                      onClick={() => handleDeleteFood(entry.id)}
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
                      onClick={() => handleDeleteExercise(entry.id)}
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
      )}

      {/* Calorie Consumption History */}
      {dailyData.length > 0 && (
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
                {dailyData.filter(day => calorieGoal?.maintenanceCalories && day.totalCalories < calorieGoal.maintenanceCalories).length}
              </div>
              <div className="text-sm text-gray-600">Deficit Days</div>
            </div>
            <div className="text-2xl font-bold text-purple-600 text-center">
              <div>{formatNumber(getTotalDeficitAchieved())}</div>
              <div className="text-sm text-gray-600">Total Deficit</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dailyData.reduce((sum, day) => sum + day.foodEntries.length + (day.exerciseEntries?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">Total Activities</div>
            </div>
          </div>

          {/* Daily History List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dailyData
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((day, index) => {
              const isToday = day.date === getTodayDate();
              const foodDeficit = calorieGoal?.maintenanceCalories 
                ? Math.max(calorieGoal.maintenanceCalories - day.totalCalories, 0) 
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
                        {totalDayDeficit > 0 ? `${formatNumber(totalDayDeficit)} deficit` : 'No deficit'}
                      </div>
                      {exerciseBonus > 0 && (
                        <div className="text-xs text-orange-600">
                          +{formatNumber(exerciseBonus)} from exercise
                        </div>
                      )}
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
      )}
    </div>
  );
}
