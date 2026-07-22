/**
 * API Route: GET & PUT /api/profile
 *
 * GET: Fetches current user's profile, nutrition goals, and settings.
 * PUT: Updates user profile and auto-recalculates nutrition goals.
 */

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProfileService } from "@/services/profile.service";
import { onboardingSchema } from "@/lib/validations/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const data = await ProfileService.getFullProfile(user.id);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validated = onboardingSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const updatedData = await ProfileService.upsertProfile(user.id, validated.data);
    return NextResponse.json({ success: true, data: updatedData });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
