/**
 * API Route: GET & POST /api/progress/water
 */

import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProgressService } from "@/services/progress.service";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const todayWater = await ProgressService.getTodayWater(user.id);
    return NextResponse.json({ success: true, data: { todayWater } });
  } catch (error) {
    console.error("GET /api/progress/water error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch water data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const log = await ProgressService.logWater(user.id, body);
    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error("POST /api/progress/water error:", error);
    return NextResponse.json({ success: false, error: "Failed to log water" }, { status: 500 });
  }
}
