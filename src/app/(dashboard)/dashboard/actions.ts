"use server";

/**
 * Dashboard Server Actions — Persists meal toggles, water intake, & daily progress to PostgreSQL database.
 */

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function toggleMealCompletionAction(mealId: string, isCompleted: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  if (mealId.startsWith("w")) {
    return { success: true };
  }

  // Update Prisma meal record
  await prisma.meal.update({
    where: { id: mealId },
    data: { isCompleted },
  });

  revalidatePath("/dashboard");
  revalidatePath("/meal-plans");
  return { success: true };
}

export async function getTodayWaterLogsCountAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const count = await prisma.waterLog.count({
    where: {
      userId: user.id,
      date: { gte: today },
    },
  });

  return count;
}

export async function syncDailyProgressAction(params: {
  caloriesConsumed: number;
  caloriesGoal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
  waterGoalMl: number;
  mealsCompleted: number;
  mealsTotal: number;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Upsert DailyProgress record in PostgreSQL database
  await prisma.dailyProgress.upsert({
    where: {
      userId_date: {
        userId: user.id,
        date: today,
      },
    },
    create: {
      userId: user.id,
      date: today,
      caloriesConsumed: params.caloriesConsumed,
      caloriesGoal: params.caloriesGoal,
      proteinG: params.proteinG,
      carbsG: params.carbsG,
      fatG: params.fatG,
      waterMl: params.waterMl,
      waterGoalMl: params.waterGoalMl,
      mealsCompleted: params.mealsCompleted,
      mealsTotal: params.mealsTotal,
    },
    update: {
      caloriesConsumed: params.caloriesConsumed,
      caloriesGoal: params.caloriesGoal,
      proteinG: params.proteinG,
      carbsG: params.carbsG,
      fatG: params.fatG,
      waterMl: params.waterMl,
      waterGoalMl: params.waterGoalMl,
      mealsCompleted: params.mealsCompleted,
      mealsTotal: params.mealsTotal,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/analytics");
  return { success: true };
}

export async function toggleWaterSlotAction(waterSlotId: string, amountMl: number, isCompleted: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isCompleted) {
    await prisma.waterLog.create({
      data: {
        userId: user.id,
        amountMl,
        date: today,
      },
    });
  } else {
    // Remove one water log entry for today
    const firstLog = await prisma.waterLog.findFirst({
      where: { userId: user.id, date: { gte: today } },
    });
    if (firstLog) {
      await prisma.waterLog.delete({ where: { id: firstLog.id } });
    }
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function getWeeklyActivityProgressAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const progressRecords = await prisma.dailyProgress.findMany({
    where: {
      userId: user.id,
      date: { gte: sevenDaysAgo },
    },
    orderBy: { date: "asc" },
  });

  return progressRecords.map((r) => ({
    date: r.date.toISOString(),
    dayName: new Date(r.date).toLocaleDateString("en-US", { weekday: "short" }),
    caloriesConsumed: r.caloriesConsumed,
    caloriesGoal: r.caloriesGoal || 2000,
    completionPercentage: r.caloriesGoal > 0 ? Math.min(100, Math.round((r.caloriesConsumed / r.caloriesGoal) * 100)) : 0,
  }));
}
