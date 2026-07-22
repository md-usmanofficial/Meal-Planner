"use server";

/**
 * Onboarding Server Action — Processes user profile setup and auto-calculates targets.
 */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ProfileService } from "@/services/profile.service";
import { onboardingSchema } from "@/lib/validations/profile";
import { ROUTES } from "@/constants/routes";

export type OnboardingActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function submitOnboardingAction(
  _prevState: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized. Please log in first." };
  }

  // Parse raw form values
  const rawAllergies = formData.get("allergies") as string;
  const rawConditions = formData.get("healthConditions") as string;

  const rawData = {
    name: formData.get("name") || user.user_metadata?.name || user.email?.split("@")[0] || "User",
    gender: formData.get("gender"),
    age: Number(formData.get("age")),
    heightCm: Number(formData.get("heightCm")),
    weightKg: Number(formData.get("weightKg")),
    targetWeightKg: Number(formData.get("targetWeightKg")),
    activityLevel: formData.get("activityLevel"),
    goal: formData.get("goal"),
    dietaryPreference: formData.get("dietaryPreference"),
    allergies: rawAllergies ? JSON.parse(rawAllergies) : [],
    healthConditions: rawConditions ? JSON.parse(rawConditions) : [],
  };

  const validated = onboardingSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      fieldErrors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await ProfileService.upsertProfile(user.id, validated.data);
  } catch (err) {
    console.error("Failed to save profile:", err);
    return { error: "Database save failed. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.DASHBOARD);
}
