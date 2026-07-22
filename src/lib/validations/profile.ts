/**
 * Zod validation schemas for User Profile and Onboarding.
 */

import { z } from "zod";

export const genderOptions = ["male", "female", "other"] as const;
export const activityLevelOptions = [
  "SEDENTARY",
  "LIGHTLY_ACTIVE",
  "MODERATELY_ACTIVE",
  "VERY_ACTIVE",
  "EXTRA_ACTIVE",
] as const;

export const goalOptions = [
  "WEIGHT_LOSS",
  "WEIGHT_GAIN",
  "MAINTENANCE",
  "MUSCLE_GAIN",
] as const;

export const dietaryPreferenceOptions = [
  "NONE",
  "VEGETARIAN",
  "VEGAN",
  "HALAL",
  "KETO",
  "GLUTEN_FREE",
  "PALEO",
] as const;

export const commonAllergies = [
  "Peanuts",
  "Tree Nuts",
  "Dairy",
  "Egg",
  "Gluten",
  "Wheat",
  "Soy",
  "Fish",
  "Shellfish",
  "Sesame",
];

export const commonHealthConditions = [
  "Diabetes Type 2",
  "Hypertension",
  "High Cholesterol",
  "Celiac Disease",
  "Lactose Intolerance",
  "IBS",
];

// Step 1: Physical Metrics
export const physicalMetricsSchema = z.object({
  gender: z.enum(genderOptions, { required_error: "Please select your gender" }),
  age: z
    .number({ invalid_type_error: "Please enter a valid age" })
    .min(10, "Age must be at least 10")
    .max(120, "Age must be 120 or less"),
  heightCm: z
    .number({ invalid_type_error: "Please enter a valid height in cm" })
    .min(50, "Height must be at least 50 cm")
    .max(250, "Height must be 250 cm or less"),
  weightKg: z
    .number({ invalid_type_error: "Please enter a valid weight in kg" })
    .min(20, "Weight must be at least 20 kg")
    .max(300, "Weight must be 300 kg or less"),
  targetWeightKg: z
    .number({ invalid_type_error: "Please enter a valid target weight in kg" })
    .min(20, "Target weight must be at least 20 kg")
    .max(300, "Target weight must be 300 kg or less"),
});

// Step 2: Goals & Activity
export const goalsActivitySchema = z.object({
  activityLevel: z.enum(activityLevelOptions, {
    required_error: "Please select your activity level",
  }),
  goal: z.enum(goalOptions, {
    required_error: "Please select your primary fitness goal",
  }),
});

// Step 3: Diet & Health
export const dietHealthSchema = z.object({
  dietaryPreference: z.enum(dietaryPreferenceOptions, {
    required_error: "Please select a dietary preference",
  }),
  allergies: z.array(z.string()).default([]),
  healthConditions: z.array(z.string()).default([]),
});

// Full Onboarding Schema (combines all steps)
export const onboardingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  ...physicalMetricsSchema.shape,
  ...goalsActivitySchema.shape,
  ...dietHealthSchema.shape,
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
export type PhysicalMetricsFormValues = z.infer<typeof physicalMetricsSchema>;
export type GoalsActivityFormValues = z.infer<typeof goalsActivitySchema>;
export type DietHealthFormValues = z.infer<typeof dietHealthSchema>;
