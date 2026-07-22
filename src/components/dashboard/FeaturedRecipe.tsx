"use client";

/**
 * FeaturedRecipe Component — Displays the upcoming recipe in the user's active plan.
 * Uses mounted state guard to prevent hydration mismatch with persistent Zustand store.
 */

import { useState, useEffect } from "react";
import { Clock, Flame, Star, ThumbsUp, ArrowRight, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavoriteStore } from "@/store/favoriteStore";
import { toast } from "sonner";
import type { Recipe } from "@/types/recipe";

interface FeaturedRecipeProps {
  recipe?: Recipe | null;
  onExplore?: (recipe: Recipe) => void;
}

const fallbackRecipe: Recipe = {
  id: "ez-b1",
  source: "spoonacular",
  title: "2 Hard Boiled Eggs & Whole Wheat Toast",
  image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  readyInMinutes: 10,
  servings: 1,
  cuisines: ["American"],
  diets: ["high protein"],
  dishTypes: ["breakfast"],
  summary: "Simple boiled eggs served with toasted whole wheat bread and black pepper.",
  instructions: [
    { stepNumber: 1, description: "Boil 2 large eggs for 8 minutes." },
    { stepNumber: 2, description: "Toast 2 slices of whole wheat bread." },
    { stepNumber: 3, description: "Peel eggs, slice in half, and serve on warm toast." },
  ],
  ingredients: [
    { id: "ez-i1", name: "Whole Eggs", amount: 2, unit: "pcs", image: null },
    { id: "ez-i2", name: "Whole Wheat Bread", amount: 2, unit: "slices", image: null },
    { id: "ez-i3", name: "Black Pepper", amount: 1, unit: "pinch", image: null },
  ],
  nutrition: { calories: 310, proteinG: 20, carbsG: 26, fatG: 12, fiberG: 4, sugarG: 2, sodiumMg: 380 },
  healthScore: 90,
};

export function FeaturedRecipe({ recipe, onExplore }: FeaturedRecipeProps) {
  const [mounted, setMounted] = useState(false);
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const activeRecipe = recipe || fallbackRecipe;

  useEffect(() => {
    setMounted(true);
  }, []);

  const favorited = mounted ? isFavorite(activeRecipe.id) : false;

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFav = toggleFavorite(activeRecipe);
    if (isNowFav) {
      toast.success(`Saved "${activeRecipe.title}" to Favorites! ❤️`);
    } else {
      toast.info(`Removed "${activeRecipe.title}" from Favorites.`);
    }
  };

  const handleExploreClick = () => {
    if (onExplore) {
      onExplore(activeRecipe);
    }
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-lg space-y-4 relative overflow-hidden">
      {/* Recipe Image */}
      <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
        <img
          src={activeRecipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
          alt={activeRecipe.title}
          className="h-full w-full object-cover"
        />
        {/* Persistent Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteToggle}
          title={favorited ? "Remove from Favorites" : "Add to Favorites"}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              favorited ? "fill-rose-500 text-rose-500" : "text-slate-400 fill-none hover:text-rose-400"
            }`}
          />
        </button>
      </div>

      {/* Recipe Header */}
      <div>
        <h3 className="text-lg font-extrabold text-foreground leading-tight line-clamp-1">
          {activeRecipe.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {activeRecipe.summary ? activeRecipe.summary.replace(/<[^>]*>?/gm, "") : "Nutritious daily meal recipe."}
        </p>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] px-2 py-0.5 capitalize">
          {activeRecipe.dishTypes?.[0] || "Main dish"}
        </Badge>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
          <Clock className="h-3 w-3" /> {activeRecipe.readyInMinutes || 15} Mins
        </span>
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
          <Flame className="h-3 w-3 text-amber-500" /> {activeRecipe.nutrition?.calories || 350}cal
        </span>
      </div>

      {/* Ingredients Preview */}
      <div className="space-y-2 pt-1">
        <p className="text-xs font-bold text-foreground">Recipe Ingredients</p>
        <div className="grid grid-cols-3 gap-2">
          {activeRecipe.ingredients?.slice(0, 6).map((ing, i) => (
            <div key={i} className="flex flex-col items-center justify-center p-2 rounded-xl bg-muted/40 border border-border/40 text-center">
              <span className="text-xs font-bold truncate max-w-full text-foreground">{ing.name}</span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5">
                {ing.amount} {ing.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Ratings & Social */}
      <div className="flex items-center justify-between pt-2 text-xs font-semibold text-muted-foreground border-t border-border/60">
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-amber-500" />
          <span className="font-extrabold text-foreground">4.9</span>
        </div>
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3.5 w-3.5" /> 1.5k
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {activeRecipe.readyInMinutes}m
        </span>
      </div>

      {/* Explore Recipe CTA Button */}
      <Button
        onClick={handleExploreClick}
        className="w-full h-10 rounded-2xl font-bold bg-card border-2 border-foreground text-foreground hover:bg-foreground hover:text-card transition-all text-xs"
      >
        Explore Recipe <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
