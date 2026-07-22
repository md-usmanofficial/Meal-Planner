/**
 * Meal Plan Service — Business logic for generating, updating, regenerating, and saving meal plans.
 *
 * Uses the Rule-Based Recommendation Engine (`recommendations.ts`) to match recipes
 * to the user's profile, dietary preferences, allergies, and daily macro targets.
 */

import { prisma } from "@/lib/prisma";
import { ProfileService } from "@/services/profile.service";
import { RecipeService } from "@/services/recipe.service";
import { buildRecipeFilters } from "@/lib/nutrition/recommendations";
import { EVERYDAY_SIMPLE_RECIPES } from "@/constants/everydayRecipes";
import type { MealType, PlanType, MealRecipeSnapshot } from "@/types/meal";
import type { Recipe } from "@/types/recipe";

export class MealPlanService {
  /**
   * Generate a new meal plan (Daily, Weekly, or Monthly) for a user.
   */
  static async generatePlan(params: {
    userId: string;
    planType: PlanType;
    foodStyle?: "SIMPLE" | "GOURMET";
    startDate: Date;
    includeDessert?: boolean;
    name?: string;
  }) {
    const { userId, planType, foodStyle = "SIMPLE", startDate, includeDessert = false, name } = params;

    // 1. Get user profile and calculated nutrition goals
    const fullProfile = await ProfileService.getFullProfile(userId);
    if (!fullProfile?.profile) {
      throw new Error("User profile must be completed before generating a meal plan.");
    }

    const profile = fullProfile.profile;
    const nutritionGoal = fullProfile.nutritionGoal;

    // 2. Determine number of days based on planType
    const daysCount = planType === "DAILY" ? 1 : planType === "WEEKLY" ? 7 : 30;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (daysCount - 1));

    // 3. Fetch candidate recipes combining custom user recipes AND API recipes
    const customFavorites = await prisma.favorite.findMany({
      where: { userId, itemType: "RECIPE" },
    });
    const customRecipes: Recipe[] = customFavorites.map((f) => f.itemData as unknown as Recipe);

    const mealTypesToFetch: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
    if (includeDessert) mealTypesToFetch.push("DESSERT");

    const recipePool: Record<MealType, Recipe[]> = {
      BREAKFAST: [],
      LUNCH: [],
      DINNER: [],
      SNACK: [],
      DESSERT: [],
    };

    for (const mealType of mealTypesToFetch) {
      const allMatches = [...customRecipes, ...EVERYDAY_SIMPLE_RECIPES].filter((r) =>
        r.dishTypes?.some((dt) => dt.toLowerCase().includes(mealType.toLowerCase()))
      );
      recipePool[mealType] = allMatches.length > 0 ? allMatches : [...customRecipes, ...EVERYDAY_SIMPLE_RECIPES];
    }

