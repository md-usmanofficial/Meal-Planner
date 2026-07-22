"use client";

/**
 * PlanGeneratorDialog — Modal dialog for generating Daily, Weekly, or Monthly meal plans.
 */

import { useState } from "react";
import { Sparkles, Calendar, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { generateMealPlanAction } from "@/app/(dashboard)/meal-plans/actions";
import { cn } from "@/lib/utils";
import type { PlanType } from "@/types/meal";

interface PlanGeneratorDialogProps {
  onPlanGenerated?: () => void;
}

export function PlanGeneratorDialog({ onPlanGenerated }: PlanGeneratorDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [planType, setPlanType] = useState<PlanType>("WEEKLY");
  const [foodStyle, setFoodStyle] = useState<"SIMPLE" | "GOURMET">("SIMPLE");
  const [includeDessert, setIncludeDessert] = useState(false);
  const [planName, setPlanName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("planType", planType);
      formData.set("foodStyle", foodStyle);
      formData.set("startDate", new Date().toISOString());
      formData.set("includeDessert", String(includeDessert));
      if (planName) formData.set("name", planName);

      await generateMealPlanAction(formData);
      setIsPending(false);
      setOpen(false);
      onPlanGenerated?.();
    } catch (err) {
      console.error("Failed to generate plan:", err);
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl font-extrabold shadow-sm gap-2">
          <Sparkles className="h-4 w-4" /> Build Plan with AI
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> Generate Smart Meal Plan
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Plan Type Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Plan Duration</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { type: "DAILY", label: "Daily (1 Day)" },
                { type: "WEEKLY", label: "Weekly (7 Days)" },
                { type: "MONTHLY", label: "Monthly (30 Days)" },
              ].map((p) => (
                <button
                  key={p.type}
                  type="button"
                  onClick={() => setPlanType(p.type as PlanType)}
                  className={cn(
                    "p-3 rounded-xl border text-center text-xs font-extrabold transition-all",
                    planType === p.type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:bg-accent text-foreground"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Food Style Selection */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase text-muted-foreground">Meal Style</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFoodStyle("SIMPLE")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  foodStyle === "SIMPLE"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border bg-card text-foreground hover:bg-accent"
                )}
              >
                <span className="text-xs font-bold block">🍳 Everyday Simple Foods</span>
                <span className="text-[10px] text-muted-foreground">Easy daily items (Eggs, Rice, Oats, Chicken)</span>
              </button>

              <button
                type="button"
                onClick={() => setFoodStyle("GOURMET")}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all",
                  foodStyle === "GOURMET"
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                    : "border-border bg-card text-foreground hover:bg-accent"
                )}
              >
                <span className="text-xs font-bold block">🥗 Chef & Gourmet Recipes</span>
                <span className="text-[10px] text-muted-foreground">International & specialized dishes</span>
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-name" className="text-xs font-bold">Plan Name (Optional)</Label>
            <Input
              id="plan-name"
              placeholder="e.g. Low Carb Summer Week 1"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          {/* Include Dessert Switch */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20">
            <div>
              <Label className="text-xs font-bold block">Include Optional Dessert</Label>
              <span className="text-[10px] text-muted-foreground">Adds a healthy dessert meal slot to each day</span>
            </div>
            <Switch checked={includeDessert} onCheckedChange={setIncludeDessert} />
          </div>

          {/* Submit Action */}
          <Button type="submit" disabled={isPending} className="w-full h-11 rounded-2xl font-extrabold">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" /> Generate Plan Now
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
