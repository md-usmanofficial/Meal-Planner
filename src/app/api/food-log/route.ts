/**
 * API Route: GET & POST /api/food-log
 * GET: Fetches logs for a date
 * POST: Logs a new food item
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FoodLogService } from "@/services/foodLog.service";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date") || new Date().toISOString();

  try {
    const logs = await FoodLogService.getLogsForDate(user.id, new Date(dateStr));
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("GET /api/food-log error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch food logs" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { formData, foodData } = body;

    const log = await FoodLogService.logFood(user.id, formData, foodData);
    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error("POST /api/food-log error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log food" },
      { status: 500 }
    );
  }
}
