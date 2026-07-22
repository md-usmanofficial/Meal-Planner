/**
 * API Route: GET /api/recipes/by-ingredients
 * Finds recipes based on comma-separated ingredients ("What can I cook with these ingredients?")
 */

import { NextResponse, type NextRequest } from "next/server";
import { RecipeService } from "@/services/recipe.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawIngredients = searchParams.get("ingredients") || "";

  const ingredients = rawIngredients
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  try {
    const recipes = await RecipeService.searchByIngredients(ingredients);
    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error("GET /api/recipes/by-ingredients error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search recipes by ingredients" },
      { status: 500 }
    );
  }
}
