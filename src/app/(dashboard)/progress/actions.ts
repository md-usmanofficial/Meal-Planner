"use server";

/**
 * Progress Server Actions — Weight & Water logging.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ProgressService } from "@/services/progress.service";

export async function logWeightAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const weightKg = Number(formData.get("weightKg"));
  const notes = (formData.get("notes") as string) || undefined;
  const dateStr = (formData.get("date") as string) || new Date().toISOString();

  await ProgressService.logWeight(user.id, {
    weightKg,
    notes,
    date: new Date(dateStr),
  });

  revalidatePath("/progress");
  return { success: true };
}

export async function logWaterAction(amountMl: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await ProgressService.logWater(user.id, {
    amountMl,
    date: new Date(),
  });

  revalidatePath("/progress");
  return { success: true };
}
