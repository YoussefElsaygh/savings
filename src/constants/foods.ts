/**
 * Food Constants for Calorie Tracking
 * Nutritional information based on USDA and common nutritional databases
 */

export interface FoodConstant {
  id: string;
  name: string;
  caloriesPerUnit: number;
  unitType: 'piece' | '100g' | '100ml';
  category: 'protein' | 'carbs' | 'dairy' | 'beverages';
  description: string;
}

export const FOOD_CONSTANTS: FoodConstant[] = [
  // Proteins
  {
    id: 'egg-large',
    name: 'Egg (Large)',
    caloriesPerUnit: 63,
    unitType: 'piece',
    category: 'protein',
    description: 'Large chicken egg (~50g)',
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    caloriesPerUnit: 165,
    unitType: '100g',
    category: 'protein',
    description: 'Skinless, boneless chicken breast',
  },
  {
    id: 'minced-beef',
    name: 'Minced Beef',
    caloriesPerUnit: 225,
    unitType: '100g',
    category: 'protein',
    description: 'Minced beef (85% lean)',
  },
  
  
  // Carbs & Legumes
  {
    id: 'brown-toast',
    name: 'Brown Toast',
    caloriesPerUnit: 100,
    unitType: 'piece',
    category: 'carbs',
    description: 'Single slice of brown toast (~35g)',
  },
  {
    id: 'brown-bread',
    name: 'Brown Bread',
    caloriesPerUnit: 255,
    unitType: 'piece',
    category: 'carbs',
    description: 'Single load of brown bread (~90g)',
  },
  {
    id: 'whole-wheat-bread',
    name: 'Whole Wheat Toast',
    caloriesPerUnit: 90,
    unitType: 'piece',
    category: 'carbs',
    description: 'Single slice of whole wheat toast (~35g)',
  },
  {
    id: 'chickpeas-cooked',
    name: 'Chickpeas (Cooked)',
    caloriesPerUnit: 164,
    unitType: '100g',
    category: 'carbs',
    description: 'Cooked chickpeas/garbanzo beans',
  },
  {
    id: 'fava-beans-cooked',
    name: 'Fava Beans (Cooked)',
    caloriesPerUnit: 125,
    unitType: '100g',
    category: 'carbs',
    description: 'Cooked fava beans',
  },
  {
    id: 'lupine-cooked',
    name: 'Lupine (Cooked)',
    caloriesPerUnit: 135,
    unitType: '100g',
    category: 'carbs',
    description: 'Cooked lupine',
  },
 
  
  // Dairy
  {
    id: 'greek-yogurt-lite',
    name: 'Lite Greek Yogurt',
    caloriesPerUnit: 59,
    unitType: '100g',
    category: 'dairy',
    description: 'Low-fat Greek yogurt (0-2% fat)',
  },
  {
    id: 'greek-yogurt-regular',
    name: 'Regular Greek Yogurt',
    caloriesPerUnit: 97,
    unitType: '100g',
    category: 'dairy',
    description: 'Regular Greek yogurt (whole milk)',
  },
  {
    id: 'cottage-cheese',
    name: 'Cottage Cheese',
    caloriesPerUnit: 115,
    unitType: '100g',
    category: 'dairy',
    description: 'Cottage cheese',
  },

  // Beverages
  {
    id: 'orange-juice',
    name: 'Orange Juice',
    caloriesPerUnit: 45,
    unitType: '100ml',
    category: 'beverages',
    description: 'Fresh orange juice (unsweetened)',
  },
  {
    id: 'apple-juice',
    name: 'Apple Juice',
    caloriesPerUnit: 46,
    unitType: '100ml',
    category: 'beverages',
    description: 'Apple juice (unsweetened)',
  },
  {
    id: 'grape-juice',
    name: 'Grape Juice',
    caloriesPerUnit: 60,
    unitType: '100ml',
    category: 'beverages',
    description: 'Grape juice (unsweetened)',
  },
  {
    id: 'cranberry-juice',
    name: 'Cranberry Juice',
    caloriesPerUnit: 46,
    unitType: '100ml',
    category: 'beverages',
    description: 'Cranberry juice cocktail',
  },
  {
    id: 'coffee-black',
    name: 'Coffee (Black)',
    caloriesPerUnit: 2,
    unitType: '100ml',
    category: 'beverages',
    description: 'Black coffee, no additives',
  },
  {
    id: 'coffee-milk',
    name: 'Coffee with Milk',
    caloriesPerUnit: 15,
    unitType: '100ml',
    category: 'beverages',
    description: 'Coffee with whole milk',
  },
  {
    id: 'coffee-sugar',
    name: 'Coffee with Sugar',
    caloriesPerUnit: 20,
    unitType: '100ml',
    category: 'beverages',
    description: 'Black coffee with 1 tsp sugar',
  },
  {
    id: 'coffee-milk-sugar',
    name: 'Coffee with Milk & Sugar',
    caloriesPerUnit: 35,
    unitType: '100ml',
    category: 'beverages',
    description: 'Coffee with milk and sugar',
  },
  {
    id: 'tea-black',
    name: 'Tea (Black)',
    caloriesPerUnit: 1,
    unitType: '100ml',
    category: 'beverages',
    description: 'Black tea, no additives',
  },
  {
    id: 'tea-milk',
    name: 'Tea with Milk',
    caloriesPerUnit: 12,
    unitType: '100ml',
    category: 'beverages',
    description: 'Tea with whole milk',
  },
  {
    id: 'tea-sugar',
    name: 'Tea with Sugar',
    caloriesPerUnit: 17,
    unitType: '100ml',
    category: 'beverages',
    description: 'Black tea with 1 tsp sugar',
  },
  {
    id: 'tea-milk-sugar',
    name: 'Tea with Milk & Sugar',
    caloriesPerUnit: 30,
    unitType: '100ml',
    category: 'beverages',
    description: 'Tea with milk and sugar',
  },
  {
    id: 'green-tea',
    name: 'Green Tea',
    caloriesPerUnit: 0,
    unitType: '100ml',
    category: 'beverages',
    description: 'Plain green tea',
  },
  {
    id: 'herbal-tea',
    name: 'Herbal Tea',
    caloriesPerUnit: 1,
    unitType: '100ml',
    category: 'beverages',
    description: 'Herbal tea (chamomile, peppermint, etc.)',
  },
];

