/**
 * Everyday Accessible Recipes Pool — Simple, common daily routine foods.
 * Used when generating meal plans with "Everyday Simple Foods" preference.
 */

import type { Recipe } from "@/types/recipe";

export const EVERYDAY_SIMPLE_RECIPES: Recipe[] = [
  // BREAKFAST
  {
    id: "ez-b1",
    source: "spoonacular",
    title: "2 Hard Boiled Eggs & Whole Wheat Toast",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 10,
    servings: 1,
    cuisines: ["American"],
    diets: ["high protein"],
    dishTypes: ["breakfast"],
    summary: "Simple boiled eggs served with toasted whole wheat bread and a pinch of black pepper.",
    instructions: [
      { stepNumber: 1, description: "Boil 2 large eggs in water for 8 minutes until hard-boiled." },
      { stepNumber: 2, description: "Toast 2 slices of whole wheat bread." },
      { stepNumber: 3, description: "Peel eggs, slice in half, and serve on toast with salt and pepper." },
    ],
    ingredients: [
      { id: "ez-i1", name: "Eggs", amount: 2, unit: "pcs", image: null },
      { id: "ez-i2", name: "Whole Wheat Bread", amount: 2, unit: "slices", image: null },
      { id: "ez-i3", name: "Black Pepper", amount: 1, unit: "pinch", image: null },
    ],
    nutrition: { calories: 310, proteinG: 20, carbsG: 26, fatG: 12, fiberG: 4, sugarG: 2, sodiumMg: 380 },
    healthScore: 90,
  },
  {
    id: "ez-b2",
    source: "spoonacular",
    title: "Oatmeal with Milk, Honey & Banana",
    image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 8,
    servings: 1,
    cuisines: ["American"],
    diets: ["vegetarian"],
    dishTypes: ["breakfast"],
    summary: "Warm rolled oats cooked in milk, topped with sliced fresh banana and a drizzle of honey.",
    instructions: [
      { stepNumber: 1, description: "Combine oats and milk in a pot; simmer for 5 minutes until creamy." },
      { stepNumber: 2, description: "Pour into a bowl and top with sliced ripe banana." },
      { stepNumber: 3, description: "Drizzle with 1 tsp honey before serving." },
    ],
    ingredients: [
      { id: "ez-i4", name: "Rolled Oats", amount: 50, unit: "g", image: null },
      { id: "ez-i5", name: "Milk", amount: 200, unit: "ml", image: null },
      { id: "ez-i6", name: "Banana", amount: 1, unit: "pc", image: null },
      { id: "ez-i7", name: "Honey", amount: 10, unit: "g", image: null },
    ],
    nutrition: { calories: 380, proteinG: 14, carbsG: 68, fatG: 6, fiberG: 7, sugarG: 22, sodiumMg: 110 },
    healthScore: 92,
  },

  // LUNCH
  {
    id: "ez-l1",
    source: "spoonacular",
    title: "Grilled Chicken Breast with White Rice",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 20,
    servings: 1,
    cuisines: ["American"],
    diets: ["high protein", "gluten free"],
    dishTypes: ["lunch"],
    summary: "Pan-grilled seasoned chicken breast paired with fluffy steamed rice and cucumber slices.",
    instructions: [
      { stepNumber: 1, description: "Season chicken breast with salt, garlic powder, and olive oil." },
      { stepNumber: 2, description: "Pan-fry chicken over medium heat for 6-7 minutes per side." },
      { stepNumber: 3, description: "Serve over 1 cup cooked white rice with cucumber." },
    ],
    ingredients: [
      { id: "ez-i8", name: "Chicken Breast", amount: 180, unit: "g", image: null },
      { id: "ez-i9", name: "White Rice", amount: 150, unit: "g", image: null },
      { id: "ez-i10", name: "Olive Oil", amount: 5, unit: "ml", image: null },
      { id: "ez-i11", name: "Cucumber", amount: 50, unit: "g", image: null },
    ],
    nutrition: { calories: 460, proteinG: 44, carbsG: 45, fatG: 8, fiberG: 2, sugarG: 1, sodiumMg: 420 },
    healthScore: 94,
  },
  {
    id: "ez-l2",
    source: "spoonacular",
    title: "Simple Turkey & Cheese Sandwich",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 5,
    servings: 1,
    cuisines: ["American"],
    diets: ["high protein"],
    dishTypes: ["lunch"],
    summary: "Classic sliced turkey breast with cheddar cheese, lettuce, and tomatoes on bread.",
    instructions: [
      { stepNumber: 1, description: "Layer sliced turkey breast and cheese between bread slices." },
      { stepNumber: 2, description: "Add fresh lettuce leaves and tomato slices." },
    ],
    ingredients: [
      { id: "ez-i12", name: "Sliced Turkey", amount: 100, unit: "g", image: null },
      { id: "ez-i13", name: "Cheddar Cheese", amount: 30, unit: "g", image: null },
      { id: "ez-i14", name: "Bread Slices", amount: 2, unit: "pcs", image: null },
      { id: "ez-i15", name: "Tomato", amount: 40, unit: "g", image: null },
    ],
    nutrition: { calories: 420, proteinG: 32, carbsG: 34, fatG: 14, fiberG: 3, sugarG: 4, sodiumMg: 690 },
    healthScore: 86,
  },

  // DINNER
  {
    id: "ez-d1",
    source: "spoonacular",
    title: "Baked Salmon with Boiled Potatoes",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 22,
    servings: 1,
    cuisines: ["Western"],
    diets: ["gluten free"],
    dishTypes: ["dinner"],
    summary: "Oven-baked salmon fillet served with tender boiled baby potatoes and olive oil.",
    instructions: [
      { stepNumber: 1, description: "Bake salmon fillet in oven at 400°F (200°C) for 15 minutes." },
      { stepNumber: 2, description: "Boil baby potatoes in salted water for 15 minutes until tender." },
      { stepNumber: 3, description: "Drizzle potatoes with olive oil and serve beside salmon." },
    ],
    ingredients: [
      { id: "ez-i16", name: "Salmon Fillet", amount: 160, unit: "g", image: null },
      { id: "ez-i17", name: "Baby Potatoes", amount: 150, unit: "g", image: null },
      { id: "ez-i18", name: "Olive Oil", amount: 10, unit: "ml", image: null },
    ],
    nutrition: { calories: 510, proteinG: 36, carbsG: 32, fatG: 22, fiberG: 4, sugarG: 2, sodiumMg: 340 },
    healthScore: 96,
  },

  // SNACK
  {
    id: "ez-s1",
    source: "spoonacular",
    title: "Greek Yogurt with Berries & Almonds",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: 3,
    servings: 1,
    cuisines: ["American"],
    diets: ["vegetarian", "high protein"],
    dishTypes: ["snack"],
    summary: "Plain non-fat Greek yogurt topped with fresh blueberries and crunchy raw almonds.",
    instructions: [
      { stepNumber: 1, description: "Scoop Greek yogurt into a small bowl." },
      { stepNumber: 2, description: "Top with fresh blueberries and sliced almonds." },
    ],
    ingredients: [
      { id: "ez-i19", name: "Greek Yogurt", amount: 170, unit: "g", image: null },
      { id: "ez-i20", name: "Blueberries", amount: 50, unit: "g", image: null },
      { id: "ez-i21", name: "Almonds", amount: 15, unit: "g", image: null },
    ],
    nutrition: { calories: 210, proteinG: 18, carbsG: 16, fatG: 8, fiberG: 3, sugarG: 10, sodiumMg: 60 },
    healthScore: 95,
  },
];
