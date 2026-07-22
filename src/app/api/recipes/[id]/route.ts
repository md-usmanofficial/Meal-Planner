/**
 * API Route: GET /api/recipes/[id]
 * Fetches recipe details by ID.
 */

import { NextResponse, type NextRequest } from "next/server";
import { RecipeService } from "@/services/recipe.service";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const recipe = await RecipeService.getById(id);
    if (!recipe) {
      return NextResponse.json(
        { success: false, error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: recipe });
  } catch (error) {
    console.error(`GET /api/recipes/${id} error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}
