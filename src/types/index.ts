export interface SavingsData {
  usdAmount: number;
  egpAmount: number;
  gold18Amount: number;
  gold21Amount: number;
  gold24Amount: number;
}

export interface RateEntry {
  id: string;
  timestamp: string;
  usdRate: number;
  gold18Rate: number;
  gold21Rate: number;
  gold24Rate: number;
  gold18Amount: number;
  gold21Amount: number;
  gold24Amount: number;
  egpAmount: number;
  usdAmount: number;
  sum: number;
}

export interface CalorieGoal {
  maintenanceCalories: number; // calories needed to maintain current weight
  dailyCalorieLimit: number; // target calories to eat for weight loss
  targetWeightLoss: number; // kg per week
  totalCaloriesToLose: number; // total calories to lose (e.g., 77,000)
  createdAt: string;
}

export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  timestamp: string;
  date: string; // YYYY-MM-DD format for grouping
}

export interface ExerciseEntry {
  id: string;
  name: string;
  caloriesBurned: number;
  durationMinutes: number;
  timestamp: string;
  date: string; // YYYY-MM-DD format for grouping
}

export interface DailyCalorieData {
  date: string; // YYYY-MM-DD format
  totalCalories: number;
  totalCaloriesBurned: number;
  foodEntries: FoodEntry[];
  exerciseEntries: ExerciseEntry[];
  remainingCalories: number;
  calorieLimit: number;
}

export type TabType =
  | "edit"
  | "calculate"
  | "quantity-history"
  | "history"
  | "gold21-chart"
  | "calories";

export function isTabType(value: unknown): value is TabType {
  return [
    "edit",
    "calculate",
    "quantity-history",
    "history",
    "gold21-chart",
    "calories",
  ].includes(value as TabType);
}
