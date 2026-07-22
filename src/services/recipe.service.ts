/**
 * Recipe Service — Unified service combining Spoonacular & TheMealDB.
 *
 * Uses Spoonacular as the primary rich data provider (with nutrition & macro breakdown).
 * Falls back to TheMealDB or curated fallback recipes if Spoonacular API key is not set or fails.
 */

import {
  searchRecipes as searchSpoonacular,
  getRecipeById as getSpoonacularById,
  searchByIngredients as searchSpoonacularIngredients,
  getRandomRecipes as getRandomSpoonacular,
  normalizeSpoonacularRecipe,
} from "@/lib/api/spoonacular";
import {
  searchMealsByName as searchMealDB,
  getMealById as getMealDBById,
  normalizeTheMealDBRecipe,
} from "@/lib/api/themealdb";
import type { Recipe, RecipeSearchFilters } from "@/types/recipe";

// Sample high-quality fallback recipes for zero-latency local development
const FALLBACK_RECIPES: Recipe[] = [
  {
    id: "fb-1",
    source: "spoonacular",
    title: "Shrimp Stir-Fry with Brown Rice",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 30,
    servings: 2,
    cuisines: ["Asian"],
    diets: ["gluten free", "dairy free"],
    dishTypes: ["main course"],
    summary: "A quick and healthy stir-fry with nutritious shrimp, broccoli, vegetables, and brown rice.",
    instructions: [
      { stepNumber: 1, description: "Heat sesame oil in a wok or large skillet over high heat." },
      { stepNumber: 2, description: "Add minced garlic, ginger, and shrimp. Stir-fry for 2-3 minutes." },
      { stepNumber: 3, description: "Add broccoli florets, bell peppers, and soy sauce. Toss well for 4 minutes." },
      { stepNumber: 4, description: "Serve hot over cooked brown rice garnished with sesame seeds." },
    ],
    ingredients: [
      { id: "i1", name: "Shrimp", amount: 200, unit: "g", image: null },
      { id: "i2", name: "Brown Rice", amount: 150, unit: "g", image: null },
      { id: "i3", name: "Broccoli", amount: 100, unit: "g", image: null },
      { id: "i4", name: "Garlic", amount: 2, unit: "cloves", image: null },
      { id: "i5", name: "Soy Sauce", amount: 15, unit: "ml", image: null },
    ],
    nutrition: {
      calories: 450,
      proteinG: 38,
      carbsG: 52,
      fatG: 10,
      fiberG: 6,
      sugarG: 4,
      sodiumMg: 680,
    },
    healthScore: 92,
    aggregateLikes: 2840,
    sourceUrl: "https://example.com/shrimp-stir-fry",
  },
  {
    id: "fb-2",
    source: "spoonacular",
    title: "Avocado & Poached Egg Toast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 15,
    servings: 1,
    cuisines: ["American"],
    diets: ["vegetarian"],
    dishTypes: ["breakfast"],
    summary: "Crispy sourdough toast topped with mashed ripe avocado, poached egg, and red pepper flakes.",
    instructions: [
      { stepNumber: 1, description: "Toast sourdough bread until golden and crispy." },
      { stepNumber: 2, description: "Mash avocado with lemon juice, salt, and pepper." },
      { stepNumber: 3, description: "Poach an egg in simmering water for 3 minutes." },
      { stepNumber: 4, description: "Spread avocado on toast, top with poached egg and red pepper flakes." },
    ],
    ingredients: [
      { id: "i6", name: "Sourdough Bread", amount: 2, unit: "slices", image: null },
      { id: "i7", name: "Ripe Avocado", amount: 1, unit: "pc", image: null },
      { id: "i8", name: "Egg", amount: 1, unit: "pc", image: null },
      { id: "i9", name: "Lemon Juice", amount: 5, unit: "ml", image: null },
    ],
    nutrition: {
      calories: 350,
      proteinG: 16,
      carbsG: 32,
      fatG: 18,
      fiberG: 8,
      sugarG: 2,
      sodiumMg: 420,
    },
    healthScore: 88,
    aggregateLikes: 1950,
    sourceUrl: "https://example.com/avocado-toast",
  },
  {
    id: "fb-3",
    source: "spoonacular",
    title: "Mediterranean Quinoa & Kale Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 2,
    cuisines: ["Mediterranean"],
    diets: ["vegan", "gluten free"],
    dishTypes: ["lunch"],
    summary: "Fluffy quinoa tossed with fresh kale, cherry tomatoes, cucumbers, olives, and lemon dressing.",
    instructions: [
      { stepNumber: 1, description: "Rinse and cook quinoa in water for 15 minutes." },
      { stepNumber: 2, description: "Massage chopped kale with olive oil and salt." },
      { stepNumber: 3, description: "Combine quinoa, kale, diced cucumber, tomatoes, and kalamata olives." },
      { stepNumber: 4, description: "Drizzle with extra virgin olive oil and lemon juice." },
    ],
    ingredients: [
      { id: "i10", name: "Quinoa", amount: 150, unit: "g", image: null },
      { id: "i11", name: "Fresh Kale", amount: 80, unit: "g", image: null },
      { id: "i12", name: "Cherry Tomatoes", amount: 100, unit: "g", image: null },
      { id: "i13", name: "Kalamata Olives", amount: 30, unit: "g", image: null },
    ],
    nutrition: {
      calories: 420,
      proteinG: 14,
      carbsG: 58,
      fatG: 16,
      fiberG: 9,
      sugarG: 3,
      sodiumMg: 350,
    },
    healthScore: 96,
    aggregateLikes: 3200,
    sourceUrl: "https://example.com/quinoa-bowl",
  },
  {
    id: "fb-4",
    source: "spoonacular",
    title: "Grilled Turkey Breast with Quinoa",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 25,
    servings: 2,
    cuisines: ["American"],
    diets: ["gluten free", "high protein"],
    dishTypes: ["dinner"],
    summary: "Lean grilled turkey breast seasoned with herbs, served with fluffy quinoa and steamed asparagus.",
    instructions: [
      { stepNumber: 1, description: "Season turkey breast with thyme, garlic powder, salt, and pepper." },
      { stepNumber: 2, description: "Grill turkey for 6-7 minutes per side until internal temp reaches 165°F." },
      { stepNumber: 3, description: "Steam asparagus for 4 minutes." },
      { stepNumber: 4, description: "Plate turkey with cooked quinoa and asparagus." },
    ],
    ingredients: [
      { id: "i14", name: "Turkey Breast", amount: 250, unit: "g", image: null },
      { id: "i15", name: "Quinoa", amount: 120, unit: "g", image: null },
      { id: "i16", name: "Asparagus", amount: 100, unit: "g", image: null },
    ],
    nutrition: {
      calories: 500,
      proteinG: 48,
      carbsG: 42,
      fatG: 12,
      fiberG: 5,
      sugarG: 2,
      sodiumMg: 490,
    },
    healthScore: 94,
    aggregateLikes: 1420,
    sourceUrl: "https://example.com/grilled-turkey",
  },
];

