/**
 * USDA FoodData Central API wrapper — server-side only.
 * Provides authoritative, accurate nutrition data.
 * Free API — requires registration for a key.
 */

import { USDA } from "@/constants/api";
import type { USDAFood, USDANutrient, USDASearchResult } from "@/types/nutrition";
import type { Food } from "@/types/nutrition";

const API_KEY = process.env.USDA_API_KEY!;
const BASE_URL = USDA.BASE_URL;

// USDA Nutrient IDs for the main macros we care about
const NUTRIENT_IDS = {
  CALORIES: 1008,     // Energy (kcal)
  PROTEIN: 1003,      // Protein (g)
  CARBS: 1005,        // Carbohydrate, by difference (g)
  FAT: 1004,          // Total lipid (fat) (g)
  FIBER: 1079,        // Fiber, total dietary (g)
  SUGAR: 2000,        // Sugars, total (g)
  SODIUM: 1093,       // Sodium (mg)
} as const;

// ---------------------------------------------------------------------------
// HTTP helper
// ---------------------------------------------------------------------------

async function usdaFetch<T>(
  endpoint: string,
  params: Record<string, string | number | readonly string[] | string[]> = {}
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", API_KEY);

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v));
    } else {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`USDA API error ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

/**
 * Search for foods in the USDA database.
 */
export async function searchFoods(
  query: string,
  pageNumber = 1,
  pageSize = 20
): Promise<USDASearchResult> {
  return usdaFetch<USDASearchResult>(USDA.ENDPOINTS.SEARCH, {
    query,
    dataType: [...USDA.DEFAULTS.DATA_TYPE],
    pageSize,
    pageNumber,
    sortBy: "dataType.keyword",
    sortOrder: "asc",
  });
}

/**
 * Get full food details by FDC ID.
 */
export async function getFoodById(fdcId: number): Promise<USDAFood> {
  const endpoint = USDA.ENDPOINTS.FOOD_DETAIL.replace("{fdcId}", String(fdcId));
  return usdaFetch<USDAFood>(endpoint);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNutrientValue(
  nutrients: USDANutrient[],
  nutrientId: number
): number | null {
  const nutrient = nutrients.find((n) => n.nutrientId === nutrientId);
  return nutrient?.value ?? null;
}

// ---------------------------------------------------------------------------
// Normalizer
// ---------------------------------------------------------------------------

/**
 * Normalize a USDA food item to the internal Food type.
 */
export function normalizeUSDAFood(raw: USDAFood): Food {
  const nutrients = raw.foodNutrients ?? [];

  const calories = getNutrientValue(nutrients, NUTRIENT_IDS.CALORIES) ?? 0;
  const protein = getNutrientValue(nutrients, NUTRIENT_IDS.PROTEIN) ?? 0;
  const carbs = getNutrientValue(nutrients, NUTRIENT_IDS.CARBS) ?? 0;
  const fat = getNutrientValue(nutrients, NUTRIENT_IDS.FAT) ?? 0;
  const fiber = getNutrientValue(nutrients, NUTRIENT_IDS.FIBER);
  const sugar = getNutrientValue(nutrients, NUTRIENT_IDS.SUGAR);
  const sodium = getNutrientValue(nutrients, NUTRIENT_IDS.SODIUM);

  return {
    id: String(raw.fdcId),
    source: "usda",
    name: raw.description,
    brand: raw.brandOwner ?? raw.brandName ?? null,
    servingSize: raw.servingSize ?? 100,
    servingUnit: raw.servingSizeUnit ?? "g",
    nutrition: {
      calories,
      proteinG: protein,
      carbsG: carbs,
      fatG: fat,
      fiberG: fiber ?? undefined,
      sugarG: sugar ?? undefined,
      sodiumMg: sodium ?? undefined,
    },
  };
}
