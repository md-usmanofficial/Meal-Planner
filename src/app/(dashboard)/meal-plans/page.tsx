"use client";

/**
 * Meal Plans Page — Interactive Meal Planning Hub.
 *
 * Features:
 * - Skeleton loading state to eliminate flash of empty state before plans load
 * - Auto-generate or manually construct daily & weekly meal plans
 * - Edit plan titles & replace individual meals (AI vs Manual input with Servings & Summary)
 * - Deterministic card sorting so card order never shifts upon editing
 * - Saved plan independence & interactive Reuse Saved Plan button
 */

import { useState, useEffect } from "react";
import { CalendarDays, Bookmark, BookmarkCheck, Sparkles, Trash2, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DayColumn, type MealItemData } from "@/components/meal-plans/DayColumn";
import { PlanGeneratorDialog } from "@/components/meal-plans/PlanGeneratorDialog";
import { ManualPlanBuilderDialog } from "@/components/meal-plans/ManualPlanBuilderDialog";
import { EditPlanNameDialog } from "@/components/meal-plans/EditPlanNameDialog";
import { RecipeDetailModal } from "@/components/recipes/RecipeDetailModal";
import { PDFDownloadButton } from "@/components/pdf/PDFDownloadButton";
import {
  regenerateDayAction,
  toggleSavePlanAction,
  deleteMealPlanAction,
  reuseSavedPlanAction,
} from "@/app/(dashboard)/meal-plans/actions";
import { RecipeService } from "@/services/recipe.service";
import type { Recipe } from "@/types/recipe";
import type { MealType } from "@/types/meal";
import { toast } from "sonner";

interface MealPlanDB {
  id: string;
  name: string;
  planType: string;
  startDate: string;
  endDate: string;
  isSaved: boolean;
  meals: Array<{
    id: string;
    mealType: MealType;
    recipeId: string;
    recipeData: any;
    servings: number;
    date: string;
    isCompleted: boolean;
  }>;
}

const mealTypeRank: Record<string, number> = {
  BREAKFAST: 1,
  LUNCH: 2,
  DINNER: 3,
  SNACK: 4,
  DESSERT: 5,
};

