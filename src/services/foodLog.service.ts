/**
 * Food Log Service — Handles searching external food databases (USDA & Open Food Facts),
 * logging food items, quantity scaling, and aggregating daily nutrition progress.
 */

import { prisma } from "@/lib/prisma";
import { searchFoods as searchUSDA, normalizeUSDAFood } from "@/lib/api/usda";
import { searchProducts as searchOFF, normalizeOpenFoodFactsProduct } from "@/lib/api/openfoodfacts";
import { scaleNutrition } from "@/lib/nutrition/calculations";
import type { Food, FoodLogFormData } from "@/types/nutrition";
import type { MealType } from "@/types/meal";

// Sample high-accuracy fallback foods for zero-latency local dev
const FALLBACK_FOODS: Food[] = [
  {
    id: "usda-1",
    source: "usda",
    name: "Chicken Breast, Skinless, Raw",
    brand: "Generic",
    servingSize: 100,
    servingUnit: "g",
    nutrition: { calories: 165, proteinG: 31, carbsG: 0, fatG: 3.6, fiberG: 0, sugarG: 0, sodiumMg: 74 },
  },
  {
    id: "usda-2",
    source: "usda",
    name: "Brown Rice, Cooked",
    brand: "Generic",
    servingSize: 100,
    servingUnit: "g",
    nutrition: { calories: 123, proteinG: 2.7, carbsG: 25.6, fatG: 1, fiberG: 1.6, sugarG: 0.2, sodiumMg: 4 },
  },
  {
    id: "usda-3",
    source: "usda",
    name: "Avocado, Fresh",
    brand: "Generic",
    servingSize: 100,
    servingUnit: "g",
    nutrition: { calories: 160, proteinG: 2, carbsG: 8.5, fatG: 14.7, fiberG: 6.7, sugarG: 0.7, sodiumMg: 7 },
  },
  {
    id: "usda-4",
    source: "usda",
    name: "Whole Egg, Fresh, Raw",
    brand: "Generic",
    servingSize: 50,
    servingUnit: "g",
    nutrition: { calories: 72, proteinG: 6.3, carbsG: 0.4, fatG: 4.8, fiberG: 0, sugarG: 0.2, sodiumMg: 71 },
  },
  {
    id: "usda-5",
    source: "usda",
    name: "Greek Yogurt, Plain, Non-Fat",
    brand: "Chobani",
    servingSize: 150,
    servingUnit: "g",
    nutrition: { calories: 90, proteinG: 16, carbsG: 6, fatG: 0, fiberG: 0, sugarG: 4, sodiumMg: 65 },
  },
];

export class FoodLogService {
  /**
   * Search foods across USDA and Open Food Facts APIs.
   */
  static async searchFoods(query: string): Promise<Food[]> {
    if (!query || query.trim().length < 2) return FALLBACK_FOODS;

    const results: Food[] = [];

    // Try USDA first
    const hasUSDAKey = process.env.USDA_API_KEY && !process.env.USDA_API_KEY.includes("your-usda");
    if (hasUSDAKey) {
      try {
        const usdaRes = await searchUSDA(query, 1, 10);
        if (usdaRes.foods && usdaRes.foods.length > 0) {
          results.push(...usdaRes.foods.map(normalizeUSDAFood));
        }
      } catch (err) {
        console.warn("USDA food search failed:", err);
      }
    }

    // Try Open Food Facts
    try {
      const offRes = await searchOFF(query, 1, 10);
      if (offRes.products && offRes.products.length > 0) {
        results.push(...offRes.products.map(normalizeOpenFoodFactsProduct));
      }
    } catch (err) {
      console.warn("Open Food Facts search failed:", err);
    }

    // Fallback to local filtering if external APIs returned no results
    if (results.length === 0) {
      const q = query.toLowerCase();
      return FALLBACK_FOODS.filter((f) => f.name.toLowerCase().includes(q) || f.brand?.toLowerCase().includes(q));
    }

    return results;
  }

  /**
   * Log a food entry into the database for a user.
   */
  static async logFood(userId: string, data: FoodLogFormData, foodData: Food) {
    const scaled = scaleNutrition(foodData.nutrition, data.quantity, foodData.servingSize);

    return await prisma.$transaction(async (tx) => {
      // 1. Create FoodLog record
      const log = await tx.foodLog.create({
        data: {
          userId,
          date: new Date(data.date),
          foodId: data.foodId,
          foodName: data.foodName,
          foodData: foodData as any,
          quantity: data.quantity,
          unit: data.unit,
          calories: scaled.calories,
          proteinG: scaled.proteinG,
          carbsG: scaled.carbsG,
          fatG: scaled.fatG,
          fiberG: scaled.fiberG,
          mealType: data.mealType as MealType,
        },
      });

      // 2. Update or create DailyProgress snapshot
      const dateTruncated = new Date(data.date);
      dateTruncated.setHours(0, 0, 0, 0);

      const existingProgress = await tx.dailyProgress.findUnique({
        where: {
          userId_date: { userId, date: dateTruncated },
        },
      });

      if (existingProgress) {
        await tx.dailyProgress.update({
          where: { id: existingProgress.id },
          data: {
            caloriesConsumed: existingProgress.caloriesConsumed + scaled.calories,
            proteinG: existingProgress.proteinG + scaled.proteinG,
            carbsG: existingProgress.carbsG + scaled.carbsG,
            fatG: existingProgress.fatG + scaled.fatG,
          },
        });
      } else {
        await tx.dailyProgress.create({
          data: {
            userId,
            date: dateTruncated,
            caloriesConsumed: scaled.calories,
            proteinG: scaled.proteinG,
            carbsG: scaled.carbsG,
            fatG: scaled.fatG,
          },
        });
      }

      return log;
    });
  }

  /**
   * Delete a logged food entry.
   */
  static async deleteFoodLog(logId: string, userId: string) {
    const existing = await prisma.foodLog.findUnique({
      where: { id: logId },
    });

    if (!existing || existing.userId !== userId) {
      throw new Error("Log entry not found or unauthorized");
    }

    return await prisma.foodLog.delete({
      where: { id: logId },
    });
  }

  /**
   * Get logged foods for a user on a specific date.
   */
  static async getLogsForDate(userId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.foodLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }
}
