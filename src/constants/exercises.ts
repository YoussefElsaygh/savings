/**
 * Exercise Constants for Calorie Tracking
 * Calories burned per hour for different exercises (average for 70kg person)
 * Adjust based on individual body weight for more accuracy
 */

export interface ExerciseConstant {
  id: string;
  name: string;
  caloriesPerHour: number;
  category: 'cardio' | 'strength' | 'mixed';
  description: string;
  intensityLevel: 'low' | 'moderate' | 'high';
}

export const EXERCISE_CONSTANTS: ExerciseConstant[] = [
  // Cardio Exercises
  {
    id: 'treadmill-walking',
    name: 'Treadmill Walking',
    caloriesPerHour: 300,
    category: 'cardio',
    description: 'Walking on treadmill (moderate pace)',
    intensityLevel: 'moderate',
  },
  {
    id: 'treadmill-running',
    name: 'Treadmill Running',
    caloriesPerHour: 600,
    category: 'cardio', 
    description: 'Running on treadmill (moderate pace)',
    intensityLevel: 'high',
  },
  {
    id: 'treadmill-incline',
    name: 'Treadmill with Ramp/Incline',
    caloriesPerHour: 450,
    category: 'cardio',
    description: 'Walking/jogging on inclined treadmill',
    intensityLevel: 'high',
  },
  {
    id: 'cycling-machine',
    name: 'Cycling Machine',
    caloriesPerHour: 500,
    category: 'cardio',
    description: 'Stationary bike (moderate intensity)',
    intensityLevel: 'moderate',
  },
  {
    id: 'cycling-machine-high',
    name: 'Cycling Machine (High Intensity)',
    caloriesPerHour: 700,
    category: 'cardio',
    description: 'Stationary bike (high intensity)',
    intensityLevel: 'high',
  },
  {
    id: 'elliptical',
    name: 'Elliptical/Orb Track',
    caloriesPerHour: 400,
    category: 'cardio',
    description: 'Elliptical machine (moderate pace)',
    intensityLevel: 'moderate',
  },
  {
    id: 'walking-outdoor',
    name: 'Walking (Outdoor)',
    caloriesPerHour: 250,
    category: 'cardio',
    description: 'Brisk walking outdoors',
    intensityLevel: 'low',
  },
  {
    id: 'walking-hills',
    name: 'Walking (Hills/Stairs)',
    caloriesPerHour: 350,
    category: 'cardio',
    description: 'Walking uphill or climbing stairs',
    intensityLevel: 'moderate',
  },
  {
    id: 'tennis-singles',
    name: 'Tennis (Singles/Alone)',
    caloriesPerHour: 580,
    category: 'cardio',
    description: 'Tennis singles match or practice alone',
    intensityLevel: 'high',
  },
  {
    id: 'tennis-doubles',
    name: 'Tennis (Doubles/Team)',
    caloriesPerHour: 420,
    category: 'cardio',
    description: 'Tennis doubles match with team',
    intensityLevel: 'moderate',
  },
  {
    id: 'padel-friends',
    name: 'Padel with Friends',
    caloriesPerHour: 480,
    category: 'cardio',
    description: 'Padel match or practice with friends',
    intensityLevel: 'high',
  },

  // Strength Training
  {
    id: 'weight-training',
    name: 'Weight Training',
    caloriesPerHour: 350,
    category: 'strength',
    description: 'General weight lifting session',
    intensityLevel: 'moderate',
  },
  {
    id: 'weight-training-intense',
    name: 'Weight Training (Intense)',
    caloriesPerHour: 500,
    category: 'strength',
    description: 'High-intensity weight training',
    intensityLevel: 'high',
  },
  {
    id: 'bodyweight-exercises',
    name: 'Bodyweight Exercises',
    caloriesPerHour: 300,
    category: 'strength',
    description: 'Push-ups, pull-ups, squats, etc.',
    intensityLevel: 'moderate',
  },

  // Mixed/Other
  {
    id: 'hiit-workout',
    name: 'HIIT Workout',
    caloriesPerHour: 600,
    category: 'mixed',
    description: 'High-intensity interval training',
    intensityLevel: 'high',
  },
  {
    id: 'circuit-training',
    name: 'Circuit Training',
    caloriesPerHour: 450,
    category: 'mixed',
    description: 'Mixed cardio and strength circuits',
    intensityLevel: 'high',
  },
  {
    id: 'yoga',
    name: 'Yoga',
    caloriesPerHour: 200,
    category: 'mixed',
    description: 'General yoga practice',
    intensityLevel: 'low',
  },
  {
    id: 'pilates',
    name: 'Pilates',
    caloriesPerHour: 250,
    category: 'mixed',
    description: 'Pilates workout',
    intensityLevel: 'moderate',
  },
];

export const EXERCISE_CATEGORIES = {
  cardio: { name: 'Cardio', color: 'bg-orange-100 border-orange-200', icon: '🏃' },
  strength: { name: 'Strength Training', color: 'bg-red-100 border-red-200', icon: '💪' },
  mixed: { name: 'Mixed/Other', color: 'bg-purple-100 border-purple-200', icon: '🔥' },
} as const;

export const INTENSITY_COLORS = {
  low: 'text-green-600',
  moderate: 'text-yellow-600', 
  high: 'text-red-600',
} as const;

// Helper function to calculate calories burned based on duration
export function calculateCaloriesBurned(
  exercise: ExerciseConstant, 
  durationMinutes: number,
  bodyWeight?: number
): number {
  // Base calculation for 70kg person
  const baseCalories = (exercise.caloriesPerHour * durationMinutes) / 60;
  
  // Adjust for body weight if provided (70kg is the baseline)
  if (bodyWeight && bodyWeight !== 70) {
    const weightMultiplier = bodyWeight / 70;
    return baseCalories * weightMultiplier;
  }
  
  return baseCalories;
}

// Get exercises by category for organized display
export function getExercisesByCategory() {
  const categorized = EXERCISE_CONSTANTS.reduce((acc, exercise) => {
    if (!acc[exercise.category]) {
      acc[exercise.category] = [];
    }
    acc[exercise.category].push(exercise);
    return acc;
  }, {} as Record<string, ExerciseConstant[]>);
  
  return categorized;
}

// Common durations for quick selection
export const COMMON_DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
] as const;
