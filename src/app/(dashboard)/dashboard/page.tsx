"use client";

/**
 * Dashboard Page — Fully connected & dynamic user dashboard.
 *
 * Real-time Database Synchronization:
 * - Persists meal & water intake progress to PostgreSQL database.
 * - Water slot ticks load from water_logs table on page refresh.
 * - Deterministic time rank sorting guarantees schedule items never shift position when ticked.
 * - AI recipes carry full ingredients & step-by-step instructions into RecipeDetailModal.
 */

import { useState, useEffect } from "react";
import { TodaySchedule, type ScheduleItem } from "@/components/dashboard/TodaySchedule";
import { NutritionReport } from "@/components/dashboard/NutritionReport";
import { DailyIntake } from "@/components/dashboard/DailyIntake";
import { ActivityWidget, type ActivityDayData } from "@/components/dashboard/ActivityWidget";
import { FeaturedRecipe } from "@/components/dashboard/FeaturedRecipe";
import { RecipeDetailModal } from "@/components/recipes/RecipeDetailModal";
import { PlanGeneratorDialog } from "@/components/meal-plans/PlanGeneratorDialog";
import { ManualPlanBuilderDialog } from "@/components/meal-plans/ManualPlanBuilderDialog";
import {
  toggleMealCompletionAction,
  toggleWaterSlotAction,
  syncDailyProgressAction,
  getWeeklyActivityProgressAction,
  getTodayWaterLogsCountAction,
} from "@/app/(dashboard)/dashboard/actions";
import { useProfile } from "@/hooks/useProfile";
import { Skeleton } from "@/components/ui/skeleton";
import type { Recipe } from "@/types/recipe";

const mealTimeMap: Record<string, { time: string; label: ScheduleItem["type"]; rank: number }> = {
  BREAKFAST: { time: "09:00 - 09:30 AM", label: "Breakfast", rank: 2 },
  LUNCH: { time: "01:00 - 01:30 PM", label: "Lunch", rank: 4 },
  DINNER: { time: "07:00 - 07:30 PM", label: "Dinner", rank: 6 },
  SNACK: { time: "09:00 - 09:15 PM", label: "Snack", rank: 8 },
  DESSERT: { time: "09:30 - 09:45 PM", label: "Dessert", rank: 9 },
};

const waterRankMap: Record<string, { time: string; title: string; rank: number }> = {
  w1: { time: "08:00 - 08:30 AM", title: "Morning Water Intake (500ml)", rank: 1 },
  w2: { time: "11:30 - 12:00 PM", title: "Pre-Lunch Water Intake (500ml)", rank: 3 },
  w3: { time: "04:00 - 04:30 PM", title: "Afternoon Water Intake (500ml)", rank: 5 },
  w4: { time: "08:00 - 08:30 PM", title: "Evening Water Intake (500ml)", rank: 7 },
};

