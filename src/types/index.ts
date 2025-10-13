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
  dailyCalorieLimit: number; // target calories to eat for weight loss/gain
  targetWeightLoss: number; // kg per week (calculated: targetWeightChange / targetWeeks)
  totalCaloriesToLose: number; // total calories to lose (e.g., 77,000)
  createdAt: string;
  // Personal data for calculator
  age?: number;
  weight?: number; // kg
  height?: number; // cm
  gender?: "male" | "female";
  bodyFat?: number; // percentage
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal?: "lose" | "maintain" | "gain";
  targetWeightChange?: number; // total kg to lose/gain
  targetWeeks?: number; // weeks to reach goal
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
  | "gold21-chart";

export function isTabType(value: unknown): value is TabType {
  return [
    "edit",
    "calculate",
    "quantity-history",
    "history",
    "gold21-chart",
  ].includes(value as TabType);
}

// Spending Tracker Types
export interface SpendingCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO timestamp
}

export interface MonthlySpending {
  month: string; // YYYY-MM format
  expenses: Expense[];
  totalSpent: number;
  categoryTotals: Record<string, number>; // category -> total amount
}

export interface SpendingData {
  monthlyData: MonthlySpending[];
}
