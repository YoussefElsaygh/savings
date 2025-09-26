"use client";

import { useState, useEffect } from "react";
import { FOOD_CATEGORIES, getFoodsByCategory, calculateCalories, type FoodConstant } from "@/constants/foods";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFood: (food: { name: string; calories: number; description: string }) => void;
}

export default function AddEntryModal({ isOpen, onClose, onAddFood }: AddEntryModalProps) {

  // Food entry states
  const [foodEntryMode, setFoodEntryMode] = useState<'preset' | 'custom'>('preset');
  const [selectedFood, setSelectedFood] = useState<FoodConstant | null>(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<'pieces' | 'grams' | 'ml'>('grams');
  const [customFoodName, setCustomFoodName] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [calculatedCalories, setCalculatedCalories] = useState(0);
  
  
  const foodsByCategory = getFoodsByCategory();

  // Set appropriate unit when food is selected
  useEffect(() => {
    if (selectedFood) {
      // Auto-set unit based on food type
      if (selectedFood.unitType === 'piece') {
        setUnit('pieces');
      } else if (selectedFood.unitType === '100g') {
        setUnit('grams');
      } else if (selectedFood.unitType === '100ml') {
        setUnit('ml');
      }
    }
  }, [selectedFood]);

  // Calculate calories when preset food selection changes
  useEffect(() => {
    if (foodEntryMode === 'preset' && selectedFood && quantity) {
      const qty = parseFloat(quantity);
      if (qty > 0) {
        const calories = calculateCalories(selectedFood, qty, unit);
        setCalculatedCalories(Math.round(calories));
      } else {
        setCalculatedCalories(0);
      }
    } else {
      setCalculatedCalories(0);
    }
  }, [selectedFood, quantity, unit, foodEntryMode]);

  const handleAddFood = () => {
    let calories: number;
    let name: string;
    let description: string;
    
    if (foodEntryMode === 'preset' && selectedFood && quantity) {
      const qty = parseFloat(quantity);
      if (qty > 0) {
        calories = calculateCalories(selectedFood, qty, unit);
        name = selectedFood.name;
        description = `${qty} ${
          unit === 'pieces' ? (qty === 1 ? 'piece' : 'pieces') : 
          unit === 'ml' ? 'ml' : 'g'
        }`;
      } else {
        return;
      }
    } else if (foodEntryMode === 'custom') {
      const customCals = parseFloat(customCalories);
      const customName = customFoodName.trim();
      if (!customName || customCals <= 0) {
        return;
      }
      calories = customCals;
      name = customName;
      description = 'custom entry';
    } else {
      return;
    }
    
    if (calories > 0) {
      onAddFood({
        name: `${name} (${description})`,
        calories: Math.round(calories),
        description,
      });
      
      // Reset form and close modal
      resetFoodForm();
      onClose();
    }
  };

  

  const resetFoodForm = () => {
    setQuantity("");
    setCustomFoodName("");
    setCustomCalories("");
    setSelectedFood(null);
    setCalculatedCalories(0);
  };

  

  const handleClose = () => {
    resetFoodForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-200 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div>
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6 p-6 sticky top-0 bg-white border-b border-gray-300">
            <h3 className="text-xl font-bold">Add Food</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          
          
            <div>
              {/* Food Entry Type Selection */}
              <div className="flex gap-2 mb-6 px-6">
                <button
                  onClick={() => setFoodEntryMode('preset')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    foodEntryMode === 'preset'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Preset Foods
                </button>
                <button
                  onClick={() => {setFoodEntryMode('custom');
                    setSelectedFood(null);
                    setQuantity("");
                    setUnit('grams');
                    setCalculatedCalories(0);
                  }}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    foodEntryMode === 'custom'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Custom Entry
                </button>
              </div>
              {/* Preset Foods Mode */}
              {foodEntryMode === 'preset' && (
                <div className="space-y-4 px-6">
                  {/* Food Categories */}
                  <div className="space-y-4 mb-3">
                    {Object.entries(foodsByCategory).map(([category, foods]) => (
                      <div key={category} className={`border rounded-lg p-4 ${FOOD_CATEGORIES[category as keyof typeof FOOD_CATEGORIES].color}`}>
                        <h4 className="font-medium mb-3">{FOOD_CATEGORIES[category as keyof typeof FOOD_CATEGORIES].name}</h4>
                        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                          {foods.map((food) => (
                            <button
                              key={food.id}
                              onClick={() => setSelectedFood(food)}
                              className={`text-left p-3 rounded border transition-colors ${
                                selectedFood?.id === food.id
                                  ? 'bg-green-100 border-green-300'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="font-medium text-sm">{food.name}</div>
                              <div className="text-xs text-gray-600">
                                {food.caloriesPerUnit} cal/{food.unitType}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {food.description}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  
                </div>
              )}

              {/* Custom Food Entry Mode */}
              {foodEntryMode === 'custom' && (
                <div className="grid gap-4 md:grid-cols-3 px-6">
                  <div className="md:col-span-2 mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Food Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Homemade pasta, Restaurant meal, etc."
                      value={customFoodName}
                      onChange={(e) => setCustomFoodName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="e.g. 250"
                      value={customCalories}
                      onChange={(e) => setCustomCalories(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}
              <footer className="sticky bottom-0 p-6 bg-white border-t border-gray-300 space-y-4">
              {/* Quantity Input */}
              {selectedFood && (
                    <div className="bg-white border rounded-lg p-4">
                      <h4 className="font-medium mb-3">Selected: {selectedFood.name}</h4>
                      
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="e.g. 1, 150, etc."
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Unit
                          </label>
                          <select
                            value={unit}
                            onChange={(e) => setUnit(e.target.value as 'pieces' | 'grams' | 'ml')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          >
                            <option value="grams">Grams</option>
                            <option value="pieces">Pieces</option>
                            <option value="ml">Milliliters (ml)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Calculated Calories
                          </label>
                          <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md font-medium text-green-700">
                            {calculatedCalories} calories
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              <div className="flex gap-3">
                <button
                  onClick={handleAddFood}
                  disabled={
                    (foodEntryMode === 'preset' && (!selectedFood || !quantity || parseFloat(quantity) <= 0)) ||
                    (foodEntryMode === 'custom' && (!customFoodName.trim() || !customCalories || parseFloat(customCalories) <= 0))
                  }
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md transition-colors"
                >
                  Add Food
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
