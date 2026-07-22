/**
 * TheMealDB API wrapper — server-side.
 * Free, no API key required. Used as fallback for Spoonacular.
 */

import { THEMEALDB } from "@/constants/api";
import type { TheMealDBMeal, TheMealDBSearchResult, Recipe } from "@/types/recipe";

const BASE_URL = THEMEALDB.BASE_URL;

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function mealDBFetch<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`TheMealDB API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

/**
 * Search recipes by name.
 */
export async function searchMealsByName(
  name: string
): Promise<TheMealDBMeal[]> {
  const result = await mealDBFetch<TheMealDBSearchResult>(
    THEMEALDB.ENDPOINTS.SEARCH_BY_NAME,
    { s: name }
  );
  return result.meals ?? [];
}

/**
 * Get full meal details by ID.
 */
export async function getMealById(id: string): Promise<TheMealDBMeal | null> {
  const result = await mealDBFetch<TheMealDBSearchResult>(
    THEMEALDB.ENDPOINTS.LOOKUP_BY_ID,
    { i: id }
  );
  return result.meals?.[0] ?? null;
}

/**
 * Get a random meal.
 */
export async function getRandomMeal(): Promise<TheMealDBMeal | null> {
  const result = await mealDBFetch<TheMealDBSearchResult>(
    THEMEALDB.ENDPOINTS.RANDOM
  );
  return result.meals?.[0] ?? null;
}

// ---------------------------------------------------------------------------
// Normalizer — TheMealDB → internal Recipe format
// ---------------------------------------------------------------------------

/**
 * Extract ingredient/measure pairs from TheMealDB's flat structure.
 */
function extractIngredients(
  meal: TheMealDBMeal
): { id: string; name: string; amount: number; unit: string; image: string | null }[] {
  const ingredients: { id: string; name: string; amount: number; unit: string; image: string | null }[] = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient && ingredient.trim()) {
      const cleanMeasure = (measure ?? "").trim();
      const parsed = parseFloat(cleanMeasure);

      ingredients.push({
        id: `${meal.idMeal}-ing-${i}`,
        name: ingredient.trim(),
        amount: isNaN(parsed) ? 1 : parsed,
        unit: isNaN(parsed) ? cleanMeasure : cleanMeasure.replace(String(parsed), "").trim(),
        image: `https://www.themealdb.com/images/ingredients/${encodeURIComponent(ingredient.trim())}-Small.png`,
      });
    }
  }

  return ingredients;
}

/**
 * Normalize a TheMealDB meal to the internal Recipe type.
 * Note: TheMealDB does not provide nutrition data.
 */
export function normalizeTheMealDBRecipe(meal: TheMealDBMeal): Recipe {
  const ingredients = extractIngredients(meal);

  // Parse instructions into numbered steps
  const rawSteps = meal.strInstructions
    ?.split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

  const instructions = rawSteps.map((step, index) => ({
    stepNumber: index + 1,
    description: step,
  }));

  return {
    id: meal.idMeal,
    source: "themealdb",
    title: meal.strMeal,
    image: meal.strMealThumb,
    readyInMinutes: 30, // TheMealDB doesn't provide this, use a default
    servings: 4,        // TheMealDB doesn't provide this, use a default
    cuisines: meal.strArea ? [meal.strArea] : [],
    diets: [],          // TheMealDB doesn't provide diet tags
    dishTypes: meal.strCategory ? [meal.strCategory] : [],
    summary: `A ${meal.strCategory} recipe from ${meal.strArea || "around the world"}.`,
    instructions,
    ingredients,
    nutrition: null,    // TheMealDB does not provide nutrition data
    healthScore: null,
    aggregateLikes: null,
    sourceUrl: meal.strSource,
  };
}
