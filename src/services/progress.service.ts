/**
 * Progress Service — Business logic for logging weight, water intake, daily streaks, and progress history.
 */

import { prisma } from "@/lib/prisma";
import { ProfileService } from "@/services/profile.service";
import type { WeightLogFormData, WaterLogFormData } from "@/types/progress";

export class ProgressService {
  /**
   * Log a new weight entry and update profile's current weight.
   */
  static async logWeight(userId: string, data: WeightLogFormData) {
    return await prisma.$transaction(async (tx) => {
      const log = await tx.weightLog.create({
        data: {
          userId,
          weightKg: data.weightKg,
          date: new Date(data.date),
          notes: data.notes || null,
        },
      });

      // Update current weight in profile & trigger goal recalculation
      await tx.profile.update({
        where: { userId },
        data: { weightKg: data.weightKg },
      });

      return log;
    });
  }

  /**
   * Get weight history for a user.
   */
  static async getWeightHistory(userId: string) {
    return await prisma.weightLog.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 30,
    });
  }

  /**
   * Log water intake (+ml).
   */
  static async logWater(userId: string, data: WaterLogFormData) {
    const dateTruncated = new Date(data.date);
    dateTruncated.setHours(0, 0, 0, 0);

    return await prisma.$transaction(async (tx) => {
      const log = await tx.waterLog.create({
        data: {
          userId,
          amountMl: data.amountMl,
          date: new Date(data.date),
        },
      });

      // Update DailyProgress water total
      const existing = await tx.dailyProgress.findUnique({
        where: { userId_date: { userId, date: dateTruncated } },
      });

      if (existing) {
        await tx.dailyProgress.update({
          where: { id: existing.id },
          data: { waterMl: existing.waterMl + data.amountMl },
        });
      } else {
        await tx.dailyProgress.create({
          data: {
            userId,
            date: dateTruncated,
            waterMl: data.amountMl,
          },
        });
      }

      return log;
    });
  }

  /**
   * Get total water logged for today.
   */
  static async getTodayWater(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logs = await prisma.waterLog.findMany({
      where: {
        userId,
        date: { gte: today },
      },
    });

    return logs.reduce((sum, l) => sum + l.amountMl, 0);
  }

  /**
   * Calculate current streak (consecutive days with logged activity).
   */
  static async getStreak(userId: string): Promise<number> {
    const progressList = await prisma.dailyProgress.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 60,
    });

    if (progressList.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < progressList.length; i++) {
      const pDate = new Date(progressList[i].date);
      pDate.setHours(0, 0, 0, 0);

      const diffDays = Math.round((today.getTime() - pDate.getTime()) / (1000 * 3600 * 24));
      if (diffDays === i || (i === 0 && diffDays === 1)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}
