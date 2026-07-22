"use client";

/**
 * ManualPlanBuilderDialog — Interactive multi-step wizard for constructing a custom meal plan (1 to 7 days).
 * Allows users to pick recipes for every meal slot via the unified Recipe Search & Picker.
 */

import { useState } from "react";
import { Calendar, Plus, ChevronRight, ChevronLeft, Flame, Search, Utensils } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RecipePickerModal } from "@/components/recipes/RecipePickerModal";
import { createManualMealPlanFullAction } from "@/app/(dashboard)/meal-plans/actions";
import { toast } from "sonner";
import type { MealType } from "@/types/meal";
import type { Recipe } from "@/types/recipe";

interface CustomMealSlot {
  mealType: MealType;
  title: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  instructions?: string;
  recipeData?: Recipe;
}

interface DayMeals {
  dayIndex: number;
  meals: CustomMealSlot[];
}

interface ManualPlanBuilderDialogProps {
  onSuccess?: () => void;
}

const defaultMealsForType = (includeDessert: boolean): CustomMealSlot[] => {
  const base: CustomMealSlot[] = [
    { mealType: "BREAKFAST", title: "2 Hard Boiled Eggs & Whole Wheat Toast", calories: 310, proteinG: 20, carbsG: 26, fatG: 12 },
    { mealType: "LUNCH", title: "Grilled Chicken Breast with White Rice", calories: 460, proteinG: 44, carbsG: 45, fatG: 8 },
    { mealType: "DINNER", title: "Baked Salmon with Boiled Potatoes", calories: 510, proteinG: 36, carbsG: 32, fatG: 22 },
    { mealType: "SNACK", title: "Greek Yogurt with Berries & Almonds", calories: 210, proteinG: 18, carbsG: 16, fatG: 8 },
  ];
  if (includeDessert) {
    base.push({ mealType: "DESSERT", title: "Dark Chocolate & Almonds", calories: 150, proteinG: 3, carbsG: 15, fatG: 10 });
  }
  return base;
};

