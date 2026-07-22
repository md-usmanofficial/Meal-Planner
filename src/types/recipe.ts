/**
 * TypeScript types for recipe data from external APIs.
 */

// ---------------------------------------------------------------------------
// Spoonacular Types
// ---------------------------------------------------------------------------

export interface SpoonacularRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  instructions: string;
  analyzedInstructions: SpoonacularInstruction[];
  extendedIngredients: SpoonacularIngredient[];
  nutrition?: SpoonacularNutrition;
  aggregateLikes: number;
  healthScore: number;
  pricePerServing: number;
}

export interface SpoonacularInstruction {
  name: string;
  steps: SpoonacularStep[];
}

export interface SpoonacularStep {
  number: number;
  step: string;
  ingredients: SpoonacularStepItem[];
  equipment: SpoonacularStepItem[];
}

export interface SpoonacularStepItem {
  id: number;
  name: string;
  localizedName: string;
  image: string;
}

export interface SpoonacularIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: SpoonacularMeasure;
    metric: SpoonacularMeasure;
  };
}

export interface SpoonacularMeasure {
  amount: number;
  unitShort: string;
  unitLong: string;
}

export interface SpoonacularNutrition {
  nutrients: SpoonacularNutrient[];
  properties: SpoonacularNutrient[];
  ingredients: SpoonacularIngredientNutrition[];
  caloricBreakdown: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
  weightPerServing: {
    amount: number;
    unit: string;
  };
}

export interface SpoonacularNutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

export interface SpoonacularIngredientNutrition {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: SpoonacularNutrient[];
}

export interface SpoonacularSearchResult {
  results: SpoonacularRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

// ---------------------------------------------------------------------------
// TheMealDB Types
// ---------------------------------------------------------------------------

export interface TheMealDBMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate: string | null;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags: string | null;
  strYoutube: string | null;
  strSource: string | null;
  // Ingredient/measure pairs (1-20)
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
}

export interface TheMealDBSearchResult {
  meals: TheMealDBMeal[] | null;
}

export interface TheMealDBCategory {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
}

// ---------------------------------------------------------------------------
// Normalized Recipe Type (used internally across the app)
// ---------------------------------------------------------------------------

/**
 * A unified recipe format that works regardless of the source API.
 * All external recipe data should be normalized to this format
 * before use in the application.
 */
export interface Recipe {
  id: string;
  source: "spoonacular" | "themealdb" | "custom";
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  cuisines: string[];
  diets: string[];
  dishTypes: string[];
  summary: string;
  instructions: RecipeInstruction[];
  ingredients: RecipeIngredient[];
  nutrition: RecipeNutrition | null;
  healthScore?: number | null;
  aggregateLikes?: number | null;
  sourceUrl?: string | null;
}

export interface RecipeInstruction {
  stepNumber: number;
  description: string;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  image?: string | null;
}

export type Ingredient = RecipeIngredient;
export type InstructionStep = RecipeInstruction;

export interface RecipeNutrition {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number | null;
  sugarG?: number | null;
  sodiumMg?: number | null;
}

// ---------------------------------------------------------------------------
// Recipe Search Filters
// ---------------------------------------------------------------------------

export interface RecipeSearchFilters {
  query?: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  includeIngredients?: string;
  excludeIngredients?: string;
  type?: string;      // breakfast, lunch, dinner, snack, etc.
  maxReadyTime?: number;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxCarbs?: number;
  offset?: number;
  number?: number;
}