export default function MealPlansPage() {
  const [plans, setPlans] = useState<MealPlanDB[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/meal-plans");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setPlans(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch meal plans:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Active plan must be a plan starting in active range (>= 2025) and ending today or in the future
  const activePlan =
    plans.find((p) => {
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return start.getFullYear() >= 2025 && end >= todayStart;
    }) || null;

  const savedPlans = plans.filter((p) => p.isSaved);

  const handleRegenerateDay = async (dateStr: string) => {
    if (!activePlan) return;
    try {
      await regenerateDayAction(activePlan.id, dateStr);
      toast.success("All meals for this day were regenerated! ✨");
      fetchPlans();
    } catch (err) {
      console.error("Regenerate day error:", err);
    }
  };

  const handleToggleSave = async (planId: string) => {
    try {
      const res = await toggleSavePlanAction(planId);
      toast.success(res.isSaved ? "Meal plan saved to database!" : "Removed from saved plans.");
      fetchPlans();
    } catch (err) {
      console.error("Save plan error:", err);
    }
  };

  const handleReusePlan = async (planId: string) => {
    try {
      await reuseSavedPlanAction(planId);
      toast.success("Saved plan activated for today! 🗓️");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to reuse saved plan.");
    }
  };

  const handleDeletePlan = async (planId: string, isSavedTab = false) => {
    const msg = isSavedTab
      ? "Permanently delete this saved plan from your database?"
      : "Cancel and remove this plan from active view?";

    if (!confirm(msg)) return;

    try {
      await deleteMealPlanAction(planId, isSavedTab);
      toast.success(isSavedTab ? "Saved plan permanently deleted." : "Active plan removed.");
      fetchPlans();
    } catch (err) {
      toast.error("Failed to delete plan.");
    }
  };

  const handleSelectMeal = async (mealItem: MealItemData) => {
    if (mealItem.recipeData) {
      setSelectedRecipe(mealItem.recipeData as Recipe);
      setModalOpen(true);
    } else {
      const fullRecipe = await RecipeService.getById(mealItem.id);
      if (fullRecipe) {
        setSelectedRecipe(fullRecipe);
        setModalOpen(true);
      }
    }
  };

  // Group active plan's meals by date, sorted DETERMINISTICALLY by MealType rank
  const groupedDays = activePlan
    ? Object.entries(
        activePlan.meals.reduce((acc, meal) => {
          const dateKey = new Date(meal.date).toDateString();
          if (!acc[dateKey]) acc[dateKey] = [];
          acc[dateKey].push({
            id: meal.id,
            mealType: meal.mealType,
            recipeTitle: meal.recipeData?.title || "Delicious Healthy Meal",
            recipeImage: meal.recipeData?.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
            calories: meal.recipeData?.calories || 400,
            proteinG: meal.recipeData?.proteinG || 25,
            carbsG: meal.recipeData?.carbsG || 45,
            fatG: meal.recipeData?.fatG || 15,
            prepTimeMinutes: meal.recipeData?.readyInMinutes || 20,
            isCompleted: meal.isCompleted,
            recipeData: meal.recipeData,
          });
          return acc;
        }, {} as Record<string, MealItemData[]>)
      ).map(([dateStr, mealsList]) => {
        const sortedMeals = [...mealsList].sort(
          (a, b) => (mealTypeRank[a.mealType] || 99) - (mealTypeRank[b.mealType] || 99)
        );
        return [dateStr, sortedMeals] as [string, MealItemData[]];
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header & Action Triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <CalendarDays className="h-7 w-7 text-primary" /> Meal Planning Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Auto-generate or manually construct daily & weekly meal plans saved to your database.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ManualPlanBuilderDialog onSuccess={fetchPlans} />
          <PlanGeneratorDialog onPlanGenerated={fetchPlans} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="bg-muted/40 p-1 rounded-2xl">
          <TabsTrigger value="current" className="rounded-xl font-bold text-xs gap-2">
            <Sparkles className="h-3.5 w-3.5 text-primary" /> Current Active Plan
          </TabsTrigger>
          <TabsTrigger value="saved" className="rounded-xl font-bold text-xs gap-2">
            <Bookmark className="h-3.5 w-3.5 text-amber-500" /> Saved Plans ({savedPlans.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: CURRENT ACTIVE PLAN */}
        <TabsContent value="current" className="space-y-6">
          {isLoading ? (
            /* Skeleton Loading State to eliminate flash of empty state */
            <div className="space-y-6">
              <Skeleton className="h-20 w-full rounded-3xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-96 rounded-3xl" />
                ))}
              </div>
            </div>
          ) : activePlan ? (
            <div className="space-y-6">
              {/* Plan Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl border border-border bg-card shadow-xs">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-foreground">{activePlan.name}</h3>
                      <EditPlanNameDialog planId={activePlan.id} currentName={activePlan.name} onSuccess={fetchPlans} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                      {activePlan.planType} Plan • Active ({activePlan.meals.length} items)
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <PDFDownloadButton
                    planName={activePlan.name}
                    planType={activePlan.planType}
                    startDate={new Date(activePlan.startDate).toLocaleDateString()}
                    endDate={new Date(new Date(activePlan.startDate).getTime() + 7 * 86400000).toLocaleDateString()}
                    meals={activePlan.meals.map((m) => ({
                      id: m.id,
                      mealType: m.mealType,
                      recipeTitle: m.recipeData?.title || "Healthy Meal",
                      calories: m.recipeData?.calories || 400,
                      date: m.date,
                    }))}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl font-bold gap-2 text-xs"
                    onClick={() => handleToggleSave(activePlan.id)}
                  >
                    {activePlan.isSaved ? (
                      <>
                        <BookmarkCheck className="h-4 w-4 text-amber-500 fill-amber-500" /> Saved
                      </>
                    ) : (
                      <>
                        <Bookmark className="h-4 w-4" /> Save Plan
                      </>
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-xl text-destructive hover:bg-destructive/10 text-xs font-semibold"
                    onClick={() => handleDeletePlan(activePlan.id, false)}
                    title="Remove from Active View"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                </div>
              </div>

              {/* Days Columns Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedDays.map(([dateStr, meals]) => (
                  <DayColumn
                    key={dateStr}
                    date={dateStr}
                    meals={meals}
                    onRegenerateDay={handleRegenerateDay}
                    onRefreshPlans={fetchPlans}
                    onSelectMeal={handleSelectMeal}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl border border-dashed border-border space-y-4">
              <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-bold text-foreground">No active meal plan generated yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Auto-generate a plan using AI or build your own custom meal plan (up to 7 days).
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <ManualPlanBuilderDialog onSuccess={fetchPlans} />
                <PlanGeneratorDialog onPlanGenerated={fetchPlans} />
              </div>
            </div>
          )}
        </TabsContent>

        {/* TAB 2: SAVED PLANS */}
        <TabsContent value="saved" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-32 rounded-3xl" />
              ))}
            </div>
          ) : savedPlans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedPlans.map((plan) => (
                <div key={plan.id} className="p-5 rounded-3xl border border-border bg-card space-y-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-foreground">{plan.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {plan.planType} Plan • {plan.meals.length} total meals
                      </p>
                    </div>
                    <BookmarkCheck className="h-6 w-6 text-amber-500 fill-amber-500" />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-xl font-bold text-xs h-9 bg-primary/5 hover:bg-primary/10 border-primary/30 text-primary"
                      onClick={() => handleReusePlan(plan.id)}
                    >
                      Reuse Plan <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeletePlan(plan.id, true)}
                      title="Permanently Delete Saved Plan"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 rounded-3xl border border-dashed border-border">
              <Bookmark className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <h3 className="text-base font-bold text-foreground">No saved meal plans yet</h3>
              <p className="text-xs text-muted-foreground mt-1">Save your favorite active plans to keep them permanently in your database.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal
        recipe={selectedRecipe}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
