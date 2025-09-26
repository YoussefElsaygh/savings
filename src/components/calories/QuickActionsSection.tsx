"use client";

import { useState } from "react";
import AddFoodModal from "./AddFoodModal";
import AddExerciseModal from "./AddExerciseModal";
interface QuickActionsSectionProps {
  handleModalAddFood: (foodData: { name: string; calories: number; description: string }) => void;
  handleModalAddExercise: (exerciseData: { name: string; caloriesBurned: number; durationMinutes: number; description: string }) => void;
}

export default function QuickActionsSection({ handleModalAddFood, handleModalAddExercise }: QuickActionsSectionProps) {
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ">
      <h3 className="text-lg font-bold mb-4">Track Your Activity</h3>
      <button
        onClick={() => {setIsFoodModalOpen(true);
          document.body.style.overflow = 'hidden';
        }}
        className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
      >
        ➕ Add Food 
      </button>
      <br/>
      <button
        onClick={() =>{setIsExerciseModalOpen(true);
          document.body.style.overflow = 'hidden';
        }}
        className="mt-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-md"
      >
        ➕ Add Exercise 
      </button>
      <p className="text-sm text-gray-600 mt-2">
        Track what you eat or your workout sessions
      </p>
      <AddFoodModal
        isOpen={isFoodModalOpen}
        onClose={() => {setIsFoodModalOpen(false);
          document.body.style.overflow = 'auto';
        }}
        onAddFood={handleModalAddFood}
      />
      <AddExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={() => {setIsExerciseModalOpen(false)
          document.body.style.overflow = 'auto';

        }}
        onAddExercise={handleModalAddExercise}
      />
    </div>
  );
}
