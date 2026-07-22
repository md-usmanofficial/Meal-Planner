"use client";

/**
 * NutritionGoalCard — Visual display of user's calculated BMI, BMR, TDEE,
 * and macronutrient target distribution (Protein, Carbs, Fat).
 */

import { Activity, Flame, Heart, Scale } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBMICategory } from "@/lib/nutrition/calculations";
import { formatNumber } from "@/lib/utils";

interface NutritionGoalCardProps {
  bmi: number;
  bmr: number;
  tdee: number;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  className?: string;
}

export function NutritionGoalCard({
  bmi,
  bmr,
  tdee,
  calories,
  proteinG,
  carbsG,
  fatG,
  className = "",
}: NutritionGoalCardProps) {
  const bmiInfo = getBMICategory(bmi);

  return (
    <Card className={`overflow-hidden border-border/80 shadow-md ${className}`}>
      <CardHeader className="bg-muted/30 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Flame className="h-5 w-5 text-primary" />
            Your Nutrition Targets
          </CardTitle>
          <Badge variant="outline" className="font-semibold" style={{ color: bmiInfo.color, borderColor: bmiInfo.color }}>
            BMI: {bmi} ({bmiInfo.label})
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Metabolic Summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Heart className="h-3.5 w-3.5 text-rose-500" />
              <span>BMR</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatNumber(bmr)}</p>
            <p className="text-[10px] text-muted-foreground">kcal/day base</p>
          </div>

          <div className="rounded-xl border border-border bg-background p-3">
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-1">
              <Activity className="h-3.5 w-3.5 text-amber-500" />
              <span>TDEE</span>
            </div>
            <p className="text-lg font-bold text-foreground">{formatNumber(tdee)}</p>
            <p className="text-[10px] text-muted-foreground">kcal/day active</p>
          </div>

          <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-primary mb-1">
              <Scale className="h-3.5 w-3.5" />
              <span>Target</span>
            </div>
            <p className="text-xl font-extrabold text-primary">{formatNumber(calories)}</p>
            <p className="text-[10px] text-primary/80 font-medium">kcal/day goal</p>
          </div>
        </div>

        {/* Macro Distribution Bars */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span>Macronutrient Breakdown</span>
            <span className="text-muted-foreground">Daily Target</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Protein */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
              <p className="text-xs text-macro-protein font-semibold">Protein</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{proteinG}g</p>
              <p className="text-[10px] text-muted-foreground mt-1">{proteinG * 4} kcal</p>
            </div>

            {/* Carbs */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
              <p className="text-xs text-macro-carbs font-semibold">Carbs</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{carbsG}g</p>
              <p className="text-[10px] text-muted-foreground mt-1">{carbsG * 4} kcal</p>
            </div>

            {/* Fat */}
            <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-center">
              <p className="text-xs text-macro-fat font-semibold">Fat</p>
              <p className="text-xl font-bold text-foreground mt-0.5">{fatG}g</p>
              <p className="text-[10px] text-muted-foreground mt-1">{fatG * 9} kcal</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
