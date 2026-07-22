"use client";

/**
 * StreakBadge Component — Displays active streak days and flame icon.
 */

import { Flame, Trophy } from "lucide-react";

interface StreakBadgeProps {
  streakDays: number;
}

export function StreakBadge({ streakDays }: StreakBadgeProps) {
  return (
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-card to-amber-500/5 p-5 shadow-sm flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-extrabold shadow-md">
          <Flame className="h-7 w-7 fill-slate-950" />
        </div>
        <div>
          <span className="text-2xl font-extrabold text-foreground block leading-none">
            {streakDays} Day{streakDays === 1 ? "" : "s"}
          </span>
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
            Active Log Streak
          </span>
        </div>
      </div>

      <div className="text-right flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
        <Trophy className="h-4 w-4 text-amber-500" /> Keep logging daily!
      </div>
    </div>
  );
}
