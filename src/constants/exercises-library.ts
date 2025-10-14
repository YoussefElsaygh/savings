import { Exercise } from "@/types";
import { ADDITIONAL_EXERCISES } from "./additional-exercises";

// Exercise visuals stored locally for better performance and reliability
// All images are stored in /public/exercises/ directory as animated GIFs
// 37 exercises have real workout demonstration GIFs, 13 use similar exercise placeholders
const CORE_EXERCISES: Exercise[] = [
  // CHEST EXERCISES
  {
    id: "bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
    equipment: ["barbell"],
    gifUrl: "/exercises/bench-press.gif",
    description:
      "The king of chest exercises. Lie on bench, lower bar to chest, press up.",
    tips: [
      "Keep your feet flat on the ground",
      "Retract your shoulder blades",
      "Lower the bar to mid-chest",
      "Don't bounce the bar off your chest",
    ],
    alternatives: ["incline-dumbbell-press", "push-ups"],
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscleGroup: "chest",
    equipment: ["dumbbell"],
    gifUrl: "/exercises/incline-dumbbell-press.gif",
    description: "Targets upper chest. Press dumbbells on incline bench.",
    tips: [
      "Set bench to 30-45 degrees",
      "Press dumbbells together at the top",
      "Control the descent",
    ],
    alternatives: ["bench-press", "push-ups"],
  },
  {
    id: "push-ups",
    name: "Push-Ups",
    muscleGroup: "chest",
    equipment: ["bodyweight"],
    gifUrl: "/exercises/push-ups.gif",
    description: "Classic bodyweight chest exercise.",
    tips: [
      "Keep your core tight",
      "Lower until chest nearly touches ground",
      "Keep elbows at 45 degrees",
    ],
    alternatives: ["bench-press", "incline-dumbbell-press"],
  },
  {
    id: "cable-fly",
    name: "Cable Chest Fly",
    muscleGroup: "chest",
    equipment: ["cable"],
    gifUrl: "/exercises/cable-fly.gif",
    description: "Isolates chest muscles with constant tension.",
    tips: [
      "Slight bend in elbows",
      "Squeeze at the center",
      "Control the stretch",
    ],
    alternatives: ["push-ups", "bench-press"],
  },

  // BACK EXERCISES
  {
    id: "deadlift",
    name: "Barbell Deadlift",
    muscleGroup: "back",
    equipment: ["barbell"],
    gifUrl: "/exercises/deadlift.gif",
    description: "The ultimate back and posterior chain exercise.",
    tips: [
      "Keep bar close to shins",
      "Neutral spine throughout",
      "Drive through heels",
      "Lock out at the top",
    ],
    alternatives: ["romanian-deadlift", "barbell-row"],
  },
  {
    id: "pull-ups",
    name: "Pull-Ups",
    muscleGroup: "back",
    equipment: ["bodyweight"],
    gifUrl: "/exercises/pull-ups.gif",
    description: "Best bodyweight back exercise.",
    tips: [
      "Full extension at bottom",
      "Pull chin over bar",
      "Control the descent",
      "Don't swing or kip",
    ],
    alternatives: ["lat-pulldown", "dumbbell-row"],
  },
  {
    id: "barbell-row",
    name: "Barbell Bent-Over Row",
    muscleGroup: "back",
    equipment: ["barbell"],
    gifUrl: "/exercises/barbell-row.gif",
    description: "Builds thickness in the back.",
    tips: [
      "Hinge at hips, not waist",
      "Pull to lower chest/upper abdomen",
      "Squeeze shoulder blades together",
    ],
    alternatives: ["dumbbell-row", "deadlift"],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscleGroup: "back",
    equipment: ["machine", "cable"],
    gifUrl: "/exercises/lat-pulldown.gif",
    description: "Great for building lat width.",
    tips: [
      "Pull to upper chest",
      "Don't lean back excessively",
      "Control the weight up",
    ],
    alternatives: ["pull-ups", "dumbbell-row"],
  },
  {
    id: "dumbbell-row",
    name: "One-Arm Dumbbell Row",
    muscleGroup: "back",
    equipment: ["dumbbell"],
    gifUrl: "/exercises/dumbbell-row.gif",
    description: "Unilateral back exercise for balance.",
    tips: [
      "Support yourself on bench",
      "Pull elbow back, not just weight up",
      "Squeeze at the top",
    ],
    alternatives: ["barbell-row", "lat-pulldown"],
  },

  // LEGS EXERCISES
  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    muscleGroup: "legs",
    equipment: ["barbell"],
    gifUrl: "/exercises/barbell-squat.gif",
    description: "The king of leg exercises.",
    tips: [
      "Bar on upper traps",
      "Knees track over toes",
      "Depth at least parallel",
      "Drive through heels",
    ],
    alternatives: ["leg-press", "lunges"],
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscleGroup: "legs",
    equipment: ["barbell"],
    gifUrl: "/exercises/romanian-deadlift.gif",
    description: "Targets hamstrings and glutes.",
    tips: [
      "Slight knee bend",
      "Hinge at hips",
      "Feel stretch in hamstrings",
      "Don't round your back",
    ],
    alternatives: ["deadlift", "leg-curl"],
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscleGroup: "legs",
    equipment: ["machine"],
    gifUrl: "/exercises/leg-press.gif",
    description: "Heavy leg training with back support.",
    tips: [
      "Full range of motion",
      "Don't lock knees at top",
      "Keep lower back pressed against pad",
    ],
    alternatives: ["barbell-squat", "lunges"],
  },
  {
    id: "lunges",
    name: "Dumbbell Lunges",
    muscleGroup: "legs",
    equipment: ["dumbbell"],
    gifUrl: "/exercises/lunges.gif",
    description: "Unilateral leg exercise.",
    tips: [
      "Step forward, drop back knee",
      "Front knee at 90 degrees",
      "Push through front heel",
    ],
    alternatives: ["barbell-squat", "leg-press"],
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    muscleGroup: "legs",
    equipment: ["machine"],
    gifUrl: "/exercises/leg-curl.gif",
    description: "Isolates hamstrings.",
    tips: [
      "Curl heels to glutes",
      "Control the negative",
      "Don't lift hips off pad",
    ],
    alternatives: ["romanian-deadlift"],
  },

  // SHOULDER EXERCISES
  {
    id: "overhead-press",
    name: "Barbell Overhead Press",
    muscleGroup: "shoulders",
    equipment: ["barbell"],
    gifUrl: "/exercises/overhead-press.gif",
    description: "Best overall shoulder builder.",
    tips: [
      "Start at shoulders",
      "Press overhead, not forward",
      "Lock out at top",
      "Control the descent",
    ],
    alternatives: ["lateral-raise", "push-ups"],
  },
  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    muscleGroup: "shoulders",
    equipment: ["dumbbell"],
    gifUrl: "/exercises/lateral-raise.gif",
    description: "Builds shoulder width.",
    tips: [
      "Slight bend in elbows",
      "Raise to shoulder height",
      "Control the descent",
      "Don't swing the weight",
    ],
    alternatives: ["overhead-press", "face-pull"],
  },
  {
    id: "face-pull",
    name: "Cable Face Pull",
    muscleGroup: "shoulders",
    equipment: ["cable"],
    gifUrl: "/exercises/face-pull.gif",
    description: "Great for rear delts and posture.",
    tips: [
      "Pull rope to face level",
      "Elbows high and back",
      "Squeeze shoulder blades",
    ],
    alternatives: ["lateral-raise"],
  },

  // ARM EXERCISES
  {
    id: "barbell-curl",
    name: "Barbell Bicep Curl",
    muscleGroup: "biceps",
    equipment: ["barbell"],
    gifUrl: "/exercises/barbell-curl.gif",
    description: "Classic bicep mass builder.",
    tips: [
      "Keep elbows tucked",
      "Don't swing",
      "Full extension at bottom",
      "Squeeze at top",
    ],
    alternatives: ["hammer-curl"],
  },
  {
    id: "hammer-curl",
    name: "Hammer Curl",
    muscleGroup: "biceps",
    equipment: ["dumbbell"],
    gifUrl: "/exercises/hammer-curl.gif",
    description: "Targets biceps and forearms.",
    tips: [
      "Neutral grip (palms facing)",
      "Keep elbows stationary",
      "Curl weight up",
    ],
    alternatives: ["barbell-curl"],
  },
  {
    id: "tricep-dips",
    name: "Tricep Dips",
    muscleGroup: "triceps",
    equipment: ["bodyweight"],
    gifUrl: "/exercises/tricep-dips.gif",
    description: "Great bodyweight tricep exercise.",
    tips: [
      "Lean slightly forward",
      "Lower until 90 degrees",
      "Push back up",
      "Don't flare elbows out",
    ],
    alternatives: ["close-grip-bench", "tricep-extension"],
  },
  {
    id: "tricep-extension",
    name: "Overhead Tricep Extension",
    muscleGroup: "triceps",
    equipment: ["dumbbell", "cable"],
    gifUrl: "/exercises/tricep-extension.gif",
    description: "Isolates triceps with stretch.",
    tips: [
      "Keep elbows pointing forward",
      "Lower weight behind head",
      "Extend fully at top",
    ],
    alternatives: ["tricep-dips", "close-grip-bench"],
  },
  {
    id: "close-grip-bench",
    name: "Close-Grip Bench Press",
    muscleGroup: "triceps",
    equipment: ["barbell"],
    gifUrl: "/exercises/close-grip-bench.gif",
    description: "Compound tricep exercise.",
    tips: [
      "Hands shoulder-width apart",
      "Tuck elbows close to body",
      "Lower to lower chest",
    ],
    alternatives: ["tricep-dips", "tricep-extension"],
  },

  // CORE EXERCISES
  {
    id: "plank",
    name: "Plank",
    muscleGroup: "core",
    equipment: ["bodyweight"],
    gifUrl: "/exercises/plank.gif",
    description: "Isometric core strengthener.",
    tips: [
      "Body in straight line",
      "Don't let hips sag",
      "Engage core and glutes",
      "Breathe normally",
    ],
    alternatives: ["hanging-leg-raise", "cable-crunch"],
  },
  {
    id: "hanging-leg-raise",
    name: "Hanging Leg Raise",
    muscleGroup: "core",
    equipment: ["bodyweight"],
    gifUrl: "/exercises/hanging-leg-raise.gif",
    description: "Advanced ab exercise.",
    tips: [
      "Hang from bar",
      "Raise legs to 90 degrees",
      "Control the descent",
      "Don't swing",
    ],
    alternatives: ["cable-crunch", "plank"],
  },
  {
    id: "cable-crunch",
    name: "Cable Crunch",
    muscleGroup: "core",
    equipment: ["cable"],
    gifUrl: "/exercises/cable-crunch.gif",
    description: "Weighted ab exercise.",
    tips: [
      "Kneel below cable",
      "Crunch abs, not just arms",
      "Squeeze at bottom",
    ],
    alternatives: ["hanging-leg-raise", "plank"],
  },
];

// Merge core exercises with additional exercises to create complete library
export const EXERCISE_LIBRARY: Exercise[] = [
  ...CORE_EXERCISES,
  ...ADDITIONAL_EXERCISES,
];

// Helper function to get exercises by muscle group
export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
  return EXERCISE_LIBRARY.filter((ex) => ex.muscleGroup === muscleGroup);
};

// Helper function to get exercise by ID
export const getExerciseById = (id: string): Exercise | undefined => {
  return EXERCISE_LIBRARY.find((ex) => ex.id === id);
};

// Helper function to filter exercises by equipment type
export const getExercisesByEquipment = (
  equipmentTypes: string[]
): Exercise[] => {
  return EXERCISE_LIBRARY.filter((ex) =>
    ex.equipment.some((eq) => equipmentTypes.includes(eq))
  );
};
