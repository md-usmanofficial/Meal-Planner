"use client";

/**
 * NutritionSummary Component — Overview of daily consumed calories vs goal,
 * and progress bars for Protein, Carbs, Fat, and Fiber.
 */

import { Flame, Target } from "lucide-react";
import { formatNumber, percentage } from "@/lib/utils";

interface NutritionSummaryProps {
  caloriesConsumed: number;
  caloriesGoal: number;
  proteinG: number;
  proteinGoalG: number;
  carbsG: number;
  carbsGoalG: number;
  fatG: number;
  fatGoalG: number;
  fiberG: number;
}

export function NutritionSummary({
  caloriesConsumed = 0,
  caloriesGoal = 2000,
  proteinG = 0,
  proteinGoalG = 120,
  carbsG = 0,
  carbsGoalG = 250,
  fatG = 0,
  fatGoalG = 65,
  fiberG = 0,
}: NutritionSummaryProps) {
  const caloriesRemaining = Math.max(0, caloriesGoal - caloriesConsumed);
  const calPercent = percentage(caloriesConsumed, caloriesGoal);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
          <Flame className="h-5 w-5 text-amber-500 fill-amber-500" /> Daily Summary
        </h3>
        <span className="text-xs font-bold text-muted-foreground">
          {formatNumber(caloriesRemaining)} kcal remaining
        </span>
      </div>

      {/* Main Calorie Gauge Bar */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-foreground">{formatNumber(caloriesConsumed)}</span>
          <span className="text-xs text-muted-foreground font-semibold">Goal: {formatNumber(caloriesGoal)} kcal</span>
        </div>

        <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, calPercent)}%` }}
          />
        </div>
      </div>

      {/* Macros Progress Grid */}
      <div className="grid grid-cols-3 gap-3">
        {/* Protein */}
        <div className="space-y-1.5 p-3 rounded-2xl border border-border bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-macro-protein">Protein</span>
            <span className="text-[10px] text-muted-foreground">{proteinG} / {proteinGoalG}g</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-macro-protein transition-all duration-500"
              style={{ width: `${percentage(proteinG, proteinGoalG)}%` }}
            />
          </div>
        </div>

        {/* Carbs */}
        <div className="space-y-1.5 p-3 rounded-2xl border border-border bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-macro-carbs">Carbs</span>
            <span className="text-[10px] text-muted-foreground">{carbsG} / {carbsGoalG}g</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-macro-carbs transition-all duration-500"
              style={{ width: `${percentage(carbsG, carbsGoalG)}%` }}
            />
          </div>
        </div>

        {/* Fat */}
        <div className="space-y-1.5 p-3 rounded-2xl border border-border bg-muted/20">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-macro-fat">Fat</span>
            <span className="text-[10px] text-muted-foreground">{fatG} / {fatGoalG}g</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-macro-fat transition-all duration-500"
              style={{ width: `${percentage(fatG, fatGoalG)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
