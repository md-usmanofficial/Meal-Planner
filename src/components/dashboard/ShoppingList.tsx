"use client";

/**
 * ShoppingList Widget — Interactive checklist displaying required ingredients
 * for the recipe featured in the active Spotlight section.
 * Fixes infinite re-render loop by using a stable ingredients key.
 */

import { useState, useEffect } from "react";
import { Utensils } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import type { Ingredient } from "@/types/recipe";

interface ShoppingListProps {
  ingredients?: Ingredient[];
  recipeTitle?: string;
}

export function ShoppingList({ ingredients = [], recipeTitle }: ShoppingListProps) {
  const [items, setItems] = useState<Array<{ id: string; name: string; quantity: string; checked: boolean }>>([]);

  const ingredientsKey = ingredients ? JSON.stringify(ingredients) : "";

  useEffect(() => {
    if (ingredients && ingredients.length > 0) {
      setItems(
        ingredients.map((ing, idx) => ({
          id: ing.id || String(idx),
          name: ing.name,
          quantity: `${ing.amount} ${ing.unit}`,
          checked: false,
        }))
      );
    } else {
      setItems([
        { id: "1", name: "Whole Eggs", quantity: "2 pcs", checked: true },
        { id: "2", name: "Whole Wheat Bread", quantity: "2 slices", checked: false },
        { id: "3", name: "Black Pepper", quantity: "1 pinch", checked: false },
      ]);
    }
  }, [ingredientsKey]);

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Utensils className="h-4 w-4 text-primary" /> Required Ingredients For Recipe
        </h3>
        {recipeTitle && (
          <span className="text-[10px] font-semibold text-muted-foreground truncate max-w-[140px]">
            {recipeTitle}
          </span>
        )}
      </div>

      {/* Item List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between cursor-pointer py-1 hover:bg-accent/40 rounded-xl px-2 transition-colors"
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-center gap-3">
              <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
              <span
                className={`text-xs font-semibold ${
                  item.checked ? "line-through text-muted-foreground" : "text-foreground"
                }`}
              >
                {item.name}
              </span>
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">{item.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
