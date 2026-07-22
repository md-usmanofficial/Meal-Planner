/**
 * Profile Service — Handles profile CRUD and automatic nutrition calculations.
 *
 * All operations run on the server side using Prisma.
 * Whenever a profile is saved or updated, the Nutrition Engine automatically
 * calculates BMI, BMR, TDEE, Calories, Protein, Carbs, and Fat targets, and
 * updates the `nutrition_goals` table.
 */

import { prisma } from "@/lib/prisma";
import { calculateNutritionGoals } from "@/lib/nutrition/calculations";
import type { OnboardingFormValues } from "@/lib/validations/profile";

export class ProfileService {
  /**
   * Get a user's full profile along with calculated nutrition goals and settings.
   */
  static async getFullProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) return null;

    const [nutritionGoal, settings] = await Promise.all([
      prisma.nutritionGoal.findUnique({ where: { userId } }),
      prisma.userSettings.findUnique({ where: { userId } }),
    ]);

    return { profile, nutritionGoal, settings };
  }

  /**
   * Upsert user profile and automatically trigger nutrition target calculation.
   */
  static async upsertProfile(userId: string, data: OnboardingFormValues) {
    // 1. Calculate nutrition goals using pure calculation engine
    const calculatedGoals = calculateNutritionGoals({
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      age: data.age,
      gender: data.gender,
      activityLevel: data.activityLevel,
      goal: data.goal,
      dietaryPreference: data.dietaryPreference,
    });

    // 2. Perform database transaction to keep Profile, NutritionGoal, and UserSettings in sync
    return await prisma.$transaction(async (tx) => {
      // Upsert Profile
      const updatedProfile = await tx.profile.upsert({
        where: { userId },
        create: {
          userId,
          name: data.name,
          gender: data.gender,
          age: data.age,
          heightCm: data.heightCm,
          weightKg: data.weightKg,
          targetWeightKg: data.targetWeightKg,
          activityLevel: data.activityLevel,
          goal: data.goal,
          dietaryPreference: data.dietaryPreference,
          allergies: data.allergies,
          healthConditions: data.healthConditions,
          isOnboardingComplete: true,
        },
        update: {
          name: data.name,
          gender: data.gender,
          age: data.age,
          heightCm: data.heightCm,
          weightKg: data.weightKg,
          targetWeightKg: data.targetWeightKg,
          activityLevel: data.activityLevel,
          goal: data.goal,
          dietaryPreference: data.dietaryPreference,
          allergies: data.allergies,
          healthConditions: data.healthConditions,
          isOnboardingComplete: true,
        },
      });

      // Upsert NutritionGoal
      const updatedNutritionGoal = await tx.nutritionGoal.upsert({
        where: { userId },
        create: {
          userId,
          bmi: calculatedGoals.bmi,
          bmr: calculatedGoals.bmr,
          tdee: calculatedGoals.tdee,
          calories: calculatedGoals.goalCalories,
          proteinG: calculatedGoals.proteinG,
          carbsG: calculatedGoals.carbsG,
          fatG: calculatedGoals.fatG,
        },
        update: {
          bmi: calculatedGoals.bmi,
          bmr: calculatedGoals.bmr,
          tdee: calculatedGoals.tdee,
          calories: calculatedGoals.goalCalories,
          proteinG: calculatedGoals.proteinG,
          carbsG: calculatedGoals.carbsG,
          fatG: calculatedGoals.fatG,
        },
      });

      // Ensure UserSettings exists
      const updatedSettings = await tx.userSettings.upsert({
        where: { userId },
        create: {
          userId,
          darkMode: false,
          units: "METRIC",
        },
        update: {},
      });

      return {
        profile: updatedProfile,
        nutritionGoal: updatedNutritionGoal,
        settings: updatedSettings,
      };
    });
  }

  /**
   * Recalculate nutrition goals for a user (e.g. after weight update).
   */
  static async recalculateGoals(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile || !profile.weightKg || !profile.heightCm || !profile.age || !profile.gender) {
      return null;
    }

    const calculated = calculateNutritionGoals({
      weightKg: profile.weightKg,
      heightCm: profile.heightCm,
      age: profile.age,
      gender: profile.gender,
      activityLevel: profile.activityLevel,
      goal: profile.goal,
      dietaryPreference: profile.dietaryPreference,
    });

    return await prisma.nutritionGoal.upsert({
      where: { userId },
      create: {
        userId,
        bmi: calculated.bmi,
        bmr: calculated.bmr,
        tdee: calculated.tdee,
        calories: calculated.goalCalories,
        proteinG: calculated.proteinG,
        carbsG: calculated.carbsG,
        fatG: calculated.fatG,
      },
      update: {
        bmi: calculated.bmi,
        bmr: calculated.bmr,
        tdee: calculated.tdee,
        calories: calculated.goalCalories,
        proteinG: calculated.proteinG,
        carbsG: calculated.carbsG,
        fatG: calculated.fatG,
      },
    });
  }
}
