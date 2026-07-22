"use client";

/**
 * Nutrition Page — Full Nutrition Overview & Target Breakdown.
 * Shows auto-calculated BMI, BMR, TDEE, Calorie targets, and Macro distribution.
 */

import { Apple, Scale, Heart, Activity, Flame, ShieldAlert } from "lucide-react";
import { NutritionGoalCard } from "@/components/profile/NutritionGoalCard";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { useProfile } from "@/hooks/useProfile";

export default function NutritionPage() {
  const { profile, nutritionGoal, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-8 w-48 rounded-xl bg-muted animate-pulse" />
        <div className="h-64 w-full rounded-3xl bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Apple className="h-7 w-7 text-primary" /> Nutrition Engine & Targets
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Automatic metabolic calculations based on your physical metrics, activity level, and goals.
        </p>
      </div>

      {/* Target Breakdown Card */}
      {nutritionGoal && (
        <NutritionGoalCard
          bmi={nutritionGoal.bmi || 22}
          bmr={nutritionGoal.bmr || 1500}
          tdee={nutritionGoal.tdee || 2000}
          calories={nutritionGoal.calories || 2000}
          proteinG={nutritionGoal.proteinG || 120}
          carbsG={nutritionGoal.carbsG || 250}
          fatG={nutritionGoal.fatG || 65}
        />
      )}

      {/* Editable Metrics Form */}
      {profile && (
        <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
          <h3 className="text-base font-extrabold text-foreground">Update Physical Metrics & Preferences</h3>
          <ProfileForm initialProfile={profile} />
        </div>
      )}
    </div>
  );
}
