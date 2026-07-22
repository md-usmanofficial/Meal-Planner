"use client";

/**
 * NutritionReport Widget — 3-Card Report Grid (Water, Weight, Calories).
 * Removed static BPM section per user request.
 */

import { Droplets, Flame, Scale } from "lucide-react";
import { formatNumber, formatWater } from "@/lib/utils";

interface NutritionReportProps {
  waterMl?: number;
  waterGoalMl?: number;
  weightKg?: number;
  targetWeightKg?: number;
  caloriesConsumed?: number;
  caloriesGoal?: number;
}

export function NutritionReport({
  waterMl = 2000,
  waterGoalMl = 2500,
  weightKg = 62,
  targetWeightKg = 70,
  caloriesConsumed = 450,
  caloriesGoal = 2000,
}: NutritionReportProps) {
  const waterPercent = Math.min(100, Math.round((waterMl / waterGoalMl) * 100));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          Report <span className="text-xs font-medium text-muted-foreground">Goals For You</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* 1. Water Card */}
        <div className="relative overflow-hidden rounded-2xl border border-blue-200/50 bg-gradient-to-b from-blue-500/10 to-blue-500/5 p-4 dark:border-blue-900/40">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 mb-2">
            <span className="text-xs font-bold">Water</span>
            <Droplets className="h-4 w-4" />
          </div>
          <div className="mt-3">
            <span className="text-lg font-extrabold text-foreground">{formatWater(waterMl)}</span>
            <span className="text-[10px] text-muted-foreground ml-1">/{formatWater(waterGoalMl)}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-blue-200/50 dark:bg-blue-950">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>

        {/* 2. Weight Card */}
        <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-b from-amber-500/10 to-amber-500/5 p-4 dark:border-amber-900/40">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400 mb-2">
            <span className="text-xs font-bold">Weight</span>
            <Scale className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-foreground">{weightKg}kg</span>
            <span className="text-[10px] text-muted-foreground">Goal: {targetWeightKg}kg</span>
          </div>
          <div className="mt-2 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            Progressing steadily
          </div>
        </div>

        {/* 3. Calories Card */}
        <div className="rounded-2xl border border-rose-200/50 bg-gradient-to-b from-rose-500/10 to-rose-500/5 p-4 dark:border-rose-900/40">
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-xs font-bold">Calories</span>
            <Flame className="h-4 w-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-foreground">{formatNumber(caloriesConsumed)}</span>
            <span className="text-[10px] text-muted-foreground">/of {formatNumber(caloriesGoal)}</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-rose-200/50 dark:bg-rose-950">
            <div
              className="h-full rounded-full bg-rose-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((caloriesConsumed / caloriesGoal) * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