export const FOOD_CATEGORIES = {
  protein: { name: 'Protein', color: 'bg-red-100 border-red-200' },
  carbs: { name: 'Carbs & Legumes', color: 'bg-yellow-100 border-yellow-200' },
  dairy: { name: 'Dairy', color: 'bg-blue-100 border-blue-200' },
  beverages: { name: 'Beverages', color: 'bg-teal-100 border-teal-200' },
} as const;

// Helper function to calculate calories based on quantity and unit type
export function calculateCalories(food: FoodConstant, quantity: number, inputUnit: 'pieces' | 'grams' | 'ml'): number {
  if (food.unitType === 'piece' && inputUnit === 'pieces') {
    return food.caloriesPerUnit * quantity;
  }
  
  if (food.unitType === '100g' && inputUnit === 'grams') {
    return (food.caloriesPerUnit * quantity) / 100;
  }

  if (food.unitType === '100ml' && inputUnit === 'ml') {
    return (food.caloriesPerUnit * quantity) / 100;
  }
  
  // Convert between units when necessary
  if (food.unitType === 'piece' && inputUnit === 'grams') {
    // For pieces, assume average weights (this is an approximation)
    const avgWeight = getAverageWeightForFood(food.id);
    const pieces = quantity / avgWeight;
    return food.caloriesPerUnit * pieces;
  }
  
  if (food.unitType === '100g' && inputUnit === 'pieces') {
    // For 100g foods, assume average piece weights
    const avgWeight = getAverageWeightForFood(food.id);
    const totalGrams = quantity * avgWeight;
    return (food.caloriesPerUnit * totalGrams) / 100;
  }

  if (food.unitType === '100ml' && (inputUnit === 'pieces' || inputUnit === 'grams')) {
    // For beverages, assume 1 piece = 250ml (1 cup)
    const mlPerPiece = inputUnit === 'pieces' ? 250 : 1; // 1 gram ≈ 1 ml for liquids
    const totalMl = quantity * mlPerPiece;
    return (food.caloriesPerUnit * totalMl) / 100;
  }
  
  return 0;
}

// Helper function to get average weights for foods measured in pieces
function getAverageWeightForFood(foodId: string): number {
  const weights: { [key: string]: number } = {
    'egg-large': 50, // grams
    'white-bread': 25, // grams
    'whole-wheat-bread': 25, // grams
    // For foods typically measured in 100g, assume 100g as default
    'chicken-breast': 100,
    'lean-beef': 100,
    'lamb-meat': 100,
    'chickpeas-cooked': 100,
    'chickpeas-raw': 100,
    'greek-yogurt-lite': 100,
    'greek-yogurt-regular': 100,
  };
  
  return weights[foodId] || 100;
}

// Get foods by category for organized display
export function getFoodsByCategory() {
  const categorized = FOOD_CONSTANTS.reduce((acc, food) => {
    if (!acc[food.category]) {
      acc[food.category] = [];
    }
    acc[food.category].push(food);
    return acc;
  }, {} as Record<string, FoodConstant[]>);
  
  return categorized;
}
