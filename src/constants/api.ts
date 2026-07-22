/**
 * External API configuration constants.
 * API keys are accessed from environment variables — never hardcode them.
 */

// ---------------------------------------------------------------------------
// Spoonacular — Primary recipe and nutrition API
// Docs: https://spoonacular.com/food-api/docs
// ---------------------------------------------------------------------------
export const SPOONACULAR = {
  BASE_URL: "https://api.spoonacular.com",
  ENDPOINTS: {
    SEARCH_RECIPES: "/recipes/complexSearch",
    RECIPE_INFO: "/recipes/{id}/information",
    RECIPE_NUTRITION: "/recipes/{id}/nutritionWidget.json",
    RECIPE_INSTRUCTIONS: "/recipes/{id}/analyzedInstructions",
    SEARCH_BY_INGREDIENTS: "/recipes/findByIngredients",
    RANDOM_RECIPES: "/recipes/random",
    AUTOCOMPLETE: "/recipes/autocomplete",
    FOOD_SEARCH: "/food/ingredients/search",
    INGREDIENT_INFO: "/food/ingredients/{id}/information",
  },
  // Default query params
  DEFAULTS: {
    NUMBER: 12,        // Results per page
    ADD_RECIPE_INFO: true,
    ADD_RECIPE_NUTRITION: true,
  },
} as const;

// ---------------------------------------------------------------------------
// TheMealDB — Free recipe fallback API (no key required)
// Docs: https://www.themealdb.com/api.php
// ---------------------------------------------------------------------------
export const THEMEALDB = {
  BASE_URL: "https://www.themealdb.com/api/json/v1/1",
  ENDPOINTS: {
    SEARCH_BY_NAME: "/search.php",
    LOOKUP_BY_ID: "/lookup.php",
    RANDOM: "/random.php",
    CATEGORIES: "/categories.php",
    FILTER_BY_CATEGORY: "/filter.php",
    FILTER_BY_INGREDIENT: "/filter.php",
    LIST_CATEGORIES: "/list.php?c=list",
    LIST_INGREDIENTS: "/list.php?i=list",
  },
} as const;

// ---------------------------------------------------------------------------
// Open Food Facts — Food search and nutrition (no key required)
// Docs: https://world.openfoodfacts.org/data
// ---------------------------------------------------------------------------
export const OPEN_FOOD_FACTS = {
  BASE_URL: "https://world.openfoodfacts.org",
  SEARCH_URL: "https://search.openfoodfacts.org/cgi/search.pl",
  ENDPOINTS: {
    PRODUCT_BY_BARCODE: "/api/v0/product/{barcode}.json",
    SEARCH: "/cgi/search.pl",
  },
  DEFAULTS: {
    PAGE_SIZE: 20,
    SORT_BY: "popularity",
  },
} as const;

// ---------------------------------------------------------------------------
// USDA FoodData Central — Authoritative nutrition data
// Docs: https://fdc.nal.usda.gov/api-guide.html
// ---------------------------------------------------------------------------
export const USDA = {
  BASE_URL: "https://api.nal.usda.gov/fdc/v1",
  ENDPOINTS: {
    SEARCH: "/foods/search",
    FOOD_DETAIL: "/food/{fdcId}",
    FOODS_LIST: "/foods/list",
  },
  DEFAULTS: {
    PAGE_SIZE: 20,
    DATA_TYPE: ["Survey (FNDDS)", "SR Legacy", "Branded"],
  },
} as const;
