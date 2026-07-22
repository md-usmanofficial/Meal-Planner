/**
 * Open Food Facts API wrapper — server-side.
 * Free, no API key required. Great for branded food products and barcodes.
 */

import { OPEN_FOOD_FACTS } from "@/constants/api";
import type { OpenFoodFactsProduct } from "@/types/nutrition";
import type { Food } from "@/types/nutrition";

const BASE_URL = OPEN_FOOD_FACTS.BASE_URL;

// ---------------------------------------------------------------------------
// API Methods
// ---------------------------------------------------------------------------

/**
 * Search products by name/keyword.
 */
export async function searchProducts(
  query: string,
  page = 1,
  pageSize = 20
): Promise<{ products: OpenFoodFactsProduct[]; count: number }> {
  const url = new URL(OPEN_FOOD_FACTS.SEARCH_URL);
  url.searchParams.set("action", "process");
  url.searchParams.set("json", "1");
  url.searchParams.set("search_terms", query);
  url.searchParams.set("page", String(page));
  url.searchParams.set("page_size", String(pageSize));
  url.searchParams.set("sort_by", OPEN_FOOD_FACTS.DEFAULTS.SORT_BY);
  url.searchParams.set(
    "fields",
    "code,product_name,image_url,image_thumb_url,brands,quantity,serving_size,nutriments"
  );

  const response = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Open Food Facts API error: ${response.status}`);
  }

  const data = await response.json();
  return {
    products: (data.products ?? []) as OpenFoodFactsProduct[],
    count: data.count ?? 0,
  };
}

/**
 * Look up a product by barcode.
 */
export async function getProductByBarcode(
  barcode: string
): Promise<OpenFoodFactsProduct | null> {
  const endpoint = OPEN_FOOD_FACTS.ENDPOINTS.PRODUCT_BY_BARCODE.replace(
    "{barcode}",
    barcode
  );
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, { next: { revalidate: 3600 } });

  if (!response.ok) return null;

  const data = await response.json();
  if (data.status === 0) return null; // Product not found

  return data.product as OpenFoodFactsProduct;
}

// ---------------------------------------------------------------------------
// Normalizer
// ---------------------------------------------------------------------------

/**
 * Normalize an Open Food Facts product to the internal Food type.
 * Always prefers per-100g values for consistent scaling.
 */
export function normalizeOpenFoodFactsProduct(
  raw: OpenFoodFactsProduct
): Food {
  const n = raw.nutriments;

  return {
    id: raw.code,
    source: "openfoodfacts",
    name: raw.product_name || "Unknown Product",
    brand: raw.brands || null,
    servingSize: 100,
    servingUnit: "g",
    nutrition: {
      calories: n["energy-kcal_100g"] ?? 0,
      proteinG: n.proteins_100g ?? 0,
      carbsG: n.carbohydrates_100g ?? 0,
      fatG: n.fat_100g ?? 0,
      fiberG: n.fiber_100g ?? null,
      sugarG: n.sugars_100g ?? null,
      sodiumMg: n.sodium_100g != null ? n.sodium_100g * 1000 : null,
    },
  };
}
