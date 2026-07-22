/**
 * TypeScript types for nutrition data and food logging.
 */

export interface Macros {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
}

export interface NutritionCalculationResult {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  goalCalories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}

// ---------------------------------------------------------------------------
// USDA FoodData Types
// ---------------------------------------------------------------------------

export interface USDAFood {
  fdcId: number;
  description: string;
  dataType: string;
  brandOwner?: string;
  brandName?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients: USDANutrient[];
  foodCategory?: string;
}

export interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  value: number;
}

export interface USDASearchResult {
  totalHits: number;
  currentPage: number;
  totalPages: number;
  foods: USDAFood[];
}

// ---------------------------------------------------------------------------
// Open Food Facts Types
// ---------------------------------------------------------------------------

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  image_url: string;
  image_thumb_url: string;
  brands: string;
  quantity: string;
  serving_size: string;
  nutriments: {
    "energy-kcal_100g"?: number;
    "energy-kcal_serving"?: number;
    proteins_100g?: number;
    proteins_serving?: number;
    carbohydrates_100g?: number;
    carbohydrates_serving?: number;
    fat_100g?: number;
    fat_serving?: number;
    fiber_100g?: number;
    fiber_serving?: number;
    sugars_100g?: number;
    sodium_100g?: number;
  };
}

// ---------------------------------------------------------------------------
// Normalized Food Type (internal)
// ---------------------------------------------------------------------------

/**
 * Unified food representation regardless of source API.
 */
export interface Food {
  id: string;
  source: "usda" | "openfoodfacts";
  name: string;
  brand: string | null;
  servingSize: number;
  servingUnit: string;
  /** Nutrition per serving */
  nutrition: Macros & {
    sugarG?: number | null;
    sodiumMg?: number | null;
  };
}

// ---------------------------------------------------------------------------
// Food Log Entry
// ---------------------------------------------------------------------------

export interface FoodLogEntry {
  id: string;
  userId: string;
  date: Date;
  foodId: string;
  foodName: string;
  foodData: Food;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number | null;
  mealType: import("./meal").MealType;
  createdAt: Date;
}

export interface FoodLogFormData {
  foodId: string;
  foodName: string;
  quantity: number;
  unit: string;
  mealType: import("./meal").MealType;
  date: Date;
}