export class RecipeService {
  /**
   * Search recipes with filters (Name, Diet, Calories, Protein, Ready Time).
   */
  static async search(filters: RecipeSearchFilters): Promise<Recipe[]> {
    const hasSpoonacularKey =
      process.env.SPOONACULAR_API_KEY &&
      !process.env.SPOONACULAR_API_KEY.includes("your-spoonacular");

    if (hasSpoonacularKey) {
      try {
        const res = await searchSpoonacular(filters);
        if (res.results && res.results.length > 0) {
          return res.results.map(normalizeSpoonacularRecipe);
        }
      } catch (err) {
        console.warn("Spoonacular API call failed, attempting fallback:", err);
      }
    }

    // Try TheMealDB if query is present
    if (filters.query) {
      try {
        const mealDBResults = await searchMealDB(filters.query);
        if (mealDBResults.length > 0) {
          return mealDBResults.map(normalizeTheMealDBRecipe);
        }
      } catch (err) {
        console.warn("TheMealDB fallback failed:", err);
      }
    }

    // Client-side filtering on high quality fallbacks
    let results = [...FALLBACK_RECIPES];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.summary.toLowerCase().includes(q) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    if (filters.diet) {
      const d = filters.diet.toLowerCase();
      results = results.filter((r) => r.diets?.some((diet) => diet.toLowerCase().includes(d)));
    }

    if (filters.maxReadyTime) {
      results = results.filter((r) => r.readyInMinutes <= filters.maxReadyTime!);
    }

    if (filters.maxCalories && results.length > 0) {
      results = results.filter(
        (r) => r.nutrition && r.nutrition.calories <= filters.maxCalories!
      );
    }

    if (filters.minProtein && results.length > 0) {
      results = results.filter(
        (r) => r.nutrition && r.nutrition.proteinG >= filters.minProtein!
      );
    }

    return results;
  }

  /**
   * Search recipes by available ingredients ("What can I cook with these ingredients?").
   */
  static async searchByIngredients(ingredients: string[]): Promise<Recipe[]> {
    const hasSpoonacularKey =
      process.env.SPOONACULAR_API_KEY &&
      !process.env.SPOONACULAR_API_KEY.includes("your-spoonacular");

    if (hasSpoonacularKey && ingredients.length > 0) {
      try {
        const rawResults = await searchSpoonacularIngredients(ingredients);
        if (rawResults.length > 0) {
          return rawResults.map(normalizeSpoonacularRecipe);
        }
      } catch (err) {
        console.warn("Spoonacular ingredient search failed:", err);
      }
    }

    // Filter fallbacks by matching ingredients
    if (ingredients.length === 0) return FALLBACK_RECIPES;

    const lowerIngredients = ingredients.map((i) => i.toLowerCase().trim());
    return FALLBACK_RECIPES.filter((recipe) =>
      recipe.ingredients.some((ing) =>
        lowerIngredients.some((userIng) => ing.name.toLowerCase().includes(userIng))
      )
    );
  }

  /**
   * Get recipe detail by ID.
   */
  static async getById(id: string): Promise<Recipe | null> {
    // Check fallback list first
    const fallback = FALLBACK_RECIPES.find((r) => r.id === id);
    if (fallback) return fallback;

    const hasSpoonacularKey =
      process.env.SPOONACULAR_API_KEY &&
      !process.env.SPOONACULAR_API_KEY.includes("your-spoonacular");

    if (hasSpoonacularKey && !isNaN(Number(id))) {
      try {
        const raw = await getSpoonacularById(Number(id));
        return normalizeSpoonacularRecipe(raw);
      } catch (err) {
        console.warn("Spoonacular getById failed:", err);
      }
    }

    // Try TheMealDB
    try {
      const meal = await getMealDBById(id);
      if (meal) return normalizeTheMealDBRecipe(meal);
    } catch (err) {
      console.warn("TheMealDB getById failed:", err);
    }

    return FALLBACK_RECIPES[0];
  }
}
