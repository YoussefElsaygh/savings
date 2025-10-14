import { WorkoutPlan, WorkoutExercise } from "@/types";

// Helper to create workout exercise template
const createWorkoutExercise = (
  exerciseId: string,
  exerciseName: string,
  sets: number,
  reps: number,
  order: number
): WorkoutExercise => ({
  exerciseId,
  exerciseName,
  targetSets: sets,
  targetReps: reps,
  order,
  sets: [],
});

// 2 DAYS PER WEEK PLANS - Full Body Split
export const TWO_DAY_INTERMEDIATE: WorkoutPlan[] = [
  {
    id: "2day-int-day1",
    name: "2-Day Full Body A",
    description: "Full body workout focusing on major compounds",
    level: "intermediate",
    daysPerWeek: 2,
    dayName: "Day 1: Full Body A",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("barbell-squat", "Barbell Back Squat", 4, 8, 1),
      createWorkoutExercise("bench-press", "Barbell Bench Press", 4, 8, 2),
      createWorkoutExercise("barbell-row", "Barbell Bent-Over Row", 4, 10, 3),
      createWorkoutExercise(
        "overhead-press",
        "Barbell Overhead Press",
        3,
        10,
        4
      ),
      createWorkoutExercise("romanian-deadlift", "Romanian Deadlift", 3, 10, 5),
      createWorkoutExercise("barbell-curl", "Barbell Bicep Curl", 3, 12, 6),
      createWorkoutExercise("plank", "Plank", 3, 60, 7), // 60 seconds
    ] as WorkoutExercise[],
  },
  {
    id: "2day-int-day2",
    name: "2-Day Full Body B",
    description: "Full body workout with variation",
    level: "intermediate",
    daysPerWeek: 2,
    dayName: "Day 2: Full Body B",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("deadlift", "Barbell Deadlift", 4, 6, 1),
      createWorkoutExercise(
        "incline-dumbbell-press",
        "Incline Dumbbell Press",
        4,
        10,
        2
      ),
      createWorkoutExercise("pull-ups", "Pull-Ups", 4, 8, 3),
      createWorkoutExercise(
        "lateral-raise",
        "Dumbbell Lateral Raise",
        3,
        12,
        4
      ),
      createWorkoutExercise("lunges", "Dumbbell Lunges", 3, 12, 5),
      createWorkoutExercise("tricep-dips", "Tricep Dips", 3, 12, 6),
      createWorkoutExercise("hanging-leg-raise", "Hanging Leg Raise", 3, 15, 7),
    ] as WorkoutExercise[],
  },
];

// 3 DAYS PER WEEK PLANS - Push/Pull/Legs
export const THREE_DAY_INTERMEDIATE: WorkoutPlan[] = [
  {
    id: "3day-int-push",
    name: "3-Day Push",
    description: "Chest, shoulders, and triceps",
    level: "intermediate",
    daysPerWeek: 3,
    dayName: "Day 1: Push",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("bench-press", "Barbell Bench Press", 4, 8, 1),
      createWorkoutExercise(
        "incline-dumbbell-press",
        "Incline Dumbbell Press",
        3,
        10,
        2
      ),
      createWorkoutExercise(
        "overhead-press",
        "Barbell Overhead Press",
        4,
        8,
        3
      ),
      createWorkoutExercise(
        "lateral-raise",
        "Dumbbell Lateral Raise",
        3,
        12,
        4
      ),
      createWorkoutExercise("cable-fly", "Cable Chest Fly", 3, 12, 5),
      createWorkoutExercise(
        "tricep-extension",
        "Overhead Tricep Extension",
        3,
        12,
        6
      ),
      createWorkoutExercise(
        "close-grip-bench",
        "Close-Grip Bench Press",
        3,
        10,
        7
      ),
    ] as WorkoutExercise[],
  },
  {
    id: "3day-int-pull",
    name: "3-Day Pull",
    description: "Back and biceps",
    level: "intermediate",
    daysPerWeek: 3,
    dayName: "Day 2: Pull",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("deadlift", "Barbell Deadlift", 4, 6, 1),
      createWorkoutExercise("pull-ups", "Pull-Ups", 4, 8, 2),
      createWorkoutExercise("barbell-row", "Barbell Bent-Over Row", 4, 10, 3),
      createWorkoutExercise("lat-pulldown", "Lat Pulldown", 3, 12, 4),
      createWorkoutExercise("dumbbell-row", "One-Arm Dumbbell Row", 3, 12, 5),
      createWorkoutExercise("face-pull", "Cable Face Pull", 3, 15, 6),
      createWorkoutExercise("barbell-curl", "Barbell Bicep Curl", 3, 10, 7),
      createWorkoutExercise("hammer-curl", "Hammer Curl", 3, 12, 8),
    ] as WorkoutExercise[],
  },
  {
    id: "3day-int-legs",
    name: "3-Day Legs",
    description: "Legs and core",
    level: "intermediate",
    daysPerWeek: 3,
    dayName: "Day 3: Legs",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("barbell-squat", "Barbell Back Squat", 4, 8, 1),
      createWorkoutExercise("romanian-deadlift", "Romanian Deadlift", 4, 10, 2),
      createWorkoutExercise("leg-press", "Leg Press", 3, 12, 3),
      createWorkoutExercise("leg-curl", "Leg Curl", 3, 12, 4),
      createWorkoutExercise("lunges", "Dumbbell Lunges", 3, 12, 5),
      createWorkoutExercise("hanging-leg-raise", "Hanging Leg Raise", 3, 15, 6),
      createWorkoutExercise("cable-crunch", "Cable Crunch", 3, 15, 7),
      createWorkoutExercise("plank", "Plank", 3, 60, 8),
    ] as WorkoutExercise[],
  },
];

