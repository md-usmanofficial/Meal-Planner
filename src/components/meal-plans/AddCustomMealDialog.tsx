"use client";

/**
 * AddCustomMealDialog — Modal for manually adding custom foods or recipe items to a meal plan slot.
 * Clean form with clear placeholders (no pre-filled clutter).
 */

import { useState } from "react";
import { Plus, Utensils } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { addCustomMealItemAction } from "@/app/(dashboard)/meal-plans/actions";
import { toast } from "sonner";
import type { MealType } from "@/types/meal";

interface AddCustomMealDialogProps {
  mealPlanId: string;
  dateStr: string;
  onSuccess?: () => void;
}

export function AddCustomMealDialog({ mealPlanId, dateStr, onSuccess }: AddCustomMealDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const [name, setName] = useState("");
  const [mealType, setMealType] = useState<MealType>("BREAKFAST");
  const [calories, setCalories] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [fatG, setFatG] = useState("");
  const [fiberG, setFiberG] = useState("");
  const [instructions, setInstructions] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter a food or dish name.");
      return;
    }

    setIsPending(true);
    try {
      await addCustomMealItemAction({
        mealPlanId,
        date: new Date(dateStr),
        mealType,
        title: name.trim(),
        calories: Number(calories) || 0,
        proteinG: Number(proteinG) || 0,
        carbsG: Number(carbsG) || 0,
        fatG: Number(fatG) || 0,
        fiberG: Number(fiberG) || 0,
        instructions: instructions.trim() || undefined,
      });

      toast.success(`Added "${name}" to your meal plan! 🍳`);
      setOpen(false);
      setName("");
      setCalories("");
      setProteinG("");
      setCarbsG("");
      setFatG("");
      setFiberG("");
      setInstructions("");
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to add meal item.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl border-dashed border-primary/40 text-primary hover:bg-primary/10 text-xs font-semibold">
          <Plus className="mr-1 h-3.5 w-3.5" /> Add Custom Food
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" /> Add Custom Food / Recipe
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Meal Type & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Meal Slot</Label>
              <Select value={mealType} onValueChange={(val) => setMealType(val as MealType)}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="BREAKFAST">Breakfast</SelectItem>
                  <SelectItem value="LUNCH">Lunch</SelectItem>
                  <SelectItem value="DINNER">Dinner</SelectItem>
                  <SelectItem value="SNACK">Snack</SelectItem>
                  <SelectItem value="DESSERT">Dessert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold">Food / Dish Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 2 Scrambled Eggs & Toast"
                className="h-10 rounded-xl"
                required
              />
            </div>
          </div>

          {/* Macro Metrics */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Required Nutrition Metrics</Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground font-semibold">Calories</Label>
                <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="350" className="h-9 rounded-xl text-xs" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground font-semibold">Protein (g)</Label>
                <Input type="number" value={proteinG} onChange={(e) => setProteinG(e.target.value)} placeholder="20" className="h-9 rounded-xl text-xs" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground font-semibold">Carbs (g)</Label>
                <Input type="number" value={carbsG} onChange={(e) => setCarbsG(e.target.value)} placeholder="30" className="h-9 rounded-xl text-xs" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground font-semibold">Fat (g)</Label>
                <Input type="number" value={fatG} onChange={(e) => setFatG(e.target.value)} placeholder="10" className="h-9 rounded-xl text-xs" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground font-semibold">Fiber (g)</Label>
                <Input type="number" value={fiberG} onChange={(e) => setFiberG(e.target.value)} placeholder="3" className="h-9 rounded-xl text-xs" />
              </div>
            </div>
          </div>

          {/* Optional Instructions */}
          <div className="space-y-1.5 pt-1">
            <Label className="text-xs font-bold">Recipe Steps / Prep Instructions (Optional)</Label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Whisk 2 eggs, cook over medium heat for 3 minutes, serve on toast."
              className="rounded-xl text-xs min-h-[70px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl font-bold bg-primary text-primary-foreground">
              {isPending ? "Adding..." : "Add to Meal Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
