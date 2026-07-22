"use client";

/**
 * AdherenceGauge Component — Displays Meal Plan Adherence Completion Rate (%).
 */

import { CheckCircle2, Award } from "lucide-react";

interface AdherenceGaugeProps {
  adherenceRate: number;
  totalMealsCount: number;
  completedMealsCount: number;
}

export function AdherenceGauge({
  adherenceRate = 85,
  totalMealsCount = 28,
  completedMealsCount = 24,
}: AdherenceGaugeProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Plan Adherence Rate
          </h3>
          <p className="text-xs text-muted-foreground">Percentage of planned meals completed</p>
        </div>
        <Award className="h-6 w-6 text-amber-500" />
      </div>

      <div className="flex items-center justify-center py-4">
        <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-emerald-500/20 bg-emerald-500/5">
          <div className="text-center">
            <span className="text-3xl font-extrabold text-foreground block leading-none">
              {adherenceRate}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              Adherence
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold pt-2 border-t border-border/60">
        <span>Completed: <strong className="text-foreground">{completedMealsCount}</strong></span>
        <span>Total Planned: <strong className="text-foreground">{totalMealsCount}</strong></span>
      </div>
    </div>
  );
}