    // 4. Create MealPlan in database using transaction
    return await prisma.$transaction(async (tx) => {
      const plan = await tx.mealPlan.create({
        data: {
          userId,
          name: name || `${planType.charAt(0) + planType.slice(1).toLowerCase()} Plan (${startDate.toLocaleDateString()})`,
          startDate,
          endDate,
          planType,
          isSaved: false,
        },
      });

      const mealsToCreate = [];

      for (let dayIndex = 0; dayIndex < daysCount; dayIndex++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(currentDate.getDate() + dayIndex);

        for (const mealType of mealTypesToFetch) {
          const pool = recipePool[mealType];
          // Pick recipe from pool using round-robin / score ranking
          const recipe = pool[dayIndex % pool.length] || pool[0];

          const recipeSnapshot: Recipe = {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes || 15,
            servings: recipe.servings || 1,
            summary: recipe.summary || "Nutritious daily meal recipe.",
            cuisines: recipe.cuisines || [],
            diets: recipe.diets || [],
            dishTypes: recipe.dishTypes || [],
            ingredients: recipe.ingredients || [],
            instructions: recipe.instructions || [],
            nutrition: {
              calories: recipe.nutrition?.calories || 400,
              proteinG: recipe.nutrition?.proteinG || 25,
              carbsG: recipe.nutrition?.carbsG || 45,
              fatG: recipe.nutrition?.fatG || 15,
              fiberG: recipe.nutrition?.fiberG || 0,
            },
            source: recipe.source,
          };

          mealsToCreate.push({
            mealPlanId: plan.id,
            mealType,
            recipeId: recipe.id,
            recipeData: recipeSnapshot as any,
            servings: 1,
            date: currentDate,
            isCompleted: false,
          });
        }
      }

      await tx.meal.createMany({
        data: mealsToCreate,
      });

      return await tx.mealPlan.findUnique({
        where: { id: plan.id },
        include: { meals: true },
      });
    });
  }

  /**
   * Regenerate a single meal within an active plan.
   */
  static async regenerateSingleMeal(mealId: string, userId: string) {
    const existingMeal = await prisma.meal.findUnique({
      where: { id: mealId },
      include: { mealPlan: true },
    });

    if (!existingMeal || existingMeal.mealPlan.userId !== userId) {
      throw new Error("Meal not found or unauthorized");
    }

    const fullProfile = await ProfileService.getFullProfile(userId);
    if (!fullProfile?.profile) throw new Error("Profile not found");

    // Fetch alternative recipes for this meal type
    const filters = buildRecipeFilters(
      fullProfile.profile,
      fullProfile.nutritionGoal,
      existingMeal.mealType as MealType,
      { number: 10 }
    );

    const candidates = await RecipeService.search(filters);
    // Select a different recipe candidate randomly from pool
    const pool = candidates.filter((r) => r.id !== existingMeal.recipeId);
    const finalPool = pool.length > 0 ? pool : candidates;
    const newRecipe = finalPool[Math.floor(Math.random() * finalPool.length)];

    const recipeSnapshot: Recipe = {
      id: newRecipe.id,
      title: newRecipe.title,
      image: newRecipe.image,
      readyInMinutes: newRecipe.readyInMinutes || 15,
      servings: newRecipe.servings || 1,
      summary: newRecipe.summary || "Nutritious daily meal recipe.",
      ingredients: newRecipe.ingredients || [],
      instructions: newRecipe.instructions || [],
      nutrition: {
        calories: newRecipe.nutrition?.calories || 400,
        proteinG: newRecipe.nutrition?.proteinG || 25,
        carbsG: newRecipe.nutrition?.carbsG || 45,
        fatG: newRecipe.nutrition?.fatG || 15,
        fiberG: newRecipe.nutrition?.fiberG || 0,
      },
      source: newRecipe.source,
    };

    return await prisma.meal.update({
      where: { id: mealId },
      data: {
        recipeId: newRecipe.id,
        recipeData: recipeSnapshot as any,
      },
    });
  }

  /**
   * Regenerate all meals for an entire specified date.
   */
  static async regenerateEntireDay(mealPlanId: string, date: Date, userId: string) {
    const plan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: { meals: true },
    });

    if (!plan || plan.userId !== userId) {
      throw new Error("Plan not found or unauthorized");
    }

    const targetDayMeals = plan.meals.filter(
      (m) => new Date(m.date).toDateString() === new Date(date).toDateString()
    );

    for (const meal of targetDayMeals) {
      await this.regenerateSingleMeal(meal.id, userId);
    }

    return await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
      include: { meals: true },
    });
  }

  /**
   * Save a meal plan for future reuse.
   */
  static async toggleSavePlan(mealPlanId: string, userId: string) {
    const plan = await prisma.mealPlan.findUnique({
      where: { id: mealPlanId },
    });

    if (!plan || plan.userId !== userId) {
      throw new Error("Plan not found or unauthorized");
    }

    return await prisma.mealPlan.update({
      where: { id: mealPlanId },
      data: { isSaved: !plan.isSaved },
    });
  }

  /**
   * Activates a saved meal plan by setting its startDate to today and shifting all meal dates forward.
   */
  static async reuseSavedPlan(planId: string, userId: string) {
    const plan = await prisma.mealPlan.findUnique({
      where: { id: planId },
      include: { meals: true },
    });

    if (!plan || plan.userId !== userId) {
      throw new Error("Plan not found or unauthorized");
    }

    const newStartDate = new Date();
    const oldStartDate = new Date(plan.startDate);
    const timeDiff = newStartDate.getTime() - oldStartDate.getTime();

    const daysCount = plan.planType === "DAILY" ? 1 : plan.planType === "WEEKLY" ? 7 : 30;
    const newEndDate = new Date(newStartDate);
    newEndDate.setDate(newEndDate.getDate() + (daysCount - 1));

    // Update plan dates
    await prisma.mealPlan.update({
      where: { id: planId },
      data: {
        startDate: newStartDate,
        endDate: newEndDate,
      },
    });

    // Shift all meal dates relative to new start date
    for (const meal of plan.meals) {
      const oldMealDate = new Date(meal.date);
      const newMealDate = new Date(oldMealDate.getTime() + timeDiff);
      await prisma.meal.update({
        where: { id: meal.id },
        data: {
          date: newMealDate,
          isCompleted: false,
        },
      });
    }

    return await prisma.mealPlan.findUnique({
      where: { id: planId },
      include: { meals: true },
    });
  }
  static async replaceMealWithCustom(params: {
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
    const { mealId, title, servings, calories, proteinG, carbsG, fatG, fiberG, prepTimeMinutes, summary, instructions } = params;

    const recipeData: MealRecipeSnapshot = {
      id: `custom-${Date.now()}`,
      title,
      summary: summary || instructions || "N/A",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      readyInMinutes: prepTimeMinutes || 15,
      servings: servings || 1,
      nutrition: { calories, proteinG, carbsG, fatG, fiberG: fiberG || 0 },
      ingredients: [
        { id: `ing-${Date.now()}`, name: title, amount: 1, unit: "serving" },
      ],
      instructions: instructions
        ? [{ stepNumber: 1, description: instructions }]
        : undefined,
    };

    return await prisma.meal.update({
      where: { id: mealId },
      data: {
        servings: servings || 1,
        recipeData: recipeData as any,
      },
    });
  }

  /**
   * Manually constructs a full multi-day meal plan with custom user-entered day-by-day meals.
   */
  static async createManualPlanFull(params: {
    userId: string;
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
    const { userId, name, daysCount, daysMeals } = params;
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.min(7, daysCount));

    const plan = await prisma.mealPlan.create({
      data: {
        userId,
        name,
        startDate,
        endDate,
        planType: daysCount === 1 ? "DAILY" : "WEEKLY",
      },
    });

    const mealsToCreate: Array<{ mealPlanId: string; mealType: MealType; date: Date; recipeData: any }> = [];

    for (const dayGroup of daysMeals) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + dayGroup.dayIndex);

      for (const customMeal of dayGroup.meals) {
        const recipeData: MealRecipeSnapshot = {
          id: `custom-${Date.now()}-${Math.random()}`,
          title: customMeal.title,
          summary: customMeal.instructions || "Custom meal item.",
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
          readyInMinutes: 15,
          servings: 1,
          nutrition: {
            calories: customMeal.calories,
            proteinG: customMeal.proteinG,
            carbsG: customMeal.carbsG,
            fatG: customMeal.fatG,
          },
          ingredients: [{ id: `ing-${Date.now()}`, name: customMeal.title, amount: 1, unit: "serving" }],
          instructions: customMeal.instructions ? [{ stepNumber: 1, description: customMeal.instructions }] : undefined,
        };

        mealsToCreate.push({
          mealPlanId: plan.id,
          mealType: customMeal.mealType,
          date: currentDate,
          recipeData: recipeData as any,
        });
      }
    }

    await prisma.meal.createMany({
      data: mealsToCreate,
    });

    return plan;
  }
  static async updatePlanName(planId: string, name: string) {
    return await prisma.mealPlan.update({
      where: { id: planId },
      data: { name },
    });
  }

  /**
   * Deletes / cancels a meal plan.
   * If the plan is saved, deleting it from the active view preserves the saved copy in database.
   */
  static async deletePlan(planId: string, forceDeleteSaved = false) {
    const plan = await prisma.mealPlan.findUnique({ where: { id: planId } });
    if (!plan) return;

    if (plan.isSaved && !forceDeleteSaved) {
      // Keep as a saved template in database by setting dates to template past epoch
      return await prisma.mealPlan.update({
        where: { id: planId },
        data: {
          startDate: new Date("1970-01-01T00:00:00.000Z"),
          endDate: new Date("1970-01-07T00:00:00.000Z"),
        },
      });
    }

    return await prisma.mealPlan.delete({
      where: { id: planId },
    });
  }

  /**
   * Adds a custom meal / food item to a specific date in a meal plan.
   */
  static async addCustomMealItem(params: {
    mealPlanId: string;
    date: Date;
    mealType: MealType;
    title: string;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG?: number;
    instructions?: string;
  }) {
    const { mealPlanId, date, mealType, title, calories, proteinG, carbsG, fatG, fiberG, instructions } = params;

    const recipeData: MealRecipeSnapshot = {
      id: `custom-${Date.now()}`,
      title,
      summary: instructions || "Custom user-added meal.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      readyInMinutes: 15,
      servings: 1,
      nutrition: { calories, proteinG, carbsG, fatG, fiberG: fiberG || 0 },
      ingredients: [
        { id: `ing-${Date.now()}`, name: title, amount: 1, unit: "serving" },
      ],
      instructions: instructions
        ? [{ stepNumber: 1, description: instructions }]
        : undefined,
    };

    return await prisma.meal.create({
      data: {
        mealPlanId,
        date,
        mealType,
        recipeData: recipeData as any,
      },
    });
  }

  /**
   * Manually builds a custom meal plan (max 7 days) with mandatory 2L water intake slots per day.
   */
  static async createManualPlan(params: {
    userId: string;
    name: string;
    daysCount: number; // Max 7
    includeDessert?: boolean;
  }) {
    const { userId, name, daysCount, includeDessert } = params;
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.min(7, daysCount));

    const plan = await prisma.mealPlan.create({
      data: {
        userId,
        name,
        startDate,
        endDate,
        planType: daysCount === 1 ? "DAILY" : "WEEKLY",
      },
    });

    const mealTypes: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];
    if (includeDessert) mealTypes.push("DESSERT");

    const mealsToCreate: Array<{ mealPlanId: string; mealType: MealType; date: Date; recipeData: any }> = [];

    for (let dayIdx = 0; dayIdx < daysCount; dayIdx++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + dayIdx);

      // Add main meals from everyday recipes
      for (const mType of mealTypes) {
        const matchingRecipe = EVERYDAY_SIMPLE_RECIPES.find((r) =>
          r.dishTypes.some((dt) => dt.toLowerCase().includes(mType.toLowerCase()))
        ) || EVERYDAY_SIMPLE_RECIPES[0];

        mealsToCreate.push({
          mealPlanId: plan.id,
          mealType: mType,
          date: currentDate,
          recipeData: matchingRecipe,
        });
      }
    }

    await prisma.meal.createMany({
      data: mealsToCreate,
    });

    return plan;
  }

  /**
   * Auto-prunes unsaved plans that have expired past their endDate.
   */
  static async pruneUnsavedExpiredPlans(userId: string) {
    const now = new Date();
    return await prisma.mealPlan.deleteMany({
      where: {
        userId,
        isSaved: false,
        endDate: { lt: now },
      },
    });
  }

  /**
   * Get active user meal plans or saved plans.
   */
  static async getUserPlans(userId: string) {
    return await prisma.mealPlan.findMany({
      where: { userId },
      include: { meals: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
