"use client";

/**
 * IngredientSearchWidget — "What can I cook with these ingredients?"
 * Interactive tag input where users add available fridge ingredients to find matching recipes.
 */

import { useState } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface IngredientSearchWidgetProps {
  onSearch: (ingredients: string[]) => void;
  isLoading?: boolean;
}

export function IngredientSearchWidget({
  onSearch,
  isLoading = false,
}: IngredientSearchWidgetProps) {
  const [ingredients, setIngredients] = useState<string[]>(["chicken", "garlic", "rice"]);
  const [currentInput, setCurrentInput] = useState("");

  const addIngredient = () => {
    const trimmed = currentInput.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      const updated = [...ingredients, trimmed];
      setIngredients(updated);
      setCurrentInput("");
      onSearch(updated);
    }
  };

  const removeIngredient = (ing: string) => {
    const updated = ingredients.filter((i) => i !== ing);
    setIngredients(updated);
    onSearch(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addIngredient();
    }
  };

  return (
    <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/5 via-card to-amber-500/5 p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-foreground">
            What can I cook with these ingredients?
          </h3>
          <p className="text-xs text-muted-foreground">
            Enter the ingredients you have in your kitchen or fridge
          </p>
        </div>
      </div>

      {/* Input row */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Type an ingredient (e.g. eggs, tomatoes, spinach) and press Enter..."
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="h-11 rounded-xl bg-background border-border/80 text-sm"
        />
        <Button
          type="button"
          onClick={addIngredient}
          className="h-11 px-5 rounded-xl font-bold"
        >
          <Plus className="mr-1 h-4 w-4" /> Add
        </Button>
      </div>

      {/* Tag Chips */}
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {ingredients.map((ing) => (
            <Badge
              key={ing}
              variant="secondary"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-card border border-border/80 shadow-2xs"
            >
              <span>{ing}</span>
              <button
                type="button"
                onClick={() => removeIngredient(ing)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Search trigger button */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={() => onSearch(ingredients)}
          disabled={isLoading || ingredients.length === 0}
          className="rounded-xl font-extrabold bg-primary text-primary-foreground hover:bg-primary/90 px-6"
        >
          {isLoading ? "Searching Recipes..." : `Find Recipes (${ingredients.length} ingredients)`}
        </Button>
      </div>
    </div>
  );
}
