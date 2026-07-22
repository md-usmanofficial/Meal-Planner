"use client";

/**
 * DailyIntake Widget — Displays Today's Intake (Fat, Protein, Carbs) consumed from completed meals.
 * Water section removed per user request (Water has a dedicated top report card).
 */

interface DailyIntakeProps {
  fatConsumedG?: number;
  fatTargetG?: number;
  proteinConsumedG?: number;
  proteinTargetG?: number;
  carbsConsumedG?: number;
  carbsTargetG?: number;
}

export function DailyIntake({
  fatConsumedG = 0,
  fatTargetG = 65,
  proteinConsumedG = 0,
  proteinTargetG = 120,
  carbsConsumedG = 0,
  carbsTargetG = 250,
}: DailyIntakeProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">Today Intake</h3>
        <span className="text-[10px] text-muted-foreground font-semibold">Live Consumed</span>
      </div>

      {/* Macro Badges */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Fat */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-2.5">
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block uppercase">Fat</span>
          <span className="text-base font-extrabold text-foreground">{fatConsumedG}g</span>
          <span className="text-[9px] text-muted-foreground block font-medium mt-0.5">of {fatTargetG}g</span>
        </div>

        {/* Protein */}
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-2.5">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 block uppercase">Protein</span>
          <span className="text-base font-extrabold text-foreground">{proteinConsumedG}g</span>
          <span className="text-[9px] text-muted-foreground block font-medium mt-0.5">of {proteinTargetG}g</span>
        </div>

        {/* Carbs */}
        <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-2.5">
          <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 block uppercase">Carbs</span>
          <span className="text-base font-extrabold text-foreground">{carbsConsumedG}g</span>
          <span className="text-[9px] text-muted-foreground block font-medium mt-0.5">of {carbsTargetG}g</span>
        </div>
      </div>
    </div>
  );
}
