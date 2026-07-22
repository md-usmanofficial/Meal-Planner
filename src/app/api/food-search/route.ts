/**
 * API Route: GET /api/food-search
 * Searches foods from USDA and Open Food Facts APIs.
 */

import { NextResponse, type NextRequest } from "next/server";
import { FoodLogService } from "@/services/foodLog.service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";

  try {
    const foods = await FoodLogService.searchFoods(query);
    return NextResponse.json({ success: true, data: foods });
  } catch (error) {
    console.error("GET /api/food-search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search foods" },
      { status: 500 }
    );
  }
}
