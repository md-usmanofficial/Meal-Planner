"use client";

/**
 * Food Log Page — Interactive Food Logging Dashboard.
 *
 * Supports:
 * - Real-time food search via USDA & Open Food Facts
 * - Quantity scaling (automatically recalculates Calories, Protein, Carbs, Fat, Fiber)
 * - Meal slot organization (Breakfast, Lunch, Dinner, Snack)
 * - Daily progress updates
 */

import { useState, useEffect } from "react";
import { ClipboardList, Trash2, Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { FoodSearchBar } from "@/components/food-log/FoodSearchBar";
import { NutritionSummary } from "@/components/food-log/NutritionSummary";
import { Button } from "@/components/ui/button";
import { deleteFoodLogAction } from "@/app/(dashboard)/food-log/actions";
import { useProfile } from "@/hooks/useProfile";
import { formatShortDate } from "@/lib/utils";
import type { Food } from "@/types/nutrition";
import type { MealType } from "@/types/meal";
import { toast } from "sonner";

interface LoggedItem {
  id: string;
  foodName: string;
  quantity: number;
  unit: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  mealType: MealType;
}

export default function FoodLogPage() {
  const { nutritionGoal } = useProfile();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logs, setLogs] = useState<LoggedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async (date: Date) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/food-log?date=${date.toISOString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setLogs(json.data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch food logs:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(selectedDate);
  }, [selectedDate]);

  const handleLogFood = async (
    food: Food,
    quantity: number,
    unit: string,
    mealType: MealType
  ) => {
    try {
      const res = await fetch("/api/food-log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: {
            foodId: food.id,
            foodName: food.name,
            quantity,
            unit,
            mealType,
            date: selectedDate.toISOString(),
          },
          foodData: food,
        }),
      });

      if (res.ok) {
        toast.success(`Logged ${quantity}${unit} of ${food.name}! 🥗`);
        fetchLogs(selectedDate);
      }
    } catch (err) {
      console.error("Failed to log food:", err);
    }
  };

  const handleDeleteLog = async (logId: string) => {
    try {
      await deleteFoodLogAction(logId);
      toast.success("Food item removed.");
      fetchLogs(selectedDate);
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  const changeDate = (days: number) => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + days);
    setSelectedDate(next);
  };

  // Group totals
  const totalCalories = logs.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = logs.reduce((sum, item) => sum + item.proteinG, 0);
  const totalCarbs = logs.reduce((sum, item) => sum + item.carbsG, 0);
  const totalFat = logs.reduce((sum, item) => sum + item.fatG, 0);
  const totalFiber = logs.reduce((sum, item) => sum + (item.fiberG || 0), 0);

  const mealSlots: MealType[] = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"];

  return (
    <div className="space-y-6">
      {/* Header & Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-primary" /> Daily Food Log
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Log foods and track your daily macro breakdown in real time.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-card p-1.5 rounded-2xl border border-border shadow-2xs">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-xl"
            onClick={() => changeDate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-extrabold text-foreground px-2 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" /> {formatShortDate(selectedDate)}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-xl"
            onClick={() => changeDate(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Daily Nutrition Summary */}
      <NutritionSummary
        caloriesConsumed={totalCalories}
        caloriesGoal={nutritionGoal?.calories || 2000}
        proteinG={totalProtein}
        proteinGoalG={nutritionGoal?.proteinG || 120}
        carbsG={totalCarbs}
        carbsGoalG={nutritionGoal?.carbsG || 250}
        fatG={totalFat}
        fatGoalG={nutritionGoal?.fatG || 65}
        fiberG={totalFiber}
      />

      {/* Live Food Search Bar */}
      <FoodSearchBar onLogFood={handleLogFood} />

      {/* Meal Slots List */}
      <div className="space-y-4">
        {mealSlots.map((slot) => {
          const slotLogs = logs.filter((l) => l.mealType === slot);
          const slotCalories = slotLogs.reduce((acc, l) => acc + l.calories, 0);

          return (
            <div key={slot} className="rounded-3xl border border-border/80 bg-card p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-extrabold text-foreground capitalize">
                    {slot.toLowerCase()}
                  </h4>
                  <span className="text-xs font-bold text-amber-500">{slotCalories} kcal</span>
                </div>
              </div>

              {slotLogs.length > 0 ? (
                <div className="space-y-2">
                  {slotLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-foreground block">{log.foodName}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {log.quantity} {log.unit} • P: {log.proteinG}g | C: {log.carbsG}g | F: {log.fatG}g
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-extrabold text-amber-500">{log.calories} kcal</span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteLog(log.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-2 italic text-center">
                  No foods logged for {slot.toLowerCase()} yet.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
