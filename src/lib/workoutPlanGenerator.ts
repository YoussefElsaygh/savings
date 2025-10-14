import {
  WorkoutPlan,
  WorkoutExercise,
  WorkoutPreferences,
  EquipmentPreference,
  Exercise,
} from "@/types";
import { EXERCISE_LIBRARY } from "@/constants/exercises-library";

// Filter exercises by equipment preference
const filterExercisesByEquipment = (
  equipmentPref: EquipmentPreference
): Exercise[] => {
  switch (equipmentPref) {
    case "free-weights":
      return EXERCISE_LIBRARY.filter((ex) =>
        ex.equipment.some((eq) =>
          ["barbell", "dumbbell", "kettlebell"].includes(eq)
        )
      );
    case "machines":
      return EXERCISE_LIBRARY.filter((ex) => ex.equipment.includes("machine"));
    case "bodyweight":
      return EXERCISE_LIBRARY.filter((ex) =>
        ex.equipment.includes("bodyweight")
      );
    case "mixed":
    default:
      return EXERCISE_LIBRARY; // All exercises
  }
};

// Get exercises by muscle group from filtered list
const getExercisesByMuscle = (
  exercises: Exercise[],
  muscleGroup: string,
  count: number = 2
): Exercise[] => {
  const filtered = exercises.filter((ex) => ex.muscleGroup === muscleGroup);
  return filtered.slice(0, count);
};

// Generate workout exercises with sets/reps based on experience
const generateWorkoutExercises = (
  exercises: Exercise[],
  experience: string
): WorkoutExercise[] => {
  const setsReps = {
    beginner: { sets: 3, reps: 10 },
    intermediate: { sets: 4, reps: 10 },
    advanced: { sets: 5, reps: 8 },
  };

  const config =
    setsReps[experience as keyof typeof setsReps] || setsReps.intermediate;

  return exercises.map((ex, index) => ({
    exerciseId: ex.id,
    exerciseName: ex.name,
    sets: [],
    targetSets: config.sets,
    targetReps: config.reps,
    order: index + 1,
  }));
};

// Generate 2-day split
const generate2DaySplit = (
  filteredExercises: Exercise[],
  experience: string
): WorkoutPlan[] => {
  const day1Exercises = [
    ...getExercisesByMuscle(filteredExercises, "chest", 2),
    ...getExercisesByMuscle(filteredExercises, "shoulders", 2),
    ...getExercisesByMuscle(filteredExercises, "triceps", 2),
  ];

  const day2Exercises = [
    ...getExercisesByMuscle(filteredExercises, "back", 2),
    ...getExercisesByMuscle(filteredExercises, "legs", 2),
    ...getExercisesByMuscle(filteredExercises, "biceps", 2),
  ];

  return [
    {
      id: `2day-push-${Date.now()}`,
      name: "Upper Body Push",
      description: "Chest, Shoulders, and Triceps",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 2,
      dayName: "Day 1: Push",
      exercises: generateWorkoutExercises(day1Exercises, experience),
      createdAt: new Date().toISOString(),
    },
    {
      id: `2day-pull-${Date.now()}`,
      name: "Lower Body & Pull",
      description: "Back, Legs, and Biceps",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 2,
      dayName: "Day 2: Pull & Legs",
      exercises: generateWorkoutExercises(day2Exercises, experience),
      createdAt: new Date().toISOString(),
    },
  ];
};

