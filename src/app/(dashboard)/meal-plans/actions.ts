"use server";

/**
 * Meal Planning Server Actions — Plan generation, manual plan building, custom items, name editing, & deletion.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { MealPlanService } from "@/services/mealPlan.service";
import type { PlanType, MealType } from "@/types/meal";

export async function generateMealPlanAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const planType = (formData.get("planType") as PlanType) || "DAILY";
  const foodStyle = (formData.get("foodStyle") as "SIMPLE" | "GOURMET") || "SIMPLE";
  const startDateStr = formData.get("startDate") as string;
  const startDate = startDateStr ? new Date(startDateStr) : new Date();
  const includeDessert = formData.get("includeDessert") === "true";
  const name = (formData.get("name") as string) || undefined;

  const plan = await MealPlanService.generatePlan({
    userId: user.id,
    planType,
    foodStyle,
    startDate,
    includeDessert,
    name,
  });

  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true, planId: plan?.id };
}

export async function updateMealPlanNameAction(planId: string, name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await MealPlanService.updatePlanName(planId, name);
  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteMealPlanAction(planId: string, forceDeleteSaved = false) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await MealPlanService.deletePlan(planId, forceDeleteSaved);
  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function replaceMealWithCustomAction(params: {
  mealId: string;
  title: string;
  servings?: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  prepTimeMinutes?: number;
  summary?: string;
  instructions?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await MealPlanService.replaceMealWithCustom(params);
  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createManualMealPlanFullAction(params: {
  name: string;
  daysCount: number;
  daysMeals: Array<{
    dayIndex: number;
    meals: Array<{
      mealType: MealType;
      title: string;
      calories: number;
      proteinG: number;
      carbsG: number;
      fatG: number;
      instructions?: string;
    }>;
  }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const plan = await MealPlanService.createManualPlanFull({
    userId: user.id,
    name: params.name,
    daysCount: params.daysCount,
    daysMeals: params.daysMeals,
  });

  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true, planId: plan.id };
}

export async function regenerateMealAction(mealId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await MealPlanService.regenerateSingleMeal(mealId, user.id);
  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function regenerateDayAction(mealPlanId: string, dateStr: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await MealPlanService.regenerateEntireDay(mealPlanId, new Date(dateStr), user.id);
  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function reuseSavedPlanAction(planId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await MealPlanService.reuseSavedPlan(planId, user.id);
  revalidatePath("/meal-plans");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleSavePlanAction(mealPlanId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const updated = await MealPlanService.toggleSavePlan(mealPlanId, user.id);
  revalidatePath("/meal-plans");
  return { success: true, isSaved: updated.isSaved };
}