export function ManualPlanBuilderDialog({ onSuccess }: ManualPlanBuilderDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isPending, setIsPending] = useState(false);

  // Config State
  const [planName, setPlanName] = useState("");
  const [daysCount, setDaysCount] = useState(7);
  const [includeDessert, setIncludeDessert] = useState(false);

  // Day-by-Day Customized Meals State
  const [daysMeals, setDaysMeals] = useState<DayMeals[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  // Recipe Picker Target State
  const [pickerTarget, setPickerTarget] = useState<{ dayIdx: number; mealIdx: number } | null>(null);

  const handleStartCustomizing = () => {
    const days: DayMeals[] = [];
    for (let i = 0; i < daysCount; i++) {
      days.push({
        dayIndex: i,
        meals: defaultMealsForType(includeDessert),
      });
    }
    setDaysMeals(days);
    setActiveDayIndex(0);
    setStep(2);
  };

  const handleSelectRecipeFromPicker = (selectedRecipe: Recipe) => {
    if (!pickerTarget) return;

    setDaysMeals((prev) => {
      const updated = [...prev];
      const targetDay = { ...updated[pickerTarget.dayIdx] };
      const targetMeals = [...targetDay.meals];

      targetMeals[pickerTarget.mealIdx] = {
        ...targetMeals[pickerTarget.mealIdx],
        title: selectedRecipe.title,
        calories: selectedRecipe.nutrition?.calories || 400,
        proteinG: selectedRecipe.nutrition?.proteinG || 25,
        carbsG: selectedRecipe.nutrition?.carbsG || 45,
        fatG: selectedRecipe.nutrition?.fatG || 15,
        instructions: selectedRecipe.instructions
          ? selectedRecipe.instructions.map((s) => s.description).join("\n")
          : selectedRecipe.summary || undefined,
        recipeData: selectedRecipe,
      };

      targetDay.meals = targetMeals;
      updated[pickerTarget.dayIdx] = targetDay;
      return updated;
    });

    setPickerTarget(null);
  };

  const handleSubmit = async () => {
    setIsPending(true);
    try {
      await createManualMealPlanFullAction({
        name: planName.trim() || "Custom Meal Plan",
        daysCount,
        daysMeals,
      });

      toast.success("Custom meal plan created and saved to database! 🗓️");
      setOpen(false);
      setStep(1);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to create manual meal plan.");
    } finally {
      setIsPending(false);
    }
  };

  const currentDayData = daysMeals[activeDayIndex];
  const dayTotalCalories = currentDayData?.meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0) || 0;
  const dayTotalProtein = currentDayData?.meals.reduce((sum, m) => sum + (Number(m.proteinG) || 0), 0) || 0;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) setStep(1);
          setOpen(val);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="rounded-2xl border-primary text-primary hover:bg-primary/10 font-bold h-11">
            <Plus className="mr-2 h-4 w-4" /> Build Manual Plan
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Build Manual Plan
              </span>
              <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-xl">
                Step {step} of 2
              </span>
            </DialogTitle>
          </DialogHeader>

          {step === 1 ? (
            /* STEP 1: CONFIGURATION */
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold">Plan Title</Label>
                <Input
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  placeholder="e.g. My High Protein Weekly Plan"
                  className="h-10 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Duration (1 to 7 Days)</Label>
                  <Select value={String(daysCount)} onValueChange={(val) => setDaysCount(Number(val))}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="1">1 Day (Daily)</SelectItem>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="7">7 Days (1 Week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold">Include Dessert Slot?</Label>
                  <Select value={String(includeDessert)} onValueChange={(val) => setIncludeDessert(val === "true")}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="false">No (4 meals/day)</SelectItem>
                      <SelectItem value="true">Yes (5 meals/day)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-600 dark:text-blue-400 space-y-1">
                <span className="font-bold flex items-center gap-1">💧 Mandatory 2.0L Water Auto-Added</span>
                <p className="text-[11px] leading-relaxed">
                  Every day automatically includes 4 x 500ml water intake slots so your daily hydration is tracked!
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="button" onClick={handleStartCustomizing} className="rounded-xl font-bold bg-primary text-primary-foreground">
                  Next: Select Recipes <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            /* STEP 2: DAY-BY-DAY RECIPE PICKER CARDS */
            <div className="space-y-5 pt-2">
              {/* Day Selector Tabs */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  {daysMeals.map((d, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveDayIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeDayIndex === idx
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Day {idx + 1}
                    </button>
                  ))}
                </div>

                {/* Day Live Totals */}
                <div className="text-right flex items-center gap-2 text-xs font-bold text-foreground">
                  <span className="flex items-center gap-1 text-amber-500">
                    <Flame className="h-3.5 w-3.5" /> {dayTotalCalories} kcal
                  </span>
                  <span className="text-blue-500 font-extrabold">{dayTotalProtein}g P</span>
                </div>
              </div>

              {/* Meal Slots for Active Day (Clean Card view with Pick / Search Button) */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {currentDayData?.meals.map((mealSlot, mealIdx) => (
                  <div key={mealIdx} className="p-4 rounded-2xl border border-border/80 bg-card flex items-center justify-between gap-3 shadow-2xs hover:border-primary/40 transition-all">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold uppercase border-primary/30 text-primary">
                          {mealSlot.mealType}
                        </Badge>
                      </div>

                      <h4 className="text-xs font-bold text-foreground truncate">
                        {mealSlot.title}
                      </h4>

                      <p className="text-[10px] text-muted-foreground">
                        <strong className="text-amber-500">{mealSlot.calories} kcal</strong> • {mealSlot.proteinG}g P • {mealSlot.carbsG}g C • {mealSlot.fatG}g F
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setPickerTarget({ dayIdx: activeDayIndex, mealIdx })}
                      className="rounded-xl text-xs font-bold gap-1.5 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground shrink-0"
                    >
                      <Search className="h-3.5 w-3.5" /> Pick / Search Recipe
                    </Button>
                  </div>
                ))}
              </div>

              {/* Navigation & Final Submission */}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <Button type="button" variant="ghost" onClick={() => setStep(1)} className="rounded-xl text-xs">
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back to Config
                </Button>

                <div className="flex gap-2">
                  {activeDayIndex < daysMeals.length - 1 ? (
                    <Button
                      type="button"
                      onClick={() => setActiveDayIndex((prev) => prev + 1)}
                      className="rounded-xl font-bold bg-muted text-foreground hover:bg-muted/80 text-xs"
                    >
                      Next Day (Day {activeDayIndex + 2}) →
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isPending}
                      className="rounded-xl font-bold bg-primary text-primary-foreground text-xs"
                    >
                      {isPending ? "Saving Plan..." : "Save Custom Plan"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unified Live Recipe Search & Selection Modal */}
      <RecipePickerModal
        open={!!pickerTarget}
        onOpenChange={(openVal) => {
          if (!openVal) setPickerTarget(null);
        }}
        onSelectRecipe={handleSelectRecipeFromPicker}
      />
    </>
  );
}
