"use client";

/**
 * FoodSearchBar Component — Real-time food search with live results from USDA & Open Food Facts.
 */

import { useState, useEffect } from "react";
import { Search, Loader2, Apple } from "lucide-react";
import { Input } from "@/components/ui/input";
import { QuantitySelector } from "@/components/food-log/QuantitySelector";
import type { Food } from "@/types/nutrition";
import type { MealType } from "@/types/meal";

interface FoodSearchBarProps {
  onLogFood: (food: Food, quantity: number, unit: string, mealType: MealType) => void;
}

export function FoodSearchBar({ onLogFood }: FoodSearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/food-search?query=${encodeURIComponent(query)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            setResults(json.data);
          }
        }
      } catch (err) {
        console.error("Food search error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectFood = (food: Food) => {
    setSelectedFood(food);
  };

  const handleLog = (quantity: number, unit: string, mealType: MealType) => {
    if (selectedFood) {
      onLogFood(selectedFood, quantity, unit, mealType);
      setSelectedFood(null);
      setQuery("");
      setResults([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search foods (e.g. Chicken breast, Avocado, Brown rice)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 rounded-2xl pl-10 pr-10 bg-card border-border/80 text-sm shadow-xs"
        />
        {isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-primary" />
        )}
      </div>

      {/* Selected Food Quantity Scaler */}
      {selectedFood && (
        <QuantitySelector
          food={selectedFood}
          onLog={handleLog}
          isLoading={isLoading}
        />
      )}

      {/* Results List Dropdown */}
      {!selectedFood && results.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-2 shadow-lg space-y-1 max-h-72 overflow-y-auto">
          {results.map((food) => (
            <div
              key={food.id}
              onClick={() => handleSelectFood(food)}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-accent cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Apple className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground leading-tight">{food.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {food.brand || "Generic"} • {food.servingSize} {food.servingUnit}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-extrabold text-amber-500 block">
                  {food.nutrition.calories} kcal
                </span>
                <span className="text-[10px] text-muted-foreground">
                  P: {food.nutrition.proteinG}g | C: {food.nutrition.carbsG}g | F: {food.nutrition.fatG}g
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
