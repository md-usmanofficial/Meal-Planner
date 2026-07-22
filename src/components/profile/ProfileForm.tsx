"use client";

/**
 * ProfileForm — Full editable profile form.
 *
 * Allows users to update their age, height, weight, target weight, activity,
 * goal, dietary preference, allergies, and health conditions at any time.
 * Triggers automatic recalculation of nutrition goals upon save.
 */

import { useState } from "react";
import { useActionState } from "react";
import { Loader2, Save } from "lucide-react";
import { submitOnboardingAction } from "@/app/onboarding/actions";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  commonAllergies,
  commonHealthConditions,
  dietaryPreferenceOptions,
} from "@/lib/validations/profile";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types/profile";
import type { ActivityLevel, DietaryPreference, Goal } from "@/types/profile";

interface ProfileFormProps {
  initialProfile: UserProfile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(submitOnboardingAction, null);

  const [name, setName] = useState(initialProfile.name || "");
  const [gender, setGender] = useState<string>(initialProfile.gender || "female");
  const [age, setAge] = useState<number>(initialProfile.age || 25);
  const [heightCm, setHeightCm] = useState<number>(initialProfile.heightCm || 170);
  const [weightKg, setWeightKg] = useState<number>(initialProfile.weightKg || 70);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(initialProfile.targetWeightKg || 65);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(initialProfile.activityLevel || "MODERATELY_ACTIVE");
  const [goal, setGoal] = useState<Goal>(initialProfile.goal || "MAINTENANCE");
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>(initialProfile.dietaryPreference || "NONE");
  const [allergies, setAllergies] = useState<string[]>(initialProfile.allergies || []);
  const [healthConditions, setHealthConditions] = useState<string[]>(initialProfile.healthConditions || []);

  const toggleItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  return (
    <form action={formAction} className="space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <AuthFormField id="profile-name" label="Full Name">
          <Input
            id="profile-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
          />
        </AuthFormField>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Gender</Label>
          <div className="grid grid-cols-3 gap-2">
            {["female", "male", "other"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={cn(
                  "h-11 rounded-lg border text-sm font-semibold capitalize transition-all",
                  gender === g ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-accent"
                )}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Age & Height */}
        <AuthFormField id="profile-age" label="Age (years)">
          <Input
            id="profile-age"
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="h-11"
          />
        </AuthFormField>

        <AuthFormField id="profile-height" label="Height (cm)">
          <Input
            id="profile-height"
            type="number"
            value={heightCm}
            onChange={(e) => setHeightCm(Number(e.target.value))}
            className="h-11"
          />
        </AuthFormField>

        {/* Weight & Target Weight */}
        <AuthFormField id="profile-weight" label="Current Weight (kg)">
          <Input
            id="profile-weight"
            type="number"
            value={weightKg}
            onChange={(e) => setWeightKg(Number(e.target.value))}
            className="h-11"
          />
        </AuthFormField>

        <AuthFormField id="profile-target-weight" label="Target Weight (kg)">
          <Input
            id="profile-target-weight"
            type="number"
            value={targetWeightKg}
            onChange={(e) => setTargetWeightKg(Number(e.target.value))}
            className="h-11"
          />
        </AuthFormField>
      </div>

      {/* Goal */}
      <div className="space-y-2">
        <Label>Primary Goal</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: "WEIGHT_LOSS", label: "Weight Loss" },
            { value: "MAINTENANCE", label: "Maintenance" },
            { value: "MUSCLE_GAIN", label: "Muscle Gain" },
            { value: "WEIGHT_GAIN", label: "Weight Gain" },
          ].map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setGoal(item.value as Goal)}
              className={cn(
                "p-3 rounded-xl border text-center text-xs font-bold transition-all",
                goal === item.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card hover:bg-accent"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dietary Preference */}
      <div className="space-y-2">
        <Label>Dietary Preference</Label>
        <div className="flex flex-wrap gap-2">
          {dietaryPreferenceOptions.map((pref) => (
            <Badge
              key={pref}
              variant={dietaryPreference === pref ? "default" : "outline"}
              className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg"
              onClick={() => setDietaryPreference(pref as DietaryPreference)}
            >
              {pref.replace("_", " ")}
            </Badge>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <Label>Allergies & Intolerances</Label>
        <div className="flex flex-wrap gap-2">
          {commonAllergies.map((allergy) => (
            <Badge
              key={allergy}
              variant={allergies.includes(allergy) ? "destructive" : "outline"}
              className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg"
              onClick={() => toggleItem(allergies, allergy, setAllergies)}
            >
              {allergy}
            </Badge>
          ))}
        </div>
      </div>

      {/* Health Conditions */}
      <div className="space-y-2">
        <Label>Health Conditions</Label>
        <div className="flex flex-wrap gap-2">
          {commonHealthConditions.map((cond) => (
            <Badge
              key={cond}
              variant={healthConditions.includes(cond) ? "secondary" : "outline"}
              className="cursor-pointer px-3 py-1.5 text-xs font-semibold rounded-lg"
              onClick={() => toggleItem(healthConditions, cond, setHealthConditions)}
            >
              {cond}
            </Badge>
          ))}
        </div>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={isPending} className="font-bold">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes…
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" /> Save & Recalculate Nutrition Goals
          </>
        )}
      </Button>
    </form>
  );
}
