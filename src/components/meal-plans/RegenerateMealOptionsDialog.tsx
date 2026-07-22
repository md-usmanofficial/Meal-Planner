"use client";

/**
 * RegenerateMealOptionsDialog — Modal triggered when clicking the 🔄 icon on any meal card.
 * Asks the user whether to auto-generate a new recipe with AI or search/select manually from API & Custom Database Recipes.
 */

import { useState } from "react";
import { RefreshCw, Sparkles, Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RecipePickerModal } from "@/components/recipes/RecipePickerModal";
import { regenerateMealAction, replaceMealWithCustomAction } from "@/app/(dashboard)/meal-plans/actions";
import { toast } from "sonner";
import type { MealItemData } from "@/components/meal-plans/DayColumn";
import type { Recipe } from "@/types/recipe";

interface RegenerateMealOptionsDialogProps {
  meal: MealItemData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RegenerateMealOptionsDialog({
  meal,
  open,
  onOpenChange,
  onSuccess,
}: RegenerateMealOptionsDialogProps) {
  const [isPending, setIsPending] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleAiRegenerate = async () => {
    if (!meal) return;
    setIsPending(true);
    try {
      await regenerateMealAction(meal.id);
      toast.success("Meal replaced with a fresh AI recipe! 🥗");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to regenerate meal with AI.");
    } finally {
      setIsPending(false);
    }
  };

  const handleSelectManualRecipe = async (selectedRecipe: Recipe) => {
    if (!meal) return;
    setIsPending(true);
    try {
      await replaceMealWithCustomAction({
        mealId: meal.id,
        title: selectedRecipe.title,
        servings: selectedRecipe.servings || 1,
        calories: selectedRecipe.nutrition?.calories || 400,
        proteinG: selectedRecipe.nutrition?.proteinG || 25,
        carbsG: selectedRecipe.nutrition?.carbsG || 45,
        fatG: selectedRecipe.nutrition?.fatG || 15,
        fiberG: selectedRecipe.nutrition?.fiberG || 0,
        prepTimeMinutes: selectedRecipe.readyInMinutes || 15,
        summary: selectedRecipe.summary || "N/A",
        instructions: selectedRecipe.instructions
          ? selectedRecipe.instructions.map((step) => step.description).join("\n")
          : undefined,
      });

      toast.success(`Meal updated to "${selectedRecipe.title}"! 🍳`);
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to replace meal.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" /> Replace Meal
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              How would you like to replace <strong className="text-foreground">{meal?.recipeTitle}</strong>?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option 1: AI */}
              <button
                type="button"
                onClick={handleAiRegenerate}
                disabled={isPending}
                className="p-4 rounded-2xl border border-primary/40 bg-primary/5 hover:bg-primary/10 text-left transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary px-2 py-0.5 rounded-md">
                    AI Auto
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                    Replace with AI
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Picks the best matching recipe from API & custom database pool.
                  </p>
                </div>
              </button>

              {/* Option 2: Manual Search & Picker */}
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="p-4 rounded-2xl border border-border bg-card hover:bg-accent text-left transition-all space-y-2 group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <Search className="h-5 w-5 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md">
                    Manual Search
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-amber-500 transition-colors">
                    Search & Select Manually
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Search from API & Custom recipes or create a new recipe on the fly.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unified Recipe Search & Picker Modal */}
      <RecipePickerModal
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelectRecipe={handleSelectManualRecipe}
      />
    </>
  );
}
