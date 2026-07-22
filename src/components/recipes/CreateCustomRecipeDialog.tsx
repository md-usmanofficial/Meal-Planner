"use client";

/**
 * CreateCustomRecipeDialog — Dialog to create or edit custom recipes.
 * Clean initial state with helpful placeholders (no hardcoded pre-filled values).
 */

import { useState, useEffect } from "react";
import { Plus, Trash2, Utensils } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { saveCustomRecipeAction } from "@/app/(dashboard)/recipes/actions";
import { toast } from "sonner";
import type { Recipe, Ingredient, InstructionStep } from "@/types/recipe";

interface CreateCustomRecipeDialogProps {
  initialRecipe?: Recipe | null;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (recipe: Recipe) => void;
}

export function CreateCustomRecipeDialog({
  initialRecipe,
  trigger,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onSuccess,
}: CreateCustomRecipeDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = setControlledOpen || setUncontrolledOpen;

  const [isPending, setIsPending] = useState(false);

  // Form State — Clean initial values with clear placeholders
  const [title, setTitle] = useState("");
  const [readyInMinutes, setReadyInMinutes] = useState("");
  const [servings, setServings] = useState("");
  const [calories, setCalories] = useState("");
  const [proteinG, setProteinG] = useState("");
  const [carbsG, setCarbsG] = useState("");
  const [fatG, setFatG] = useState("");
  const [fiberG, setFiberG] = useState("");
  const [summary, setSummary] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Dynamic Lists State
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string; unit: string }>>([
    { name: "", amount: "", unit: "g" },
  ]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  useEffect(() => {
    if (initialRecipe) {
      setTitle(initialRecipe.title || "");
      setReadyInMinutes(String(initialRecipe.readyInMinutes || ""));
      setServings(String(initialRecipe.servings || ""));
      setCalories(String(initialRecipe.nutrition?.calories || ""));
      setProteinG(String(initialRecipe.nutrition?.proteinG || ""));
      setCarbsG(String(initialRecipe.nutrition?.carbsG || ""));
      setFatG(String(initialRecipe.nutrition?.fatG || ""));
      setFiberG(String(initialRecipe.nutrition?.fiberG || ""));
      setSummary(initialRecipe.summary || "");
      setImageUrl(initialRecipe.image || "");

      if (initialRecipe.ingredients && initialRecipe.ingredients.length > 0) {
        setIngredients(
          initialRecipe.ingredients.map((ing) => ({
            name: ing.name,
            amount: String(ing.amount || ""),
            unit: ing.unit || "g",
          }))
        );
      }
      if (initialRecipe.instructions && initialRecipe.instructions.length > 0) {
        setInstructions(initialRecipe.instructions.map((step) => step.description));
      }
    }
  }, [initialRecipe]);

  const handleAddIngredient = () => {
    setIngredients((prev) => [...prev, { name: "", amount: "", unit: "g" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddInstruction = () => {
    setInstructions((prev) => [...prev, ""]);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a recipe title.");
      return;
    }

    setIsPending(true);
    try {
      const formattedIngredients: Ingredient[] = ingredients
        .filter((ing) => ing.name.trim())
        .map((ing, idx) => ({
          id: `ing-${idx}-${Date.now()}`,
          name: ing.name.trim(),
          amount: Number(ing.amount) || 1,
          unit: ing.unit.trim() || "serving",
        }));

      const formattedInstructions: InstructionStep[] = instructions
        .filter((step) => step.trim())
        .map((step, idx) => ({
          stepNumber: idx + 1,
          description: step.trim(),
        }));

      const res = await saveCustomRecipeAction({
        id: initialRecipe?.id,
        title: title.trim(),
        image: imageUrl.trim() || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        readyInMinutes: Number(readyInMinutes) || 15,
        servings: Number(servings) || 1,
        summary: summary.trim() || "N/A",
        ingredients: formattedIngredients,
        instructions: formattedInstructions,
        nutrition: {
          calories: Number(calories) || 0,
          proteinG: Number(proteinG) || 0,
          carbsG: Number(carbsG) || 0,
          fatG: Number(fatG) || 0,
          fiberG: Number(fiberG) || 0,
          sugarG: 0,
          sodiumMg: 0,
        },
      });

      toast.success(initialRecipe ? "Recipe updated!" : "Custom recipe created & saved! 🍳");
      setOpen(false);
      onSuccess?.(res.recipe);
    } catch (err) {
      toast.error("Failed to save recipe.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-xl rounded-3xl p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-foreground flex items-center gap-2">
            <Utensils className="h-5 w-5 text-primary" />
            {initialRecipe ? "Edit Custom Recipe" : "Create Custom Recipe"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Title & Image URL */}
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold">Recipe Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Shrimp & Broccoli Stir-Fry"
                className="h-10 rounded-xl font-semibold"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Cover Image URL (Optional)</Label>
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Meta: Prep Time, Servings, Calories */}
          <div className="grid grid-cols-3 gap-2 bg-muted/20 p-3 rounded-2xl border border-border/60">
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground font-semibold">Prep Time (Mins)</Label>
              <Input type="number" value={readyInMinutes} onChange={(e) => setReadyInMinutes(e.target.value)} placeholder="20" className="h-9 rounded-xl text-xs font-bold" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground font-semibold">Servings (Yield)</Label>
              <Input type="number" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="1" className="h-9 rounded-xl text-xs font-bold" required />
            </div>
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground font-semibold">Calories (kcal)</Label>
              <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value)} placeholder="400" className="h-9 rounded-xl text-xs font-bold text-amber-500" required />
            </div>
          </div>

          {/* Macros Breakdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Nutrition Per Serving</Label>
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label className="text-[10px] text-blue-500 font-bold">Protein (g)</Label>
                <Input type="number" value={proteinG} onChange={(e) => setProteinG(e.target.value)} placeholder="25" className="h-9 rounded-xl text-xs" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-purple-500 font-bold">Carbs (g)</Label>
                <Input type="number" value={carbsG} onChange={(e) => setCarbsG(e.target.value)} placeholder="45" className="h-9 rounded-xl text-xs" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-amber-500 font-bold">Fat (g)</Label>
                <Input type="number" value={fatG} onChange={(e) => setFatG(e.target.value)} placeholder="15" className="h-9 rounded-xl text-xs" required />
              </div>
              <div className="space-y-1">
                <Label className="text-[10px] text-emerald-500 font-bold">Fiber (g)</Label>
                <Input type="number" value={fiberG} onChange={(e) => setFiberG(e.target.value)} placeholder="5" className="h-9 rounded-xl text-xs" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold">Food Description / Overview (Optional)</Label>
            <Textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A quick and healthy stir-fry with nutritious shrimp, broccoli, and brown rice."
              className="rounded-xl text-xs min-h-[60px]"
            />
          </div>

          {/* Ingredients List */}
          <div className="space-y-2 pt-1 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold">Ingredients List</Label>
              <Button type="button" variant="outline" size="xs" onClick={handleAddIngredient} className="rounded-lg text-[10px]">
                <Plus className="mr-1 h-3 w-3" /> Add Ingredient
              </Button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Ingredient name (e.g. Shrimp)"
                    value={ing.name}
                    onChange={(e) => {
                      const copy = [...ingredients];
                      copy[idx].name = e.target.value;
                      setIngredients(copy);
                    }}
                    className="h-8 rounded-lg text-xs flex-1"
                  />
                  <Input
                    placeholder="200"
                    value={ing.amount}
                    onChange={(e) => {
                      const copy = [...ingredients];
                      copy[idx].amount = e.target.value;
                      setIngredients(copy);
                    }}
                    className="h-8 rounded-lg text-xs w-16"
                  />
                  <Input
                    placeholder="g"
                    value={ing.unit}
                    onChange={(e) => {
                      const copy = [...ingredients];
                      copy[idx].unit = e.target.value;
                      setIngredients(copy);
                    }}
                    className="h-8 rounded-lg text-xs w-16"
                  />
                  {ingredients.length > 1 && (
                    <Button type="button" variant="ghost" size="icon-xs" onClick={() => handleRemoveIngredient(idx)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Steps */}
          <div className="space-y-2 border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold">Cooking Instructions / Recipe Steps</Label>
              <Button type="button" variant="outline" size="xs" onClick={handleAddInstruction} className="rounded-lg text-[10px]">
                <Plus className="mr-1 h-3 w-3" /> Add Step
              </Button>
            </div>

            <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
              {instructions.map((stepText, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <Input
                    placeholder={`Step ${idx + 1} description...`}
                    value={stepText}
                    onChange={(e) => {
                      const copy = [...instructions];
                      copy[idx] = e.target.value;
                      setInstructions(copy);
                    }}
                    className="h-8 rounded-lg text-xs flex-1"
                  />
                  {instructions.length > 1 && (
                    <Button type="button" variant="ghost" size="icon-xs" onClick={() => handleRemoveInstruction(idx)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-xl font-bold bg-primary text-primary-foreground">
              {isPending ? "Saving..." : initialRecipe ? "Update Recipe" : "Save Recipe"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
