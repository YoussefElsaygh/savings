"use client";

import { useState } from "react";
import {
  CalorieGoal,
  FoodEntry,
  ExerciseEntry,
  DailyCalorieData,
} from "@/types";
import {
  useCalorieGoalFirebase,
  useDailyCalorieDataFirebase,
} from "@/hooks/useFirebaseData";
import CalorieGoalSection from "@/components/calories/CalorieGoalSection";
import WeightLossJourneySection from "@/components/calories/WeightLossJourneySection";
import TodayProgressSection from "@/components/calories/TodayProgressSection";
import QuickActionsSection from "@/components/calories/QuickActionsSection";
import TodayActivitySection from "@/components/calories/TodayActivitySection";
import CalorieHistorySection from "@/components/calories/CalorieHistorySection";
import EditDayModal from "@/components/calories/EditDayModal";
import LoadingScreen from "@/components/shared/LoadingScreen";
import { Typography, Space } from "antd";

const { Title } = Typography;

export default function CaloriesPage() {
  // Firebase hooks for calorie goal and daily data
  const [
    calorieGoal,
    saveCalorieGoal,
    calorieGoalLoading,
    calorieGoalError,
    calorieGoalUser,
  ] = useCalorieGoalFirebase();
  const [
    dailyData,
    saveDailyData,
    dailyDataLoading,
    dailyDataError,
    dailyDataUser,
  ] = useDailyCalorieDataFirebase();

  // Use the user from either hook (they should be the same)
  const user = calorieGoalUser || dailyDataUser;

  // Edit Day Modal state
  const [editDayModalOpen, setEditDayModalOpen] = useState(false);
  const [dayToEdit, setDayToEdit] = useState<DailyCalorieData | null>(null);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    return new Intl.DateTimeFormat("en-CA").format(new Date());
  };

  // Ensure all daily data has exercise fields for backward compatibility
  const normalizeData = (data: DailyCalorieData[]): DailyCalorieData[] => {
    return data.map((day) => ({
      ...day,
      totalCaloriesBurned: day.totalCaloriesBurned || 0,
      exerciseEntries: day.exerciseEntries || [],
    }));
  };

  // Get today's data or create new one
  const getTodayData = (): DailyCalorieData => {
    const today = getTodayDate();
    const normalizedData = normalizeData(dailyData);
    const existingData = normalizedData.find((d) => d.date === today);

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
      const foodDeficit = calorieGoal.maintenanceCalories - day.totalCalories;
      const exerciseBonus = day.totalCaloriesBurned || 0;
      const totalDayDeficit = foodDeficit + exerciseBonus;
      return total + totalDayDeficit;
    }, 0);
  };

  const totalDeficitAchieved = getTotalDeficitAchieved();
  const remainingCaloriesToLose =
    (calorieGoal?.totalCaloriesToLose || 0) > 0
      ? Math.max(
          (calorieGoal?.totalCaloriesToLose || 0) - totalDeficitAchieved,
          0
        )
      : 0;

  const handleSaveGoal = async (newGoal: CalorieGoal) => {
    try {
      await saveCalorieGoal(newGoal);

      // Update existing daily data with new calorie limit
      const updatedDailyData = dailyData.map((day) => ({
        ...day,
        calorieLimit: newGoal.dailyCalorieLimit,
        remainingCalories: newGoal.dailyCalorieLimit - day.totalCalories,
      }));

      await saveDailyData(updatedDailyData);
    } catch (error) {
      console.error("Error saving calorie goal:", error);
    }
  };

  const handleModalAddFood = async (foodData: {
    name: string;
    calories: number;
    description: string;
  }) => {
    try {
      const today = getTodayDate();
      const newFoodEntry: FoodEntry = {
        id: Date.now().toString(),
        name: foodData.name,
        calories: foodData.calories,
        timestamp: new Date().toISOString(),
        date: today,
      };

      const existingDayIndex = dailyData.findIndex((d) => d.date === today);

      let updatedDailyData: DailyCalorieData[];

      if (existingDayIndex >= 0) {
        // Update existing day
        updatedDailyData = [...dailyData];
        const updatedDay = {
          ...updatedDailyData[existingDayIndex],
          // Ensure backward compatibility
          totalCaloriesBurned:
            updatedDailyData[existingDayIndex].totalCaloriesBurned || 0,
          exerciseEntries:
            updatedDailyData[existingDayIndex].exerciseEntries || [],
        };
        updatedDay.foodEntries = [...updatedDay.foodEntries, newFoodEntry];
        updatedDay.totalCalories += foodData.calories;
        updatedDay.remainingCalories =
          updatedDay.calorieLimit - updatedDay.totalCalories;
        updatedDailyData[existingDayIndex] = updatedDay;
      } else {
        // Create new day
        const newDayData: DailyCalorieData = {
          date: today,
          totalCalories: foodData.calories,
          totalCaloriesBurned: 0,
          foodEntries: [newFoodEntry],
          exerciseEntries: [],
          remainingCalories:
            (calorieGoal?.dailyCalorieLimit || 2000) - foodData.calories,
          calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
        };
        updatedDailyData = [newDayData, ...dailyData];
      }

      await saveDailyData(updatedDailyData);
    } catch (error) {
      console.error("Error adding food entry:", error);
    }
  };

  const handleModalAddFoods = async (
    foodsData: Array<{
      name: string;
      calories: number;
      description: string;
    }>
  ) => {
    try {
      const today = getTodayDate();
      const existingDayIndex = dailyData.findIndex((d) => d.date === today);

      // Create all food entries
      const newFoodEntries: FoodEntry[] = foodsData.map((foodData, index) => ({
        id: `${Date.now() + index}`,
        name: foodData.name,
        calories: foodData.calories,
        timestamp: new Date().toISOString(),
        date: today,
      }));

      const totalCaloriesFromFoods = foodsData.reduce(
        (sum, food) => sum + food.calories,
        0
      );

      let updatedDailyData: DailyCalorieData[];

      if (existingDayIndex >= 0) {
        // Update existing day
        updatedDailyData = [...dailyData];
        const updatedDay = {
          ...updatedDailyData[existingDayIndex],
          // Ensure backward compatibility
          totalCaloriesBurned:
            updatedDailyData[existingDayIndex].totalCaloriesBurned || 0,
          exerciseEntries:
            updatedDailyData[existingDayIndex].exerciseEntries || [],
        };
        updatedDay.foodEntries = [...updatedDay.foodEntries, ...newFoodEntries];
        updatedDay.totalCalories += totalCaloriesFromFoods;
        updatedDay.remainingCalories =
          updatedDay.calorieLimit - updatedDay.totalCalories;
        updatedDailyData[existingDayIndex] = updatedDay;
      } else {
        // Create new day
        const newDayData: DailyCalorieData = {
          date: today,
          totalCalories: totalCaloriesFromFoods,
          totalCaloriesBurned: 0,
          foodEntries: newFoodEntries,
          exerciseEntries: [],
          remainingCalories:
            (calorieGoal?.dailyCalorieLimit || 2000) - totalCaloriesFromFoods,
          calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
        };
        updatedDailyData = [newDayData, ...dailyData];
      }

      await saveDailyData(updatedDailyData);
    } catch (error) {
      console.error("Error adding food entries:", error);
    }
  };

  const handleModalAddExercise = async (exerciseData: {
    name: string;
    caloriesBurned: number;
    durationMinutes: number;
    description: string;
  }) => {
    try {
      const today = getTodayDate();
      const newExerciseEntry: ExerciseEntry = {
        id: Date.now().toString(),
        name: exerciseData.name,
        caloriesBurned: exerciseData.caloriesBurned,
        durationMinutes: exerciseData.durationMinutes,
        timestamp: new Date().toISOString(),
        date: today,
      };

      const existingDayIndex = dailyData.findIndex((d) => d.date === today);

      let updatedDailyData: DailyCalorieData[];

      if (existingDayIndex >= 0) {
        // Update existing day
        updatedDailyData = [...dailyData];
        const updatedDay = {
          ...updatedDailyData[existingDayIndex],
          // Ensure backward compatibility
          totalCaloriesBurned:
            updatedDailyData[existingDayIndex].totalCaloriesBurned || 0,
          exerciseEntries:
            updatedDailyData[existingDayIndex].exerciseEntries || [],
        };
        updatedDay.exerciseEntries = [
          ...updatedDay.exerciseEntries,
          newExerciseEntry,
        ];
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

      await saveDailyData(updatedDailyData);
    } catch (error) {
      console.error("Error adding exercise entry:", error);
    }
  };

  const handleModalAddExercises = async (
    exercisesData: Array<{
      name: string;
      caloriesBurned: number;
      durationMinutes: number;
      description: string;
    }>
  ) => {
    try {
      const today = getTodayDate();
      const existingDayIndex = dailyData.findIndex((d) => d.date === today);

      // Create all exercise entries
      const newExerciseEntries: ExerciseEntry[] = exercisesData.map(
        (exerciseData, index) => ({
          id: `${Date.now() + index}`,
          name: exerciseData.name,
          caloriesBurned: exerciseData.caloriesBurned,
          durationMinutes: exerciseData.durationMinutes,
          timestamp: new Date().toISOString(),
          date: today,
        })
      );

      const totalCaloriesBurned = exercisesData.reduce(
        (sum, ex) => sum + ex.caloriesBurned,
        0
      );

      let updatedDailyData: DailyCalorieData[];

      if (existingDayIndex >= 0) {
        // Update existing day
        updatedDailyData = [...dailyData];
        const updatedDay = {
          ...updatedDailyData[existingDayIndex],
          // Ensure backward compatibility
          totalCaloriesBurned:
            updatedDailyData[existingDayIndex].totalCaloriesBurned || 0,
          exerciseEntries:
            updatedDailyData[existingDayIndex].exerciseEntries || [],
        };
        updatedDay.exerciseEntries = [
          ...updatedDay.exerciseEntries,
          ...newExerciseEntries,
        ];
        updatedDay.totalCaloriesBurned += totalCaloriesBurned;
        updatedDailyData[existingDayIndex] = updatedDay;
      } else {
        // Create new day
        const newDayData: DailyCalorieData = {
          date: today,
          totalCalories: 0,
          totalCaloriesBurned,
          foodEntries: [],
          exerciseEntries: newExerciseEntries,
          remainingCalories: calorieGoal?.dailyCalorieLimit || 2000,
          calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
        };
        updatedDailyData = [newDayData, ...dailyData];
      }

      await saveDailyData(updatedDailyData);
    } catch (error) {
      console.error("Error adding exercise entries:", error);
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    try {
      const today = getTodayDate();
      const dayIndex = dailyData.findIndex((d) => d.date === today);

      if (dayIndex >= 0) {
        const updatedDailyData = [...dailyData];
        const dayData = { ...updatedDailyData[dayIndex] };
        const foodToDelete = dayData.foodEntries.find((f) => f.id === foodId);

        if (foodToDelete) {
          dayData.foodEntries = dayData.foodEntries.filter(
            (f) => f.id !== foodId
          );
          dayData.totalCalories -= foodToDelete.calories;
          dayData.remainingCalories =
            dayData.calorieLimit - dayData.totalCalories;
          updatedDailyData[dayIndex] = dayData;
          await saveDailyData(updatedDailyData);
        }
      }
    } catch (error) {
      console.error("Error deleting food entry:", error);
    }
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      const today = getTodayDate();
      const dayIndex = dailyData.findIndex((d) => d.date === today);

      if (dayIndex >= 0) {
        const updatedDailyData = [...dailyData];
        const dayData = {
          ...updatedDailyData[dayIndex],
          // Ensure backward compatibility
          totalCaloriesBurned:
            updatedDailyData[dayIndex].totalCaloriesBurned || 0,
          exerciseEntries: updatedDailyData[dayIndex].exerciseEntries || [],
        };
        const exerciseToDelete = dayData.exerciseEntries.find(
          (e) => e.id === exerciseId
        );

        if (exerciseToDelete) {
          dayData.exerciseEntries = dayData.exerciseEntries.filter(
            (e) => e.id !== exerciseId
          );
          dayData.totalCaloriesBurned -= exerciseToDelete.caloriesBurned;
          updatedDailyData[dayIndex] = dayData;
          await saveDailyData(updatedDailyData);
        }
      }
    } catch (error) {
      console.error("Error deleting exercise entry:", error);
    }
  };

  // Handle editing a specific day
  const handleEditDay = (date: string) => {
    const normalizedData = normalizeData(dailyData);
    let dayData = normalizedData.find((d) => d.date === date);

    // If day doesn't exist, create an empty entry
    if (!dayData) {
      dayData = {
        date,
        totalCalories: 0,
        totalCaloriesBurned: 0,
        foodEntries: [],
        exerciseEntries: [],
        remainingCalories: calorieGoal?.dailyCalorieLimit || 2000,
        calorieLimit: calorieGoal?.dailyCalorieLimit || 2000,
      };
    }

    setDayToEdit(dayData);
    setEditDayModalOpen(true);
  };

  // Handle updating a day's data after editing
  const handleUpdateDay = async (updatedDay: DailyCalorieData) => {
    try {
      const dayIndex = dailyData.findIndex((d) => d.date === updatedDay.date);

      if (dayIndex >= 0) {
        // Update existing day
        const updatedDailyData = [...dailyData];
        updatedDailyData[dayIndex] = updatedDay;
        await saveDailyData(updatedDailyData);
      } else {
        // Add new day (for previously empty days)
        const updatedDailyData = [updatedDay, ...dailyData];
        await saveDailyData(updatedDailyData);
      }
    } catch (error) {
      console.error("Error updating day data:", error);
    }
  };

  // Close edit day modal
  const handleCloseEditDayModal = () => {
    setEditDayModalOpen(false);
    setDayToEdit(null);
  };

  // Show loading state
  if (calorieGoalLoading || dailyDataLoading || !user) {
    return (
      <LoadingScreen
        tip={!user ? "Checking authentication..." : "Loading calorie data..."}
      />
    );
  }

  // Show error state (but not authentication errors)
  const isAuthError =
    (calorieGoalError && calorieGoalError.includes("sign in")) ||
    (dailyDataError && dailyDataError.includes("sign in"));

  if ((calorieGoalError || dailyDataError) && !isAuthError) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            backgroundColor: "#fff1f0",
            borderRadius: "8px",
            border: "1px solid #ffccc7",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#cf1322",
              marginBottom: "8px",
            }}
          >
            Connection Error
          </h2>
          <p style={{ color: "#cf1322", marginBottom: "16px" }}>
            {calorieGoalError || dailyDataError}
          </p>
          <p style={{ fontSize: "14px", color: "#8c8c8c" }}>
            Please check your internet connection and Firebase configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <div style={{ marginBottom: "32px" }}>
        <Title level={1} style={{ margin: 0, textAlign: "center" }}>
          Calorie Tracker
        </Title>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
          gap: "24px",
          maxWidth: "100%",
        }}
      >
        {/* Left Column - Goal & Progress */}
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}
        >
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
        </Space>

        {/* Right Column - Quick Actions & Today's Activity */}
        <Space
          direction="vertical"
          size="large"
          style={{ width: "100%", maxWidth: "100%", minWidth: 0 }}
        >
          <QuickActionsSection
            handleModalAddFood={handleModalAddFood}
            handleModalAddFoods={handleModalAddFoods}
            handleModalAddExercise={handleModalAddExercise}
            handleModalAddExercises={handleModalAddExercises}
          />

          <TodayActivitySection
            todayData={todayData}
            onDeleteFood={handleDeleteFood}
            onDeleteExercise={handleDeleteExercise}
          />
        </Space>
      </div>

      <CalorieHistorySection
        dailyData={dailyData}
        calorieGoal={calorieGoal}
        normalizeData={normalizeData}
        getTotalDeficitAchieved={getTotalDeficitAchieved}
        getTodayDate={getTodayDate}
        onEditDay={handleEditDay}
      />

      {/* Edit Day Modal */}
      {dayToEdit && (
        <EditDayModal
          isOpen={editDayModalOpen}
          onClose={handleCloseEditDayModal}
          dayData={dayToEdit}
          calorieGoal={calorieGoal}
          onUpdateDay={handleUpdateDay}
        />
      )}
    </div>
  );
}
