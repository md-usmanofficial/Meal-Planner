/**
 * Rule-Based Recommendation Engine
 *
 * Converts a user's profile into API query filters for Spoonacular.
 * No AI — pure application logic using documented rules.
 */

import type { DietaryPreference, Goal, UserProfile } from "@/types/profile";
import type { RecipeSearchFilters } from "@/types/recipe";
import type { NutritionGoal } from "@/types/profile";
import { MEAL_CALORIE_DISTRIBUTION } from "@/constants/nutrition";
import type { MealType } from "@/types/meal";

// ---------------------------------------------------------------------------
// Diet → Spoonacular diet param mapping
// ---------------------------------------------------------------------------

const DIET_MAP: Record<DietaryPreference, string | null> = {
  NONE: null,
  VEGETARIAN: "vegetarian",
  VEGAN: "vegan",
  HALAL: null,          // Handled via exclude ingredients
  KETO: "ketogenic",
  GLUTEN_FREE: "gluten free",
  PALEO: "paleo",
};

// ---------------------------------------------------------------------------
// Allergy → Spoonacular intolerance param mapping
// ---------------------------------------------------------------------------

const ALLERGY_MAP: Record<string, string> = {
  gluten: "gluten",
  wheat: "wheat",
  dairy: "dairy",
  egg: "egg",
  nuts: "tree nut",
  peanut: "peanut",
  peanuts: "peanut",
  shellfish: "shellfish",
  seafood: "seafood",
  soy: "soy",
  sesame: "sesame",
  sulfite: "sulfite",
};

// ---------------------------------------------------------------------------
// Goal → Calorie range rules
// ---------------------------------------------------------------------------

interface CalorieRange {
  minCalories?: number;
  maxCalories?: number;
}

function getCalorieRangeForMeal(
  goal: Goal,
  nutritionGoal: NutritionGoal | null,
  mealType: MealType
): CalorieRange {
  if (!nutritionGoal?.calories) return {};

  const distribution = MEAL_CALORIE_DISTRIBUTION[mealType];
  const targetMealCalories = Math.round(nutritionGoal.calories * distribution);
  const tolerance = 0.2; // ±20% tolerance

  return {
    minCalories: Math.round(targetMealCalories * (1 - tolerance)),
    maxCalories: Math.round(targetMealCalories * (1 + tolerance)),
  };
}

// ---------------------------------------------------------------------------
// Main recommendation filter builder
// ---------------------------------------------------------------------------

/**
 * Build Spoonacular API search filters from a user's profile.
 * Used by the meal plan generator and recipe recommendations.
 *
 * @param profile - User profile from database
 * @param nutritionGoal - User's calculated nutrition goals
 * @param mealType - The meal type being planned (affects calorie targets)
 * @param overrides - Any additional filter overrides
 */
export function buildRecipeFilters(
  profile: UserProfile,
  nutritionGoal: NutritionGoal | null,
  mealType: MealType,
  overrides: Partial<RecipeSearchFilters> = {}
): RecipeSearchFilters {
  const filters: RecipeSearchFilters = {
    number: 10,
    type: getMealTypeQuery(mealType),
  };

  // --- Diet preference ---
  const diet = DIET_MAP[profile.dietaryPreference];
  if (diet) {
    filters.diet = diet;
  }

  // --- Halal: exclude pork and alcohol-related ingredients ---
  if (profile.dietaryPreference === "HALAL") {
    filters.excludeIngredients = "pork,ham,lard,bacon,beer,wine,alcohol,gelatin";
  }

  // --- Allergies → intolerances ---
  if (profile.allergies.length > 0) {
    const intolerances = profile.allergies
      .map((a) => ALLERGY_MAP[a.toLowerCase()])
      .filter(Boolean)
      .join(",");
    if (intolerances) {
      filters.intolerances = intolerances;
    }
  }

  // --- Calorie range based on goal and meal type ---
  const calorieRange = getCalorieRangeForMeal(
    profile.goal,
    nutritionGoal,
    mealType
  );
  Object.assign(filters, calorieRange);

  // --- Goal-specific overrides ---
  applyGoalRules(filters, profile.goal, nutritionGoal);

  // --- Apply caller overrides last (highest priority) ---
  Object.assign(filters, overrides);

  return filters;
}

/**
 * Apply goal-specific rules on top of the base filters.
 */
function applyGoalRules(
  filters: RecipeSearchFilters,
  goal: Goal,
  nutritionGoal: NutritionGoal | null
): void {
  switch (goal) {
    case "WEIGHT_LOSS":
      // High protein and fiber, lower fat
      filters.minProtein = 20;
      break;

    case "MUSCLE_GAIN":
      // Very high protein
      filters.minProtein = 30;
      break;

    case "WEIGHT_GAIN":
    case "MAINTENANCE":
      // No additional restrictions — balanced macros
      break;
  }

  // Keto diet also enforces carb limit regardless of goal
  if (
    nutritionGoal &&
    filters.diet === "ketogenic" &&
    !filters.maxCarbs
  ) {
    filters.maxCarbs = 10;
  }
}

/**
 * Map internal MealType to Spoonacular meal type query param.
 */
function getMealTypeQuery(mealType: MealType): string {
  const map: Record<MealType, string> = {
    BREAKFAST: "breakfast",
    LUNCH: "main course",
    DINNER: "main course",
    SNACK: "snack,appetizer",
    DESSERT: "dessert",
  };
  return map[mealType];
}

// ---------------------------------------------------------------------------
// Scoring / Ranking
// ---------------------------------------------------------------------------

/**
 * Score a recipe by how well it matches the user's nutritional targets.
 * Returns a score from 0–100 (higher = better match).
 */
export function scoreRecipeMatch(
  recipeNutrition: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  },
  targetNutrition: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  }
): number {
  const score = (actual: number, target: number): number => {
    if (target === 0) return 100;
    const deviation = Math.abs(actual - target) / target;
    return Math.max(0, 100 - deviation * 100);
  };

  const calorieScore = score(recipeNutrition.calories, targetNutrition.calories) * 0.4;
  const proteinScore = score(recipeNutrition.proteinG, targetNutrition.proteinG) * 0.3;
  const carbScore = score(recipeNutrition.carbsG, targetNutrition.carbsG) * 0.15;
  const fatScore = score(recipeNutrition.fatG, targetNutrition.fatG) * 0.15;

  return Math.round(calorieScore + proteinScore + carbScore + fatScore);
}
