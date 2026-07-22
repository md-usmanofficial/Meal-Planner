"use client";

/**
 * RecipeCard Component — Reusable card for recipe list grids.
 */

import { Clock, Flame, Heart, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Recipe } from "@/types/recipe";

interface RecipeCardProps {
  recipe: Recipe;
  onSelect?: (recipe: Recipe) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
}

export function RecipeCard({
  recipe,
  onSelect,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-3xl border-border/80 bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      onClick={() => onSelect?.(recipe)}
    >
      {/* Image Container */}
      <div className="relative h-44 w-full overflow-hidden bg-muted">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Favorite Heart Button */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe);
            }}
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md hover:bg-white text-rose-500 transition-all shadow-xs"
          >
            <Heart className={cn("h-4 w-4", isFavorite ? "fill-rose-500" : "")} />
          </button>
        )}

        {/* Health score badge */}
        {recipe.healthScore && (
          <Badge className="absolute bottom-3 left-3 bg-slate-950/80 text-white backdrop-blur-md text-[10px] font-bold border-none">
            Score: {recipe.healthScore}/100
          </Badge>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title */}
        <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {recipe.title}
        </h4>

        {/* Diet Badges */}
        {recipe.diets.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.diets.slice(0, 2).map((diet) => (
              <Badge
                key={diet}
                variant="outline"
                className="text-[9px] px-1.5 py-0 bg-primary/5 text-primary border-primary/20 capitalize font-semibold"
              >
                {diet}
              </Badge>
            ))}
          </div>
        )}

        {/* Meta Stats: Ready Time & Calories */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5" /> {recipe.readyInMinutes} mins
          </span>

          {recipe.nutrition && (
            <span className="flex items-center gap-1 font-bold text-amber-500">
              <Flame className="h-3.5 w-3.5 fill-amber-500" /> {recipe.nutrition.calories} kcal
            </span>
          )}

          {recipe.aggregateLikes && (
            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
              <Star className="h-3 w-3 fill-amber-500" /> 4.8
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
