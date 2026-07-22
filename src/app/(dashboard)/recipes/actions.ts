"use server";

/**
 * Custom Recipes Server Actions — CRUD operations for user custom recipes in PostgreSQL database.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import type { Recipe } from "@/types/recipe";

export async function getCustomRecipesAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id,
      itemType: "RECIPE",
      externalId: { startsWith: "custom-" },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((f) => f.itemData as unknown as Recipe);
}

export async function saveCustomRecipeAction(recipeData: Partial<Recipe>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const recipeId = recipeData.id || `custom-${Date.now()}`;
  const fullRecipe: Recipe = {
    id: recipeId,
    title: recipeData.title || "My Custom Recipe",
    image: recipeData.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    readyInMinutes: recipeData.readyInMinutes || 15,
    servings: recipeData.servings || 1,
    cuisines: recipeData.cuisines || ["Custom"],
    diets: recipeData.diets || [],
    dishTypes: recipeData.dishTypes || ["main course"],
    summary: recipeData.summary || "Custom user recipe.",
    instructions: recipeData.instructions || [],
    ingredients: recipeData.ingredients || [],
    nutrition: {
      calories: recipeData.nutrition?.calories || 400,
      proteinG: recipeData.nutrition?.proteinG || 25,
      carbsG: recipeData.nutrition?.carbsG || 45,
      fatG: recipeData.nutrition?.fatG || 15,
      fiberG: recipeData.nutrition?.fiberG || 0,
      sugarG: 0,
      sodiumMg: 0,
    },
    healthScore: 90,
    aggregateLikes: 0,
    sourceUrl: null,
    source: "custom",
  };

  await prisma.favorite.upsert({
    where: {
      userId_itemType_externalId: {
        userId: user.id,
        itemType: "RECIPE",
        externalId: recipeId,
      },
    },
    create: {
      userId: user.id,
      itemType: "RECIPE",
      externalId: recipeId,
      itemData: fullRecipe as any,
    },
    update: {
      itemData: fullRecipe as any,
    },
  });

  revalidatePath("/recipes");
  revalidatePath("/meal-plans");
  return { success: true, recipe: fullRecipe };
}

export async function deleteCustomRecipeAction(recipeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await prisma.favorite.deleteMany({
    where: {
      userId: user.id,
      itemType: "RECIPE",
      externalId: recipeId,
    },
  });

  revalidatePath("/recipes");
  revalidatePath("/meal-plans");
  return { success: true };
}
