"use client";

/**
 * SmartTipBar — Compact, Auto-Rotating Nutrition & Exercise Tip Bar.
 * Displays ONE advice item at a time, auto-changes over time, no manual buttons, no goal badges.
 */

import { useState, useEffect } from "react";
import { Lightbulb, Dumbbell, Sparkles } from "lucide-react";
import type { Goal } from "@/types/profile";

interface SmartTipBarProps {
  userGoal?: Goal | string;
}

const ALL_TIPS: Record<
  string,
  Array<{ text: string; category: "nutrition" | "exercise" }>
> = {
  WEIGHT_LOSS: [
    {
      category: "nutrition",
      text: "Drink 500ml of cold water 30 minutes before meals to naturally reduce calorie intake.",
    },
    {
      category: "exercise",
      text: "Combine 3 days of strength training with 20-30 mins of incline walking to burn fat while preserving muscle.",
    },
    {
      category: "nutrition",
      text: "Prioritize high-volume foods like leafy greens, cucumber, and lean protein to stay full on a deficit.",
    },
    {
      category: "exercise",
      text: "Aim for 8,000 to 10,000 steps daily — non-exercise activity (NEAT) accounts for major fat loss.",
    },
  ],
  WEIGHT_GAIN: [
    {
      category: "nutrition",
      text: "Include calorie-dense foods like peanut butter, avocados, and whole oats to hit your surplus target easily.",
    },
    {
      category: "exercise",
      text: "Focus on heavy compound lifts (Squats, Bench, Rows) with 2-3 minutes rest between sets for maximum mass.",
    },
  ],
  MUSCLE_GAIN: [
    {
      category: "nutrition",
      text: "Consume 20-30g of fast-digesting protein and carbs within 45 mins after workouts to fuel muscle synthesis.",
    },
    {
      category: "exercise",
      text: "Train each muscle group twice weekly with progressive overload — gradually increase weight or reps.",
    },
  ],
  MAINTENANCE: [
    {
      category: "nutrition",
      text: "Follow the 80/20 balance — 80% whole nutrient-dense foods and 20% flexible treats.",
    },
    {
      category: "exercise",
      text: "Maintain a routine of 3 days resistance training plus daily mobility and core exercises.",
    },
  ],
};

export function SmartTipBar({ userGoal = "WEIGHT_LOSS" }: SmartTipBarProps) {
  const goalKey = ALL_TIPS[userGoal] ? userGoal : "WEIGHT_LOSS";
  const tipsList = ALL_TIPS[goalKey];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate advice every 10 seconds silently
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tipsList.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [tipsList.length]);

  const activeTip = tipsList[currentIndex];
  const isNutrition = activeTip.category === "nutrition";

  return (
    <div className="rounded-2xl border border-emerald-100 dark:border-emerald-950/80 bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 p-3.5 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Category Icon */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
          {isNutrition ? <Lightbulb className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" />}
        </div>

        {/* Single Advice Text */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            <Sparkles className="h-3 w-3" />
            <span>{isNutrition ? "Nutrition Tip" : "Exercise Advice"}</span>
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate sm:whitespace-normal">
            {activeTip.text}
          </p>
        </div>
      </div>
    </div>
  );
}
