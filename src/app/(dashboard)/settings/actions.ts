"use server";

/**
 * Settings Server Actions — Updating preferences & changing password.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { SettingsService } from "@/services/settings.service";
import type { UnitSystem } from "@/types/profile";

export async function updatePreferencesAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const units = (formData.get("units") as UnitSystem) || "METRIC";
  const emailNotifications = formData.get("emailNotifications") === "true";
  const mealReminders = formData.get("mealReminders") === "true";

  await SettingsService.updateSettings(user.id, {
    units,
    emailNotifications,
    mealReminders,
  });

  revalidatePath("/settings");
  return { success: true };
}

export async function changePasswordAction(formData: FormData) {
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  try {
    await SettingsService.changePassword(password);
    return { success: true };
  } catch (err: any) {
    return { error: err.message || "Failed to update password." };
  }
}
