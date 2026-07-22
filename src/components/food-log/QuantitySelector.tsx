"use client";

/**
 * QuantitySelector Component — Interactive quantity and unit scaler.
 * Automatically calculates Calories, Protein, Carbs, Fat, and Fiber in real time as quantity changes.
 */

import { useState } from "react";
import { Scale, Flame, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scaleNutrition } from "@/lib/nutrition/calculations";
import type { Food } from "@/types/nutrition";
import type { MealType } from "@/types/meal";

interface QuantitySelectorProps {
  food: Food;
  onLog: (quantity: number, unit: string, mealType: MealType) => void;
  isLoading?: boolean;
}

export function QuantitySelector({ food, onLog, isLoading = false }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState<number>(food.servingSize || 100);
  const [unit, setUnit] = useState<string>(food.servingUnit || "g");
  const [mealType, setMealType] = useState<MealType>("BREAKFAST");

  // Real-time scaled nutrition
  const scaled = scaleNutrition(food.nutrition, quantity, food.servingSize || 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLog(quantity, unit, mealType);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-extrabold text-foreground">{food.name}</h4>
          <span className="text-[11px] text-muted-foreground">{food.brand || "Generic"}</span>
        </div>
        <Badge variant="outline" className="text-[10px] font-bold bg-card">
          Source: {food.source.toUpperCase()}
        </Badge>
      </div>

      {/* Inputs row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Quantity */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase">Quantity</Label>
          <Input
            type="number"
            min={1}
            max={2000}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="h-9 text-xs rounded-xl bg-background"
          />
        </div>

        {/* Unit */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase">Unit</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="h-9 text-xs rounded-xl bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="g">Grams (g)</SelectItem>
              <SelectItem value="serving">Serving</SelectItem>
              <SelectItem value="oz">Ounces (oz)</SelectItem>
              <SelectItem value="ml">Millilitres (ml)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meal Slot */}
        <div className="space-y-1">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase">Meal Slot</Label>
          <Select value={mealType} onValueChange={(val) => setMealType(val as MealType)}>
            <SelectTrigger className="h-9 text-xs rounded-xl bg-background font-semibold">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="BREAKFAST">Breakfast</SelectItem>
              <SelectItem value="LUNCH">Lunch</SelectItem>
              <SelectItem value="DINNER">Dinner</SelectItem>
              <SelectItem value="SNACK">Snack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Live Calculated Macros Preview */}
      <div className="grid grid-cols-4 gap-2 text-center pt-2 border-t border-border/60">
        <div className="p-2 rounded-xl bg-card border border-border">
          <span className="text-[9px] text-amber-500 font-bold block flex items-center justify-center gap-0.5">
            <Flame className="h-3 w-3 fill-amber-500" /> Calories
          </span>
          <span className="text-sm font-extrabold text-foreground">{scaled.calories} kcal</span>
        </div>

        <div className="p-2 rounded-xl bg-card border border-border">
          <span className="text-[9px] text-macro-protein font-bold block">Protein</span>
          <span className="text-sm font-bold text-foreground">{scaled.proteinG}g</span>
        </div>

        <div className="p-2 rounded-xl bg-card border border-border">
          <span className="text-[9px] text-macro-carbs font-bold block">Carbs</span>
          <span className="text-sm font-bold text-foreground">{scaled.carbsG}g</span>
        </div>

        <div className="p-2 rounded-xl bg-card border border-border">
          <span className="text-[9px] text-macro-fat font-bold block">Fat</span>
          <span className="text-sm font-bold text-foreground">{scaled.fatG}g</span>
        </div>
      </div>

      {/* Log Button */}
      <Button type="submit" disabled={isLoading} className="w-full h-10 rounded-xl font-bold gap-2">
        <Plus className="h-4 w-4" /> Log Food Item
      </Button>
    </form>
  );
}

function Badge({ children, className, ...props }: any) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${className}`} {...props}>
      {children}
    </span>
  );
}
