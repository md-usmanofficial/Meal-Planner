/**
 * API Route: GET /api/analytics
 * Fetches analytics datasets with optional `days` query parameter (7, 30, 90).
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { AnalyticsService } from "@/services/analytics.service";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const days = Number(searchParams.get("days")) || 30;

  try {
    const data = await AnalyticsService.getAnalyticsData(user.id, days);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/analytics error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
