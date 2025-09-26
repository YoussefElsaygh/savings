"use client";

import { useState, useEffect } from "react";
import { EXERCISE_CATEGORIES, getExercisesByCategory, calculateCaloriesBurned, COMMON_DURATIONS, type ExerciseConstant } from "@/constants/exercises";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exercise: { name: string; caloriesBurned: number; durationMinutes: number; description: string }) => void;
}

export default function AddExerciseModal({ isOpen, onClose, onAddExercise }: AddExerciseModalProps) {
  
  // Exercise entry states
  const [exerciseEntryMode, setExerciseEntryMode] = useState<'preset' | 'custom'>('preset');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseConstant | null>(null);
  const [duration, setDuration] = useState("");
  const [customExerciseName, setCustomExerciseName] = useState("");
  const [customCaloriesBurned, setCustomCaloriesBurned] = useState("");
  const [calculatedCaloriesBurned, setCalculatedCaloriesBurned] = useState(0);
  
  const exercisesByCategory = getExercisesByCategory();

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
      onAddExercise({
        name: `${name} (${description})`,
        caloriesBurned: Math.round(caloriesBurned),
        durationMinutes: durationMins,
        description,
      });
      
      // Reset form and close modal
      resetExerciseForm();
      onClose();
    }
  };

  

  const resetExerciseForm = () => {
    setDuration("");
    setCustomExerciseName("");
    setCustomCaloriesBurned("");
    setSelectedExercise(null);
    setCalculatedCaloriesBurned(0);
  };

  const handleClose = () => {
    resetExerciseForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div>
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6 p-6 sticky top-0 bg-white border-b border-gray-300">
            <h3 className="text-xl font-bold">Add Exercise</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
          
          {/* Exercise Entry Mode */}
            <div>
              {/* Exercise Entry Type Selection */}
              <div className="flex gap-2 mb-6 px-6">
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
                <div className="space-y-4 px-6 mb-4">
                  {/* Exercise Categories */}
                  <div className="space-y-4">
                    {Object.entries(exercisesByCategory).map(([category, exercises]) => (
                      <div key={category} className={`border rounded-lg p-4 ${EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES].color}`}>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <span>{EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES].icon}</span>
                          {EXERCISE_CATEGORIES[category as keyof typeof EXERCISE_CATEGORIES].name}
                        </h4>
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

                  
                </div>
              )}

              {/* Custom Exercise Entry Mode */}
              {exerciseEntryMode === 'custom' && (
                <div className="grid gap-4 md:grid-cols-3 px-6 mb-4">
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
              <footer className="sticky bottom-0 p-6 bg-white border-t border-gray-300 space-y-4">
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
              <div className="flex gap-3">
                <button
                  onClick={handleAddExercise}
                  disabled={
                    (exerciseEntryMode === 'preset' && (!selectedExercise || !duration || parseFloat(duration) <= 0)) ||
                    (exerciseEntryMode === 'custom' && (!customExerciseName.trim() || !customCaloriesBurned || parseFloat(customCaloriesBurned) <= 0 || !duration || parseFloat(duration) <= 0))
                  }
                  className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
                >
                  Add Exercise
                </button>
                <button
                  onClick={handleClose}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
              </footer>
            </div>
        </div>
      </div>
    </div>
  );
}
