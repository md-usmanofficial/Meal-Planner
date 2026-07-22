"use client";

/**
 * DayColumn Component — Displays a single day's worth of meals & total daily calories.
 * Clicking the 🔄 icon on any meal opens the Replace Options Dialog (AI vs Manual input).
 */

import { useState } from "react";
import { RefreshCw, Flame, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealCard } from "@/components/meal-plans/MealCard";
import { RegenerateMealOptionsDialog } from "@/components/meal-plans/RegenerateMealOptionsDialog";
import { formatShortDate } from "@/lib/utils";
import type { MealType } from "@/types/meal";

export interface MealItemData {
  id: string;
  mealType: MealType;
  recipeTitle: string;
  recipeImage: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  prepTimeMinutes: number;
  isCompleted?: boolean;
  recipeData?: any;
}

interface DayColumnProps {
  date: Date | string;
  dayTitle?: string;
  meals: MealItemData[];
  onRegenerateDay?: (date: string) => void;
  onRefreshPlans?: () => void;
  onSelectMeal?: (meal: MealItemData) => void;
}

export function DayColumn({
  date,
  dayTitle,
  meals,
  onRegenerateDay,
  onRefreshPlans,
  onSelectMeal,
}: DayColumnProps) {
  const [isRegeneratingDay, setIsRegeneratingDay] = useState(false);
  const [selectedMealForRegen, setSelectedMealForRegen] = useState<MealItemData | null>(null);

  const totalCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProtein = meals.reduce((acc, m) => acc + (m.proteinG || 0), 0);
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const handleRegenerateDay = async () => {
    if (onRegenerateDay) {
      setIsRegeneratingDay(true);
      await onRegenerateDay(dateObj.toISOString());
      setIsRegeneratingDay(false);
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-sm space-y-4">
      {/* Day Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <span className="text-xs font-bold text-primary flex items-center gap-1 uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5" /> {dayTitle || formatShortDate(dateObj)}
          </span>
          <p className="text-xs font-extrabold text-foreground mt-0.5 flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500" /> {totalCalories} kcal
            <span className="text-muted-foreground font-normal text-[10px]">({totalProtein}g protein)</span>
          </p>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-3">
        {meals.map((meal) => (
          <MealCard
            key={meal.id}
            id={meal.id}
            mealType={meal.mealType}
            recipeTitle={meal.recipeTitle}
            recipeImage={meal.recipeImage}
            calories={meal.calories}
            proteinG={meal.proteinG}
            carbsG={meal.carbsG}
            fatG={meal.fatG}
            prepTimeMinutes={meal.prepTimeMinutes}
            isCompleted={meal.isCompleted}
            onOpenReplaceModal={() => setSelectedMealForRegen(meal)}
            onSelect={() => onSelectMeal?.(meal)}
          />
        ))}
      </div>

      {/* Replace Options Dialog (AI vs Manual Replace) */}
      <RegenerateMealOptionsDialog
        meal={selectedMealForRegen}
        open={!!selectedMealForRegen}
        onOpenChange={(open) => {
          if (!open) setSelectedMealForRegen(null);
        }}
        onSuccess={onRefreshPlans}
      />
    </div>
  );
}