// Generate 3-day split
const generate3DaySplit = (
  filteredExercises: Exercise[],
  experience: string
): WorkoutPlan[] => {
  const day1Exercises = [
    ...getExercisesByMuscle(filteredExercises, "chest", 3),
    ...getExercisesByMuscle(filteredExercises, "shoulders", 2),
    ...getExercisesByMuscle(filteredExercises, "triceps", 2),
  ];

  const day2Exercises = [
    ...getExercisesByMuscle(filteredExercises, "legs", 4),
    ...getExercisesByMuscle(filteredExercises, "core", 2),
  ];

  const day3Exercises = [
    ...getExercisesByMuscle(filteredExercises, "back", 3),
    ...getExercisesByMuscle(filteredExercises, "biceps", 2),
    ...getExercisesByMuscle(filteredExercises, "core", 1),
  ];

  return [
    {
      id: `3day-push-${Date.now()}`,
      name: "Push Day",
      description: "Chest, Shoulders, Triceps",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 3,
      dayName: "Day 1: Push",
      exercises: generateWorkoutExercises(day1Exercises, experience),
      createdAt: new Date().toISOString(),
    },
    {
      id: `3day-legs-${Date.now()}`,
      name: "Leg Day",
      description: "Quads, Hamstrings, Glutes, Core",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 3,
      dayName: "Day 2: Legs",
      exercises: generateWorkoutExercises(day2Exercises, experience),
      createdAt: new Date().toISOString(),
    },
    {
      id: `3day-pull-${Date.now()}`,
      name: "Pull Day",
      description: "Back, Biceps, Core",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 3,
      dayName: "Day 3: Pull",
      exercises: generateWorkoutExercises(day3Exercises, experience),
      createdAt: new Date().toISOString(),
    },
  ];
};

// Generate 4-day split
const generate4DaySplit = (
  filteredExercises: Exercise[],
  experience: string
): WorkoutPlan[] => {
  const day1Exercises = [
    ...getExercisesByMuscle(filteredExercises, "chest", 3),
    ...getExercisesByMuscle(filteredExercises, "triceps", 2),
  ];

  const day2Exercises = [
    ...getExercisesByMuscle(filteredExercises, "back", 3),
    ...getExercisesByMuscle(filteredExercises, "biceps", 2),
  ];

  const day3Exercises = [
    ...getExercisesByMuscle(filteredExercises, "shoulders", 3),
    ...getExercisesByMuscle(filteredExercises, "core", 2),
  ];

  const day4Exercises = [...getExercisesByMuscle(filteredExercises, "legs", 5)];

  return [
    {
      id: `4day-chest-${Date.now()}`,
      name: "Chest & Triceps",
      description: "Push muscles focus",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 4,
      dayName: "Day 1: Chest/Triceps",
      exercises: generateWorkoutExercises(day1Exercises, experience),
      createdAt: new Date().toISOString(),
    },
    {
      id: `4day-back-${Date.now()}`,
      name: "Back & Biceps",
      description: "Pull muscles focus",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 4,
      dayName: "Day 2: Back/Biceps",
      exercises: generateWorkoutExercises(day2Exercises, experience),
      createdAt: new Date().toISOString(),
    },
    {
      id: `4day-shoulders-${Date.now()}`,
      name: "Shoulders & Core",
      description: "Deltoids and abs",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 4,
      dayName: "Day 3: Shoulders/Core",
      exercises: generateWorkoutExercises(day3Exercises, experience),
      createdAt: new Date().toISOString(),
    },
    {
      id: `4day-legs-${Date.now()}`,
      name: "Leg Day",
      description: "Complete lower body",
      level: experience as "beginner" | "intermediate" | "advanced",
      daysPerWeek: 4,
      dayName: "Day 4: Legs",
      exercises: generateWorkoutExercises(day4Exercises, experience),
      createdAt: new Date().toISOString(),
    },
  ];
};

// Main function to generate personalized workout plans
export const generatePersonalizedPlans = (
  preferences: WorkoutPreferences
): WorkoutPlan[] => {
  const filteredExercises = filterExercisesByEquipment(
    preferences.equipmentPreference
  );

  switch (preferences.daysPerWeek) {
    case 2:
      return generate2DaySplit(filteredExercises, preferences.experienceLevel);
    case 3:
      return generate3DaySplit(filteredExercises, preferences.experienceLevel);
    case 4:
      return generate4DaySplit(filteredExercises, preferences.experienceLevel);
    default:
      return generate3DaySplit(filteredExercises, preferences.experienceLevel);
  }
};
