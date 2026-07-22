/**
 * Analytics Service — Aggregates health data for Recharts visualizations.
 *
 * Provides datasets for:
 * 1. Calorie Intake vs Goal over time
 * 2. Macronutrient Distribution (Protein %, Carbs %, Fat %)
 * 3. Weight Progress over 7d, 30d, 90d
 * 4. Meal Plan Adherence Rate (%)
 */

import { prisma } from "@/lib/prisma";

export class AnalyticsService {
  /**
   * Get analytics dashboard dataset for a user.
   */
  static async getAnalyticsData(userId: string, rangeDays: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - rangeDays);

    const [dailyProgressList, weightLogs, mealPlans] = await Promise.all([
      prisma.dailyProgress.findMany({
        where: {
          userId,
          date: { gte: startDate },
        },
        orderBy: { date: "asc" },
      }),
      prisma.weightLog.findMany({
        where: {
          userId,
          date: { gte: startDate },
        },
        orderBy: { date: "asc" },
      }),
      prisma.mealPlan.findMany({
        where: { userId },
        include: { meals: true },
      }),
    ]);

    // 1. Calorie Trend Dataset
    const calorieTrend = dailyProgressList.map((dp) => ({
      date: new Date(dp.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      consumed: dp.caloriesConsumed,
      goal: dp.caloriesGoal || 2000,
    }));

    // 2. Macro Breakdown Totals
    const totalProteinG = dailyProgressList.reduce((sum, dp) => sum + dp.proteinG, 0);
    const totalCarbsG = dailyProgressList.reduce((sum, dp) => sum + dp.carbsG, 0);
    const totalFatG = dailyProgressList.reduce((sum, dp) => sum + dp.fatG, 0);

    const macroBreakdown = [
      { name: "Protein", value: totalProteinG * 4, grams: Math.round(totalProteinG), color: "var(--color-macro-protein, #3b82f6)" },
      { name: "Carbohydrates", value: totalCarbsG * 4, grams: Math.round(totalCarbsG), color: "var(--color-macro-carbs, #f59e0b)" },
      { name: "Fat", value: totalFatG * 9, grams: Math.round(totalFatG), color: "var(--color-macro-fat, #ef4444)" },
    ];

    // 3. Weight Progress Line Dataset
    const weightProgress = weightLogs.map((wl) => ({
      date: new Date(wl.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weightKg: wl.weightKg,
    }));

    // 4. Meal Plan Adherence Rate Calculation
    let totalMealsCount = 0;
    let completedMealsCount = 0;

    mealPlans.forEach((plan) => {
      plan.meals.forEach((meal) => {
        totalMealsCount++;
        if (meal.isCompleted) completedMealsCount++;
      });
    });

    const adherenceRate = totalMealsCount > 0 ? Math.round((completedMealsCount / totalMealsCount) * 100) : 85;

    return {
      calorieTrend: calorieTrend.length > 0 ? calorieTrend : generateMockCalorieTrend(rangeDays),
      macroBreakdown: totalProteinG > 0 ? macroBreakdown : generateMockMacroBreakdown(),
      weightProgress: weightProgress.length > 0 ? weightProgress : generateMockWeightProgress(rangeDays),
      adherenceRate,
      totalMealsCount,
      completedMealsCount,
    };
  }
}

// Fallbacks for initial empty state display
function generateMockCalorieTrend(days: number) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      consumed: Math.floor(1700 + Math.random() * 500),
      goal: 2000,
    });
  }
  return result;
}

function generateMockMacroBreakdown() {
  return [
    { name: "Protein", value: 480, grams: 120, color: "#3b82f6" },
    { name: "Carbohydrates", value: 840, grams: 210, color: "#f59e0b" },
    { name: "Fat", value: 495, grams: 55, color: "#ef4444" },
  ];
}

function generateMockWeightProgress(days: number) {
  const result = [];
  let baseWeight = 72;
  for (let i = days - 1; i >= 0; i -= Math.max(1, Math.floor(days / 6))) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    baseWeight -= Math.random() * 0.4;
    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weightKg: Number(baseWeight.toFixed(1)),
    });
  }
  return result;
}
