/**
 * API Route: GET /api/recipes/search
 * Search recipes using query parameters: query, diet, maxReadyTime, minCalories, maxCalories, minProtein
 */

import { NextResponse, type NextRequest } from "next/server";
import { RecipeService } from "@/services/recipe.service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("query") || undefined;
  const diet = searchParams.get("diet") || undefined;
  const maxReadyTime = searchParams.get("maxReadyTime")
    ? Number(searchParams.get("maxReadyTime"))
    : undefined;
  const maxCalories = searchParams.get("maxCalories")
    ? Number(searchParams.get("maxCalories"))
    : undefined;
  const minProtein = searchParams.get("minProtein")
    ? Number(searchParams.get("minProtein"))
    : undefined;

  try {
    const recipes = await RecipeService.search({
      query,
      diet,
      maxReadyTime,
      maxCalories,
      minProtein,
    });

    return NextResponse.json({ success: true, data: recipes });
  } catch (error) {
    console.error("GET /api/recipes/search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search recipes" },
      { status: 500 }
    );
  }
}
