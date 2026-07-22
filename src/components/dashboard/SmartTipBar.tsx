"use client";

/**
 * SmartTipBar — Personalized Nutrition & Exercise Advice Widget.
 * Suggests tailored diet & workout tips based on the user's active fitness goal.
 */

import { useState } from "react";
import { Lightbulb, Dumbbell, Sparkles, RefreshCw, ArrowRight, ShieldCheck, Flame, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Goal } from "@/types/profile";

interface SmartTipBarProps {
  userGoal?: Goal | string;
}

// Tailored Nutrition & Exercise Tips Database
const TIPS_DATABASE: Record<
  string,
  Array<{ nutrition: string; exercise: string; focus: string }>
> = {
  WEIGHT_LOSS: [
    {
      focus: "Calorie Deficit & Fat Loss",
      nutrition: "Prioritize high-volume, low-calorie foods like leafy greens, berries, and lean protein (chicken, white fish) to stay full while in a deficit.",
      exercise: "Combine 3 days of full-body strength training with 20-30 mins of LISS cardio (brisk walking/incline treadmill) to burn fat while preserving muscle.",
    },
    {
      focus: "Satiety & Fiber Optimization",
      nutrition: "Aim for 30g+ of dietary fiber daily from chia seeds, lentils, and oats. Fiber slows digestion and keeps hunger hormones in check.",
      exercise: "Try Zone 2 cardio (steady-state aerobic exercise where you can hold a conversation) for 35-45 minutes to maximize fat oxidation.",
    },
    {
      focus: "Hydration & Metabolism",
      nutrition: "Drink 500ml of cold water 30 minutes before every main meal. Studies show this naturally reduces calorie intake by up to 13%.",
      exercise: "Incorporate high-intensity interval training (HIIT) 1-2 times per week for EPOC (excess post-exercise oxygen consumption) calorie burn.",
    },
  ],
  WEIGHT_GAIN: [
    {
      focus: "Calorie Surplus & Mass",
      nutrition: "Eat nutrient-dense, calorie-rich foods like avocados, nuts, peanut butter, whole milk, and olive oil to meet surplus targets comfortably.",
      exercise: "Focus on heavy compound lifts (Squats, Deadlifts, Bench Press) in the 6-10 rep range with 2-3 minutes rest between sets.",
    },
    {
      focus: "Protein Synthesis & Recovery",
      nutrition: "Consume a protein & carb snack (e.g. Greek yogurt with banana & honey) within 45 minutes after training to maximize muscle growth.",
      exercise: "Keep cardio to a moderate 15-20 minutes twice a week for cardiovascular health without burning off your muscle-building surplus.",
    },
  ],
  MUSCLE_GAIN: [
    {
      focus: "Hypertrophy & Macro Split",
      nutrition: "Aim for 1.8g - 2.2g of protein per kg of bodyweight. Distribute protein evenly across 4 meals (approx. 30-40g per meal).",
      exercise: "Train each muscle group twice per week with progressive overload — increase weight, reps, or control tempo over time.",
    },
    {
      focus: "Pre-Workout Fueling",
      nutrition: "Eat fast-digesting complex carbs (e.g. rice cakes with almond butter or oatmeal) 60-90 minutes before heavy lifting for peak energy.",
      exercise: "Ensure 48-72 hours of recovery for trained muscle groups. Sleep 7-9 hours to maximize human growth hormone (HGH) release.",
    },
  ],
  MAINTENANCE: [
    {
      focus: "Energy Balance & Vitality",
      nutrition: "Follow the 80/20 rule — 80% whole nutrient-dense foods (veggies, lean meats, whole grains) and 20% flexible food choices.",
      exercise: "Maintain a balanced routine: 3 days resistance training + 2 days cardiovascular conditioning + daily 8,000-10,000 steps.",
    },
    {
      focus: "Metabolic Health & Longevity",
      nutrition: "Include colorful antioxidant-rich berries, dark leafy greens, and omega-3 rich salmon or walnuts to combat inflammation.",
      exercise: "Integrate mobility and core stability work (yoga, Pilates, or foam rolling) for 10-15 mins daily to prevent injuries.",
    },
  ],
};

export function SmartTipBar({ userGoal = "WEIGHT_LOSS" }: SmartTipBarProps) {
  const goalKey = TIPS_DATABASE[userGoal] ? userGoal : "WEIGHT_LOSS";
  const tipsList = TIPS_DATABASE[goalKey];

  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tipsList.length);
  };

  const activeTip = tipsList[currentTipIndex];
  const formattedGoalLabel =
    goalKey === "WEIGHT_LOSS"
      ? "Weight Loss Goal"
      : goalKey === "MUSCLE_GAIN"
      ? "Muscle Build Goal"
      : goalKey === "WEIGHT_GAIN"
      ? "Weight Gain Goal"
      : "Maintenance Goal";

  return (
    <div className="rounded-3xl border border-emerald-100 dark:border-emerald-950/60 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-slate-50 dark:to-slate-900/60 p-5 sm:p-6 shadow-sm shadow-emerald-900/5 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 border-b border-emerald-100/80 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              Smart Goal Recommendations
            </h3>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Personalized advice based on your current objectives
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 border-none">
            {formattedGoalLabel}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={handleNextTip}
            className="rounded-xl h-8 text-xs font-bold border-emerald-200 dark:border-slate-700 hover:bg-emerald-100/60 dark:hover:bg-slate-800 gap-1.5"
          >
            <RefreshCw className="h-3 w-3 text-emerald-600" /> Refresh Advice
          </Button>
        </div>
      </div>

      {/* Focus Pill */}
      <div className="mb-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-extrabold">
        <Flame className="h-3.5 w-3.5 text-emerald-600" /> Focus: {activeTip.focus}
      </div>

      {/* 2-Column Tips Grid: Nutrition vs Exercise */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Diet & Nutrition Tip */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 dark:text-emerald-400">
            <Lightbulb className="h-4 w-4" />
            <span>Nutrition & Meal Strategy</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {activeTip.nutrition}
          </p>
        </div>

        {/* Exercise & Workout Tip */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-emerald-100 dark:border-slate-800 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-extrabold text-teal-700 dark:text-teal-400">
            <Dumbbell className="h-4 w-4" />
            <span>Exercise & Workout Strategy</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {activeTip.exercise}
          </p>
        </div>
      </div>
    </div>
  );
}
