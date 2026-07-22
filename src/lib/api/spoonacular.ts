/**
 * Spoonacular API wrapper — server-side only.
 * Never call this from Client Components.
 * API key is protected via server environment variable.
 */

import { SPOONACULAR } from "@/constants/api";
import type {
  RecipeSearchFilters,
  SpoonacularRecipe,
  SpoonacularSearchResult,
  Recipe,
  RecipeNutrition,
} from "@/types/recipe";

const API_KEY = process.env.SPOONACULAR_API_KEY!;
const BASE_URL = SPOONACULAR.BASE_URL;

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function spoonacularFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("apiKey", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Spoonacular API error ${response.status}: ${errorBody}`
    );
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// Recipe Search
// ---------------------------------------------------------------------------

/**
 * Search recipes with complex filters (the primary search function).
 */
export async function searchRecipes(
  filters: RecipeSearchFilters
): Promise<SpoonacularSearchResult> {
  return spoonacularFetch<SpoonacularSearchResult>(
    SPOONACULAR.ENDPOINTS.SEARCH_RECIPES,
    {
      query: filters.query,
      cuisine: filters.cuisine,
      diet: filters.diet,
      intolerances: filters.intolerances,
      includeIngredients: filters.includeIngredients,
      excludeIngredients: filters.excludeIngredients,
      type: filters.type,
      maxReadyTime: filters.maxReadyTime,
      minCalories: filters.minCalories,
      maxCalories: filters.maxCalories,
      minProtein: filters.minProtein,
      maxCarbs: filters.maxCarbs,
      offset: filters.offset ?? 0,
      number: filters.number ?? SPOONACULAR.DEFAULTS.NUMBER,
      addRecipeInformation: true,
      addRecipeNutrition: true,
      fillIngredients: true,
    }
  );
}

/**
 * Get full recipe information by ID.
 */
export async function getRecipeById(id: number): Promise<SpoonacularRecipe> {
  const endpoint = SPOONACULAR.ENDPOINTS.RECIPE_INFO.replace("{id}", String(id));
  return spoonacularFetch<SpoonacularRecipe>(endpoint, {
    includeNutrition: true,
  });
}

/**
 * Search recipes by available ingredients.
 */
export async function searchByIngredients(
  ingredients: string[],
  number = 10
): Promise<SpoonacularRecipe[]> {
  return spoonacularFetch<SpoonacularRecipe[]>(
    SPOONACULAR.ENDPOINTS.SEARCH_BY_INGREDIENTS,
    {
      ingredients: ingredients.join(","),
      number,
      ranking: 1, // Maximize used ingredients
      ignorePantry: true,
    }
  );
}

/**
 * Get random recipes (useful for dashboard featured recipe widget).
 */
export async function getRandomRecipes(
  number = 1,
  tags?: string
): Promise<{ recipes: SpoonacularRecipe[] }> {
  return spoonacularFetch<{ recipes: SpoonacularRecipe[] }>(
    SPOONACULAR.ENDPOINTS.RANDOM_RECIPES,
    {
      number,
      tags,
    }
  );
}

// ---------------------------------------------------------------------------
// Normalizer — Convert Spoonacular format → internal Recipe format
// ---------------------------------------------------------------------------

/**
 * Normalize a Spoonacular recipe to the internal Recipe type.
 * Always use this before passing recipe data to components.
 */
export function normalizeSpoonacularRecipe(raw: SpoonacularRecipe): Recipe {
  const calories = extractNutrient(raw, "Calories");
  const protein = extractNutrient(raw, "Protein");
  const carbs = extractNutrient(raw, "Carbohydrates");
  const fat = extractNutrient(raw, "Fat");
  const fiber = extractNutrient(raw, "Fiber");
  const sugar = extractNutrient(raw, "Sugar");
  const sodium = extractNutrient(raw, "Sodium");

  const nutrition: RecipeNutrition | null =
    calories !== null
      ? {
          calories,
          proteinG: protein ?? 0,
          carbsG: carbs ?? 0,
          fatG: fat ?? 0,
          fiberG: fiber,
          sugarG: sugar,
          sodiumMg: sodium,
        }
      : null;

  const instructions =
    raw.analyzedInstructions?.[0]?.steps?.map((step) => ({
      stepNumber: step.number,
      description: step.step,
    })) ?? [];

  const ingredients =
    raw.extendedIngredients?.map((ing) => ({
      id: String(ing.id),
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      image: ing.image
        ? `https://img.spoonacular.com/ingredients_100x100/${ing.image}`
        : null,
    })) ?? [];

  return {
    id: String(raw.id),
    source: "spoonacular",
    title: raw.title,
    image: raw.image,
    readyInMinutes: raw.readyInMinutes,
    servings: raw.servings,
    cuisines: raw.cuisines ?? [],
    diets: raw.diets ?? [],
    dishTypes: raw.dishTypes ?? [],
    summary: raw.summary ?? "",
    instructions,
    ingredients,
    nutrition,
    healthScore: raw.healthScore ?? null,
    aggregateLikes: raw.aggregateLikes ?? null,
    sourceUrl: raw.sourceUrl ?? null,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractNutrient(
  recipe: SpoonacularRecipe,
  name: string
): number | null {
  const nutrient = recipe.nutrition?.nutrients?.find(
    (n) => n.name.toLowerCase() === name.toLowerCase()
  );
  return nutrient?.amount ?? null;
}
