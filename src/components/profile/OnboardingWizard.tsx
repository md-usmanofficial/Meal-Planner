"use client";

/**
 * OnboardingWizard — 4-Step Interactive Onboarding Component.
 *
 * Steps:
 * 1. Physical Metrics (Gender, Age, Height, Weight, Target Weight)
 * 2. Fitness Goals & Activity (Goal, Activity Level)
 * 3. Dietary Preferences & Health (Dietary Pref, Allergies, Health Conditions)
 * 4. Summary & Live Target Calculations (BMI, BMR, TDEE, Calorie/Macro breakdown)
 */

import { useState } from "react";
import { useActionState } from "react";
import { ArrowLeft, ArrowRight, Check, Flame, Sparkles } from "lucide-react";
import { submitOnboardingAction } from "@/app/onboarding/actions";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { NutritionGoalCard } from "@/components/profile/NutritionGoalCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  commonAllergies,
  commonHealthConditions,
  dietaryPreferenceOptions,
} from "@/lib/validations/profile";
import { calculateNutritionGoals } from "@/lib/nutrition/calculations";
import { cn } from "@/lib/utils";
import type { ActivityLevel, DietaryPreference, Goal } from "@/types/profile";

interface OnboardingWizardProps {
  userName: string;
}

export function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [state, formAction, isPending] = useActionState(submitOnboardingAction, null);

  // Form State
  const [name, setName] = useState(userName);
  const [gender, setGender] = useState<"male" | "female" | "other">("female");
  const [age, setAge] = useState<number>(25);
  const [heightCm, setHeightCm] = useState<number>(168);
  const [weightKg, setWeightKg] = useState<number>(65);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(60);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("MODERATELY_ACTIVE");
  const [goal, setGoal] = useState<Goal>("WEIGHT_LOSS");
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>("NONE");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);

  // Calculate live targets on the fly for Step 4 summary preview
  const liveTargets = calculateNutritionGoals({
    weightKg: weightKg || 65,
    heightCm: heightCm || 168,
    age: age || 25,
    gender,
    activityLevel,
    goal,
    dietaryPreference,
  });

  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-2">
          <span>Step {step} of 4</span>
          <span>
            {step === 1 && "Physical Metrics"}
            {step === 2 && "Activity & Goals"}
            {step === 3 && "Diet & Health"}
            {step === 4 && "Your Custom Plan"}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Hidden inputs to send complete form data in Server Action */}
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="gender" value={gender} />
        <input type="hidden" name="age" value={age} />
        <input type="hidden" name="heightCm" value={heightCm} />
        <input type="hidden" name="weightKg" value={weightKg} />
        <input type="hidden" name="targetWeightKg" value={targetWeightKg} />
        <input type="hidden" name="activityLevel" value={activityLevel} />
        <input type="hidden" name="goal" value={goal} />
        <input type="hidden" name="dietaryPreference" value={dietaryPreference} />
        <input type="hidden" name="allergies" value={JSON.stringify(allergies)} />
        <input type="hidden" name="healthConditions" value={JSON.stringify(healthConditions)} />

        {/* STEP 1: PHYSICAL METRICS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Let&apos;s start with the basics
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We use these metrics to calculate your BMR and daily calorie needs.
              </p>
            </div>

            {/* Name */}
            <AuthFormField id="onboarding-name" label="Your Name">
              <Input
                id="onboarding-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-11"
              />
            </AuthFormField>

            {/* Gender Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Gender</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "female", label: "Female" },
                  { value: "male", label: "Male" },
                  { value: "other", label: "Other" },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGender(g.value as "female" | "male" | "other")}
                    className={cn(
                      "flex h-11 items-center justify-center rounded-xl border font-semibold text-sm transition-all",
                      gender === g.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:bg-accent"
                    )}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Age, Height, Weight, Target Weight */}
            <div className="grid grid-cols-2 gap-4">
              <AuthFormField id="onboarding-age" label="Age (years)">
                <Input
                  id="onboarding-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="h-11"
                />
              </AuthFormField>

              <AuthFormField id="onboarding-height" label="Height (cm)">
                <Input
                  id="onboarding-height"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="h-11"
                />
              </AuthFormField>

              <AuthFormField id="onboarding-weight" label="Current Weight (kg)">
                <Input
                  id="onboarding-weight"
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="h-11"
                />
              </AuthFormField>

              <AuthFormField id="onboarding-target-weight" label="Target Weight (kg)">
                <Input
                  id="onboarding-target-weight"
                  type="number"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(Number(e.target.value))}
                  className="h-11"
                />
              </AuthFormField>
            </div>
          </div>
        )}

        {/* STEP 2: ACTIVITY & GOALS */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Your Goal & Activity Level
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                This adjusts your TDEE and calculates your target macro ratios.
              </p>
            </div>

            {/* Fitness Goal */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Primary Goal</Label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "WEIGHT_LOSS", title: "Weight Loss", desc: "-500 kcal/day deficit" },
                  { value: "MAINTENANCE", title: "Maintenance", desc: "Maintain current weight" },
                  { value: "MUSCLE_GAIN", title: "Muscle Gain", desc: "High protein, lean surplus" },
                  { value: "WEIGHT_GAIN", title: "Weight Gain", desc: "+500 kcal/day surplus" },
                ].map((g) => (
                  <button
                    key={g.value}
                    type="button"
                    onClick={() => setGoal(g.value as Goal)}
                    className={cn(
                      "flex flex-col items-start p-4 rounded-xl border text-left transition-all",
                      goal === g.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:bg-accent"
                    )}
                  >
                    <span className="font-bold text-sm">{g.title}</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{g.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Activity Level</Label>
              <div className="space-y-2">
                {[
                  { value: "SEDENTARY", title: "Sedentary", desc: "Little to no exercise" },
                  { value: "LIGHTLY_ACTIVE", title: "Lightly Active", desc: "Exercise 1–3 days/week" },
                  { value: "MODERATELY_ACTIVE", title: "Moderately Active", desc: "Exercise 3–5 days/week" },
                  { value: "VERY_ACTIVE", title: "Very Active", desc: "Hard exercise 6–7 days/week" },
                  { value: "EXTRA_ACTIVE", title: "Extra Active", desc: "Physical job or intense training" },
                ].map((act) => (
                  <button
                    key={act.value}
                    type="button"
                    onClick={() => setActivityLevel(act.value as ActivityLevel)}
                    className={cn(
                      "flex items-center justify-between w-full p-3 rounded-xl border text-left transition-all",
                      activityLevel === act.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-card text-foreground hover:bg-accent"
                    )}
                  >
                    <div>
                      <span className="font-semibold text-sm block">{act.title}</span>
                      <span className="text-xs text-muted-foreground">{act.desc}</span>
                    </div>
                    {activityLevel === act.value && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DIET & HEALTH */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Dietary Preferences & Allergies
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our recommendation engine will automatically filter out unsuited recipes.
              </p>
            </div>

            {/* Dietary Preference */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Dietary Preference</Label>
              <div className="flex flex-wrap gap-2">
                {dietaryPreferenceOptions.map((pref) => (
                  <Badge
                    key={pref}
                    variant={dietaryPreference === pref ? "default" : "outline"}
                    className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                    onClick={() => setDietaryPreference(pref as DietaryPreference)}
                  >
                    {pref.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Allergies / Intolerances</Label>
              <div className="flex flex-wrap gap-2">
                {commonAllergies.map((allergy) => {
                  const selected = allergies.includes(allergy);
                  return (
                    <Badge
                      key={allergy}
                      variant={selected ? "destructive" : "outline"}
                      className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                      onClick={() => toggleArrayItem(allergies, allergy, setAllergies)}
                    >
                      {selected && <Check className="mr-1 h-3 w-3" />}
                      {allergy}
                    </Badge>
                  );
                })}
              </div>
            </div>

            {/* Health Conditions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Health Conditions (Optional)</Label>
              <div className="flex flex-wrap gap-2">
                {commonHealthConditions.map((cond) => {
                  const selected = healthConditions.includes(cond);
                  return (
                    <Badge
                      key={cond}
                      variant={selected ? "secondary" : "outline"}
                      className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                      onClick={() => toggleArrayItem(healthConditions, cond, setHealthConditions)}
                    >
                      {selected && <Check className="mr-1 h-3 w-3" />}
                      {cond}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SUMMARY & LIVE CALCULATED TARGETS */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Your Custom Plan is Ready!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Here are your auto-calculated daily targets based on your exact profile.
              </p>
            </div>

            {/* Live Nutrition Goal Card */}
            <NutritionGoalCard
              bmi={liveTargets.bmi}
              bmr={liveTargets.bmr}
              tdee={liveTargets.tdee}
              calories={liveTargets.goalCalories}
              proteinG={liveTargets.proteinG}
              carbsG={liveTargets.carbsG}
              fatG={liveTargets.fatG}
            />

            {state?.error && (
              <p className="text-sm text-destructive text-center font-medium">{state.error}</p>
            )}
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3 | 4)}
              disabled={isPending}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3 | 4)}
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isPending} className="font-bold px-8">
              {isPending ? "Setting up..." : "Complete Setup & Launch Dashboard"}
              <Flame className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
