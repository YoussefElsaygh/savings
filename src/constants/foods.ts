/**
 * Food Constants for Calorie Tracking
 * Nutritional information based on USDA and common nutritional databases
 */

export interface FoodConstant {
  id: string;
  name: string;
  caloriesPerUnit: number;
  unitType: 'piece' | '100g' | '100ml';
  category: 'protein' | 'carbs' | 'dairy' | 'beverages' | 'unhealthy';
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
  {
    id: 'rice-cooked',
    name: 'Rice (Cooked)',
    caloriesPerUnit: 130,
    unitType: '100g',
    category: 'carbs',
    description: 'Cooked white rice',
  },
  {
    id: 'rice-brown-cooked',
    name: 'Brown Rice (Cooked)',
    caloriesPerUnit: 112,
    unitType: '100g',
    category: 'carbs',
    description: 'Cooked brown rice',
  },
  {
    id: 'macaroni-cooked',
    name: 'Macaroni (Cooked)',
    caloriesPerUnit: 158,
    unitType: '100g',
    category: 'carbs',
    description: 'Cooked macaroni pasta',
  },
  {
    id: 'pasta-cooked',
    name: 'Pasta (Cooked)',
    caloriesPerUnit: 160,
    unitType: '100g',
    category: 'carbs',
    description: 'Cooked pasta (general)',
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
    id: 'latte',
    name: 'Latte',
    caloriesPerUnit: 42,
    unitType: '100ml',
    category: 'beverages',
    description: 'Espresso with steamed milk',
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    caloriesPerUnit: 38,
    unitType: '100ml',
    category: 'beverages',
    description: 'Espresso with steamed milk and foam',
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

  // Unhealthy Foods
  {
    id: 'pizza-slice',
    name: 'Pizza Slice',
    caloriesPerUnit: 285,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Average pizza slice with cheese',
  },
  {
    id: 'burger',
    name: 'Burger',
    caloriesPerUnit: 540,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Fast food burger with bun and condiments',
  },
  {
    id: 'fries-small',
    name: 'Fries (Small)',
    caloriesPerUnit: 230,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Small portion of french fries',
  },
  {
    id: 'fries-large',
    name: 'Fries (Large)',
    caloriesPerUnit: 430,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Large portion of french fries',
  },
  {
    id: 'chocolate-bar',
    name: 'Chocolate Bar',
    caloriesPerUnit: 250,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Standard chocolate bar (45g)',
  },
  {
    id: 'donut',
    name: 'Donut',
    caloriesPerUnit: 250,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Glazed donut',
  },
  {
    id: 'ice-cream',
    name: 'Ice Cream',
    caloriesPerUnit: 207,
    unitType: '100g',
    category: 'unhealthy',
    description: 'Vanilla ice cream',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    caloriesPerUnit: 50,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Chocolate chip cookie (medium)',
  },
  {
    id: 'chips-bag',
    name: 'Chips (Small Bag)',
    caloriesPerUnit: 150,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Small bag of potato chips (28g)',
  },
  {
    id: 'soda',
    name: 'Soda',
    caloriesPerUnit: 42,
    unitType: '100ml',
    category: 'unhealthy',
    description: 'Regular cola or soft drink',
  },
  {
    id: 'candy-bar',
    name: 'Candy Bar',
    caloriesPerUnit: 280,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Chocolate candy bar (50g)',
  },
  {
    id: 'croissant',
    name: 'Croissant',
    caloriesPerUnit: 230,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Butter croissant',
  },
  {
    id: 'muffin',
    name: 'Muffin',
    caloriesPerUnit: 350,
    unitType: 'piece',
    category: 'unhealthy',
    description: 'Blueberry muffin (large)',
  },
  {
    id: 'fried-chicken',
    name: 'Fried Chicken',
    caloriesPerUnit: 320,
    unitType: '100g',
    category: 'unhealthy',
    description: 'Fried chicken breast with skin',
  },
];

export const FOOD_CATEGORIES = {
  protein: { name: 'Protein', color: 'bg-red-100 border-red-200' },
  carbs: { name: 'Carbs & Legumes', color: 'bg-yellow-100 border-yellow-200' },
  dairy: { name: 'Dairy', color: 'bg-blue-100 border-blue-200' },
  beverages: { name: 'Beverages', color: 'bg-teal-100 border-teal-200' },
  unhealthy: { name: '⚠️ Unhealthy Foods', color: 'bg-gray-100 border-gray-300' },
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
