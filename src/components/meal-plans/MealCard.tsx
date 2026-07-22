"use client";

/**
 * MealCard Component — Displays an individual meal within a plan day.
 * Clicking the 🔄 icon triggers the Replace Options modal (AI vs Manual input).
 */

import { RefreshCw, Clock, Flame, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { MealType } from "@/types/meal";

interface MealCardProps {
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
  onOpenReplaceModal?: () => void;
  onSelect?: () => void;
}

export function MealCard({
  mealType,
  recipeTitle,
  recipeImage,
  calories,
  proteinG,
  prepTimeMinutes,
  isCompleted = false,
  onOpenReplaceModal,
  onSelect,
}: MealCardProps) {
  const handleRegenerateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenReplaceModal?.();
  };

  return (
    <Card
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl border-border/80 bg-card shadow-2xs hover:shadow-md transition-all duration-200",
        isCompleted && "opacity-75 bg-muted/20"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {/* Image */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
            <img
              src={recipeImage}
              alt={recipeTitle}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {isCompleted && (
              <div className="absolute inset-0 bg-emerald-500/30 flex items-center justify-center text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={cn(
                  "text-[9px] px-1.5 py-0 border-transparent font-bold capitalize",
                  mealType === "BREAKFAST" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                  mealType === "LUNCH" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  mealType === "DINNER" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                  mealType === "SNACK" && "bg-rose-500/10 text-rose-600 dark:text-rose-400",
                  mealType === "DESSERT" && "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                )}
              >
                {mealType.toLowerCase()}
              </Badge>

              {/* Single Meal Replace Icon (AI vs Manual Choice) */}
              {onOpenReplaceModal && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={handleRegenerateClick}
                  title="Replace or Edit this meal"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              )}
            </div>

            <h5 className="text-xs font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {recipeTitle}
            </h5>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium">
              <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                <Flame className="h-3 w-3 fill-amber-500" /> {calories} kcal
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Clock className="h-3 w-3" /> {prepTimeMinutes}m
              </span>
              <span>•</span>
              <span>{proteinG}g P</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
