/**
 * TypeScript types for meal plans and individual meals.
 */

export type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "DESSERT";
export type PlanType = "DAILY" | "WEEKLY" | "MONTHLY";

export interface MealPlan {
  id: string;
  userId: string;
  name: string | null;
  startDate: Date;
  endDate: Date;
  planType: PlanType;
  meals: Meal[];
  isSaved: boolean;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meal {
  id: string;
  mealPlanId: string;
  mealType: MealType;
  recipeId: string | null;
  recipeData: MealRecipeSnapshot | null;
  servings: number;
  date: Date;
  isCompleted: boolean;
  createdAt: Date;
}

/**
 * Snapshot of recipe data stored with the meal (from API at save time)
 */
export interface MealRecipeSnapshot {
  id: string;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  source: "spoonacular" | "themealdb";
}

/**
 * A day's meals grouped by meal type — used for UI rendering
 */
export interface DayMealGroup {
  date: Date;
  breakfast: Meal | null;
  lunch: Meal | null;
  dinner: Meal | null;
  snack: Meal | null;
  dessert: Meal | null;
  totalCalories: number;
  totalProteinG: number;
  totalCarbsG: number;
  totalFatG: number;
}

// Form data for creating/updating a meal plan
export interface MealPlanFormData {
  name?: string;
  planType: PlanType;
  startDate: Date;
  notes?: string;
}
