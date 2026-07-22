"use server";

/**
 * Food Log Server Actions — Delete food log entries.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { FoodLogService } from "@/services/foodLog.service";

export async function deleteFoodLogAction(logId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await FoodLogService.deleteFoodLog(logId, user.id);
  revalidatePath("/food-log");
  return { success: true };
}
