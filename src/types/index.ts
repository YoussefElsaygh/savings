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
  // Preset food tracking (optional fields for backwards compatibility)
  isPreset?: boolean;
  presetFoodId?: string;
  presetFoodName?: string; // Store original preset name
  quantity?: number;
  unit?: "pieces" | "grams" | "ml";
  caloriesPerUnit?: number; // Store for recalculation
  unitType?: "piece" | "100g" | "100ml"; // Original unit type from preset
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

// Workout Tracker Types
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "core"
  | "cardio"
  | "full-body";

export type EquipmentType =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "bodyweight"
  | "cable"
  | "kettlebell"
  | "resistance-band";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment: EquipmentType[];
  gifUrl: string; // URL to exercise GIF
  description: string;
  tips: string[];
  alternatives: string[]; // Array of alternative exercise IDs
}

export interface WorkoutSet {
  id: string;
  reps: number;
  weight: number; // in kg
  completed: boolean;
  restTime?: number; // seconds
  notes?: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  targetSets: number;
  targetReps: number;
  order: number; // Exercise order in workout
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  level: ExperienceLevel;
  daysPerWeek: 2 | 3 | 4;
  dayName: string; // e.g., "Day 1: Push", "Day 2: Pull"
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface WorkoutSession {
  id: string;
  planId?: string;
  planName?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // ISO timestamp
  endTime?: string; // ISO timestamp
  exercises: WorkoutExercise[];
  totalVolume: number; // sum of (sets × reps × weight)
  duration?: number; // minutes
  notes?: string;
  completed: boolean;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  weight: number; // kg
  reps: number;
  date: string; // YYYY-MM-DD
  timestamp: string; // ISO timestamp
}

export type EquipmentPreference =
  | "free-weights"
  | "machines"
  | "mixed"
  | "bodyweight";

export interface WorkoutPreferences {
  daysPerWeek: 2 | 3 | 4;
  experienceLevel: ExperienceLevel;
  equipmentPreference: EquipmentPreference;
  goals?: string[]; // e.g., ["strength", "hypertrophy", "endurance"]
  createdAt: string;
  updatedAt: string;
}
