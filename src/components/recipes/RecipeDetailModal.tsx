"use client";

/**
 * RecipeDetailModal — Full detail dialog displaying recipe ingredients, instructions, and macros.
 * Dynamically adapts UI depending on whether the food item is an API Recipe or a Custom Manually Added Item.
 */

import { Clock, Flame, Users, ExternalLink, CheckCircle2, Sparkles, Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/types/recipe";

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipeDetailModal({
  recipe,
  open,
  onOpenChange,
}: RecipeDetailModalProps) {
  if (!recipe) return null;

  const isCustom = recipe.source === "custom" || String(recipe.id).startsWith("custom");
  const ingredients = recipe.ingredients || [];
  const instructions = recipe.instructions || [];
  const cleanSummary = recipe.summary ? recipe.summary.replace(/<[^>]*>?/gm, "").trim() : "N/A";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-2xl font-extrabold text-foreground leading-tight">
              {recipe.title}
            </DialogTitle>
            {isCustom ? (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold px-2.5 py-1 rounded-xl text-xs gap-1 shrink-0">
                <Edit3 className="h-3.5 w-3.5" /> Custom Recipe
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-2.5 py-1 rounded-xl text-xs gap-1 shrink-0">
                <Sparkles className="h-3.5 w-3.5" /> API Recipe
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* Hero Image */}
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-muted">
          <img
            src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80"}
            alt={recipe.title}
            className="h-full w-full object-cover"
          />
          {recipe.healthScore && (
            <Badge className="absolute bottom-3 left-3 bg-slate-950/80 text-white backdrop-blur-md font-bold">
              Health Score: {recipe.healthScore}/100
            </Badge>
          )}
        </div>

        {/* Meta Stats Row */}
        <div className="grid grid-cols-3 gap-3 text-center py-2">
          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <Clock className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs font-bold text-foreground block">{recipe.readyInMinutes || 15} Mins</span>
            <span className="text-[10px] text-muted-foreground">Prep Time</span>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-3">
            <Users className="mx-auto h-4 w-4 text-muted-foreground mb-1" />
            <span className="text-xs font-bold text-foreground block">{recipe.servings || 1} Serving</span>
            <span className="text-[10px] text-muted-foreground">Yield</span>
          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-3">
            <Flame className="mx-auto h-4 w-4 text-amber-500 mb-1" />
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 block">
              {recipe.nutrition?.calories || 400} kcal
            </span>
            <span className="text-[10px] text-amber-600/80 dark:text-amber-400/80 font-semibold">Per Serving</span>
          </div>
        </div>

        {/* Nutrition Macros Breakdown */}
        {recipe.nutrition && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Nutrition Per Serving</h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-2.5 rounded-2xl border border-border bg-card">
                <span className="text-[10px] text-blue-500 font-bold block">Protein</span>
                <span className="text-sm font-extrabold">{recipe.nutrition.proteinG}g</span>
              </div>
              <div className="p-2.5 rounded-2xl border border-border bg-card">
                <span className="text-[10px] text-purple-500 font-bold block">Carbs</span>
                <span className="text-sm font-extrabold">{recipe.nutrition.carbsG}g</span>
              </div>
              <div className="p-2.5 rounded-2xl border border-border bg-card">
                <span className="text-[10px] text-amber-500 font-bold block">Fat</span>
                <span className="text-sm font-extrabold">{recipe.nutrition.fatG}g</span>
              </div>
              <div className="p-2.5 rounded-2xl border border-border bg-card">
                <span className="text-[10px] text-emerald-500 font-bold block">Fiber</span>
                <span className="text-sm font-extrabold">{recipe.nutrition.fiberG || 0}g</span>
              </div>
            </div>
          </div>
        )}

        {/* Food Overview / Summary */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Food Description / Overview</h4>
          <div className="p-3 rounded-2xl border border-border/80 bg-muted/20 text-xs text-foreground leading-relaxed">
            {cleanSummary}
          </div>
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Ingredients</h4>
          {ingredients.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ingredients.map((ing, idx) => (
                <div key={ing.id || idx} className="flex items-center gap-2 p-2.5 rounded-xl border border-border/60 bg-card">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xs font-semibold text-foreground">{ing.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {ing.amount} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl border border-border/60 bg-muted/20 text-xs text-muted-foreground italic">
              Standard ingredients for {recipe.title}.
            </div>
          )}
        </div>

        {/* Cooking Instructions / Recipe Steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Cooking Instructions / Recipe Steps</h4>
          {instructions.length > 0 ? (
            <div className="space-y-3">
              {instructions.map((step) => (
                <div key={step.stepNumber} className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-extrabold text-xs">
                    {step.stepNumber}
                  </div>
                  <p className="text-xs text-foreground leading-relaxed pt-0.5">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-3 rounded-2xl border border-border/60 bg-muted/20 text-xs text-muted-foreground">
              {cleanSummary !== "N/A" ? cleanSummary : "No extra preparation steps required. Ready to serve."}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" className="rounded-xl font-bold" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {recipe.sourceUrl && (
            <Button asChild variant="secondary" className="rounded-xl font-bold">
              <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer">
                View Original Source <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