// 4 DAYS PER WEEK PLANS - Upper/Lower Split
export const FOUR_DAY_INTERMEDIATE: WorkoutPlan[] = [
  {
    id: "4day-int-upper1",
    name: "4-Day Upper A",
    description: "Upper body power day",
    level: "intermediate",
    daysPerWeek: 4,
    dayName: "Day 1: Upper Power",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("bench-press", "Barbell Bench Press", 4, 6, 1),
      createWorkoutExercise("barbell-row", "Barbell Bent-Over Row", 4, 6, 2),
      createWorkoutExercise(
        "overhead-press",
        "Barbell Overhead Press",
        3,
        8,
        3
      ),
      createWorkoutExercise("pull-ups", "Pull-Ups", 3, 8, 4),
      createWorkoutExercise(
        "close-grip-bench",
        "Close-Grip Bench Press",
        3,
        8,
        5
      ),
      createWorkoutExercise("barbell-curl", "Barbell Bicep Curl", 3, 10, 6),
    ] as WorkoutExercise[],
  },
  {
    id: "4day-int-lower1",
    name: "4-Day Lower A",
    description: "Lower body power day",
    level: "intermediate",
    daysPerWeek: 4,
    dayName: "Day 2: Lower Power",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("barbell-squat", "Barbell Back Squat", 4, 6, 1),
      createWorkoutExercise("deadlift", "Barbell Deadlift", 3, 6, 2),
      createWorkoutExercise("leg-press", "Leg Press", 3, 10, 3),
      createWorkoutExercise("leg-curl", "Leg Curl", 3, 10, 4),
      createWorkoutExercise("hanging-leg-raise", "Hanging Leg Raise", 3, 12, 5),
      createWorkoutExercise("plank", "Plank", 3, 60, 6),
    ] as WorkoutExercise[],
  },
  {
    id: "4day-int-upper2",
    name: "4-Day Upper B",
    description: "Upper body hypertrophy day",
    level: "intermediate",
    daysPerWeek: 4,
    dayName: "Day 3: Upper Hypertrophy",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise(
        "incline-dumbbell-press",
        "Incline Dumbbell Press",
        4,
        10,
        1
      ),
      createWorkoutExercise("lat-pulldown", "Lat Pulldown", 4, 10, 2),
      createWorkoutExercise("cable-fly", "Cable Chest Fly", 3, 12, 3),
      createWorkoutExercise("dumbbell-row", "One-Arm Dumbbell Row", 3, 12, 4),
      createWorkoutExercise(
        "lateral-raise",
        "Dumbbell Lateral Raise",
        4,
        12,
        5
      ),
      createWorkoutExercise("face-pull", "Cable Face Pull", 3, 15, 6),
      createWorkoutExercise(
        "tricep-extension",
        "Overhead Tricep Extension",
        3,
        12,
        7
      ),
      createWorkoutExercise("hammer-curl", "Hammer Curl", 3, 12, 8),
    ] as WorkoutExercise[],
  },
  {
    id: "4day-int-lower2",
    name: "4-Day Lower B",
    description: "Lower body hypertrophy day",
    level: "intermediate",
    daysPerWeek: 4,
    dayName: "Day 4: Lower Hypertrophy",
    createdAt: new Date().toISOString(),
    exercises: [
      createWorkoutExercise("romanian-deadlift", "Romanian Deadlift", 4, 10, 1),
      createWorkoutExercise("lunges", "Dumbbell Lunges", 4, 12, 2),
      createWorkoutExercise("leg-press", "Leg Press", 3, 15, 3),
      createWorkoutExercise("leg-curl", "Leg Curl", 3, 12, 4),
      createWorkoutExercise("cable-crunch", "Cable Crunch", 4, 15, 5),
      createWorkoutExercise("hanging-leg-raise", "Hanging Leg Raise", 3, 15, 6),
    ] as WorkoutExercise[],
  },
];

// Export all plans
export const ALL_WORKOUT_PLANS = [
  ...TWO_DAY_INTERMEDIATE,
  ...THREE_DAY_INTERMEDIATE,
  ...FOUR_DAY_INTERMEDIATE,
];

// Helper to get plans by frequency
export const getPlansByFrequency = (days: 2 | 3 | 4): WorkoutPlan[] => {
  return ALL_WORKOUT_PLANS.filter((plan) => plan.daysPerWeek === days);
};
