/**
 * API Route: GET /api/meal-plans
 * Fetches active and saved meal plans for current user.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MealPlanService } from "@/services/mealPlan.service";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plans = await MealPlanService.getUserPlans(user.id);
    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error("GET /api/meal-plans error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch meal plans" },
      { status: 500 }
    );
  }
}