export default function DashboardPage() {
  const { profile, nutritionGoal, isLoading: isProfileLoading } = useProfile();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [selectedRecipeModal, setSelectedRecipeModal] = useState<Recipe | null>(null);
  const [isFetchingPlans, setIsFetchingPlans] = useState(true);
  const [activePlanName, setActivePlanName] = useState<string | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [weeklyActivity, setWeeklyActivity] = useState<ActivityDayData[]>([]);

  const fetchActiveMealPlan = async () => {
    setIsFetchingPlans(true);
    try {
      // 1. Fetch weekly goal completion progress & water log count from database
      const weeklyData = await getWeeklyActivityProgressAction();
      setWeeklyActivity(weeklyData);

      const waterLogsCount = await getTodayWaterLogsCountAction();

      // 2. Fetch active meal plan
      const res = await fetch("/api/meal-plans");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const activePlan = json.data.find((p: any) => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            return start.getFullYear() >= 2025 && end >= todayStart;
          });

          if (activePlan && activePlan.meals?.length > 0) {
            setHasActivePlan(true);
            setActivePlanName(activePlan.name);

            const todayStr = new Date().toDateString();
            let todayMeals = activePlan.meals.filter(
              (m: any) => new Date(m.date).toDateString() === todayStr
            );

            if (todayMeals.length === 0) {
              const firstDateStr = new Date(activePlan.meals[0].date).toDateString();
              todayMeals = activePlan.meals.filter(
                (m: any) => new Date(m.date).toDateString() === firstDateStr
              );
            }

            // Construct items with water slots restored from PostgreSQL waterLogsCount
            const dynamicSchedule: Array<ScheduleItem & { rank: number }> = [
              {
                id: "w1",
                time: waterRankMap.w1.time,
                title: waterRankMap.w1.title,
                type: "Water Intake",
                waterMl: 500,
                completed: waterLogsCount >= 1,
                rank: waterRankMap.w1.rank,
              },
            ];

            todayMeals.forEach((meal: any) => {
              const config = mealTimeMap[meal.mealType] || { time: "12:00 PM", label: "Meal", rank: 10 };
              const recipeData = meal.recipeData || {};

              dynamicSchedule.push({
                id: meal.id,
                time: config.time,
                title: recipeData.title || `${config.label} Meal`,
                type: config.label,
                calories: recipeData.calories || recipeData.nutrition?.calories || 400,
                proteinG: recipeData.proteinG || recipeData.nutrition?.proteinG || 25,
                carbsG: recipeData.carbsG || recipeData.nutrition?.carbsG || 45,
                fatG: recipeData.fatG || recipeData.nutrition?.fatG || 15,
                prepTimeMinutes: recipeData.readyInMinutes || 15,
                completed: meal.isCompleted || false,
                recipeData,
                rank: config.rank,
              });

              if (meal.mealType === "BREAKFAST") {
                dynamicSchedule.push({
                  id: "w2",
                  time: waterRankMap.w2.time,
                  title: waterRankMap.w2.title,
                  type: "Water Intake",
                  waterMl: 500,
                  completed: waterLogsCount >= 2,
                  rank: waterRankMap.w2.rank,
                });
              } else if (meal.mealType === "LUNCH") {
                dynamicSchedule.push({
                  id: "w3",
                  time: waterRankMap.w3.time,
                  title: waterRankMap.w3.title,
                  type: "Water Intake",
                  waterMl: 500,
                  completed: waterLogsCount >= 3,
                  rank: waterRankMap.w3.rank,
                });
              } else if (meal.mealType === "DINNER") {
                dynamicSchedule.push({
                  id: "w4",
                  time: waterRankMap.w4.time,
                  title: waterRankMap.w4.title,
                  type: "Water Intake",
                  waterMl: 500,
                  completed: waterLogsCount >= 4,
                  rank: waterRankMap.w4.rank,
                });
              }
            });

            // Enforce strict deterministic sorting by rank
            dynamicSchedule.sort((a, b) => a.rank - b.rank);
            setScheduleItems(dynamicSchedule);
          } else {
            setHasActivePlan(false);
            setScheduleItems([]);
          }
        } else {
          setHasActivePlan(false);
          setScheduleItems([]);
        }
      }
    } catch (err) {
      console.error("Dashboard failed to load active plan:", err);
      setHasActivePlan(false);
      setScheduleItems([]);
    } finally {
      setIsFetchingPlans(false);
    }
  };

  useEffect(() => {
    fetchActiveMealPlan();
  }, []);

  // Toggle completion of schedule items & persist to PostgreSQL database
  const handleToggleItem = async (id: string) => {
    const targetItem = scheduleItems.find((i) => i.id === id);
    if (!targetItem) return;

    const newStatus = !targetItem.completed;

    // Optimistic UI update keeping strict rank sorting
    const updatedSchedule = scheduleItems.map((item) =>
      item.id === id ? { ...item, completed: newStatus } : item
    );
    setScheduleItems(updatedSchedule);

    // Calculate metrics for database sync
    const completedList = updatedSchedule.filter((i) => i.completed);
    const caloriesConsumed = completedList.reduce((acc, item) => acc + (item.calories || 0), 0);
    const proteinConsumedG = completedList.reduce((acc, item) => acc + (item.proteinG || 0), 0);
    const carbsConsumedG = completedList.reduce((acc, item) => acc + (item.carbsG || 0), 0);
    const fatConsumedG = completedList.reduce((acc, item) => acc + (item.fatG || 0), 0);
    const waterConsumedMl = completedList
      .filter((i) => i.type === "Water Intake")
      .reduce((acc, item) => acc + (item.waterMl || 500), 0);

    // Database Sync
    try {
      if (id.startsWith("w")) {
        await toggleWaterSlotAction(id, targetItem.waterMl || 500, newStatus);
      } else {
        await toggleMealCompletionAction(id, newStatus);
      }

      await syncDailyProgressAction({
        caloriesConsumed,
        caloriesGoal: nutritionGoal?.calories || 2000,
        proteinG: proteinConsumedG,
        carbsG: carbsConsumedG,
        fatG: fatConsumedG,
        waterMl: waterConsumedMl,
        waterGoalMl: 2000,
        mealsCompleted: completedList.filter((i) => i.type !== "Water Intake").length,
        mealsTotal: updatedSchedule.filter((i) => i.type !== "Water Intake").length,
      });
    } catch (err) {
      console.error("Failed to sync progress to database:", err);
    }
  };

  // Calculate live consumed metrics based on completed items
  const completedItems = scheduleItems.filter((i) => i.completed);
  const caloriesConsumed = completedItems.reduce((acc, item) => acc + (item.calories || 0), 0);
  const proteinConsumedG = completedItems.reduce((acc, item) => acc + (item.proteinG || 0), 0);
  const carbsConsumedG = completedItems.reduce((acc, item) => acc + (item.carbsG || 0), 0);
  const fatConsumedG = completedItems.reduce((acc, item) => acc + (item.fatG || 0), 0);

  const waterConsumedMl = completedItems
    .filter((i) => i.type === "Water Intake")
    .reduce((acc, item) => acc + (item.waterMl || 500), 0);

  const caloriesGoal = nutritionGoal?.calories || 2000;
  const todayCompletionPercentage = caloriesGoal > 0 ? Math.min(100, Math.round((caloriesConsumed / caloriesGoal) * 100)) : 0;

  // Active upcoming recipe for Spotlight
  const upcomingMeal = scheduleItems.find((i) => !i.completed && i.recipeData) || scheduleItems.find((i) => i.recipeData);
  const activeSpotlightRecipe: Recipe | null = upcomingMeal?.recipeData || null;

  if (isProfileLoading || isFetchingPlans) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Skeleton className="lg:col-span-4 h-96 rounded-3xl" />
          <Skeleton className="lg:col-span-5 h-96 rounded-3xl" />
          <Skeleton className="lg:col-span-3 h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  const fullName = profile?.name || "Muhammad Usman";

  return (
    <div className="space-y-6">
      {/* Welcome Greeting displaying FULL NAME & Active Plan Tag */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground">
            Hello, <span className="text-primary">{fullName}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here is your live daily schedule & intake tracking for today.
          </p>
        </div>

        {hasActivePlan && activePlanName ? (
          <div className="px-3.5 py-1.5 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary w-fit">
            Active Plan: {activePlanName}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <ManualPlanBuilderDialog onSuccess={fetchActiveMealPlan} />
            <PlanGeneratorDialog onPlanGenerated={fetchActiveMealPlan} />
          </div>
        )}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Today's Schedule (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <TodaySchedule
            items={scheduleItems}
            onToggleItem={handleToggleItem}
            onPlanGenerated={fetchActiveMealPlan}
          />
        </div>

        {/* Middle Column: Goals Report + Today's Intake + Activity Widget (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Report Cards (Water 2.0L goal, Weight, Calories) */}
          <NutritionReport
            waterMl={waterConsumedMl}
            waterGoalMl={2000}
            weightKg={profile?.weightKg || 70}
            targetWeightKg={profile?.targetWeightKg || 65}
            caloriesGoal={caloriesGoal}
            caloriesConsumed={caloriesConsumed}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Today Intake (Live Fat, Protein, Carbs) */}
            <DailyIntake
              fatConsumedG={fatConsumedG}
              fatTargetG={nutritionGoal?.fatG || 65}
              proteinConsumedG={proteinConsumedG}
              proteinTargetG={nutritionGoal?.proteinG || 120}
              carbsConsumedG={carbsConsumedG}
              carbsTargetG={nutritionGoal?.carbsG || 250}
            />
            {/* Functional Goal Completion Activity Bar Chart */}
            <ActivityWidget
              daysData={weeklyActivity}
              todayCompletionPercentage={todayCompletionPercentage}
            />
          </div>
        </div>

        {/* Right Column: Featured Recipe Spotlight (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <FeaturedRecipe
            recipe={activeSpotlightRecipe}
            onExplore={(recipe) => setSelectedRecipeModal(recipe)}
          />
        </div>
      </div>

      {/* Recipe Detail Modal for Explore Recipe CTA */}
      <RecipeDetailModal
        recipe={selectedRecipeModal}
        open={!!selectedRecipeModal}
        onOpenChange={(open) => {
          if (!open) setSelectedRecipeModal(null);
        }}
      />
    </div>
  );
}
