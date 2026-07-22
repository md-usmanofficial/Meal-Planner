/**
 * Nutrition Engine — Pure calculation functions.
 *
 * All functions are pure (no side effects) and fully typed.
 * Formulas used:
 * - BMI: weight(kg) / height(m)²
 * - BMR: Mifflin-St Jeor equation (most accurate for general use)
 * - TDEE: BMR × activity multiplier
 */

import {
  ACTIVITY_MULTIPLIERS,
  BMI_RANGES,
  FAT_TARGETS,
  GOAL_CALORIE_ADJUSTMENT,
  KCAL_PER_GRAM,
  PROTEIN_TARGETS,
} from "@/constants/nutrition";
import type { ActivityLevel, DietaryPreference, Goal } from "@/types/profile";
import type { NutritionCalculationResult } from "@/types/nutrition";

// ---------------------------------------------------------------------------
// BMI
// ---------------------------------------------------------------------------

/**
 * Calculate Body Mass Index.
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimetres
 * @returns BMI rounded to 1 decimal place
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category label and color.
 */
export function getBMICategory(bmi: number): {
  label: string;
  color: string;
} {
  if (bmi < BMI_RANGES.UNDERWEIGHT.max) return BMI_RANGES.UNDERWEIGHT;
  if (bmi < BMI_RANGES.NORMAL.max) return BMI_RANGES.NORMAL;
  if (bmi < BMI_RANGES.OVERWEIGHT.max) return BMI_RANGES.OVERWEIGHT;
  return BMI_RANGES.OBESE;
}

// ---------------------------------------------------------------------------
// BMR — Mifflin-St Jeor Equation
// ---------------------------------------------------------------------------

/**
 * Calculate Basal Metabolic Rate using the Mifflin-St Jeor equation.
 * @param weightKg - Weight in kilograms
 * @param heightCm - Height in centimetres
 * @param age - Age in years
 * @param gender - "male" or "female"
 * @returns BMR in kcal/day, rounded to nearest integer
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = gender.toLowerCase() === "male" ? base + 5 : base - 161;
  return Math.round(bmr);
}

// ---------------------------------------------------------------------------
// TDEE
// ---------------------------------------------------------------------------

/**
 * Calculate Total Daily Energy Expenditure.
 * @param bmr - Basal Metabolic Rate
 * @param activityLevel - User's activity level
 * @returns TDEE in kcal/day, rounded to nearest integer
 */
export function calculateTDEE(
  bmr: number,
  activityLevel: ActivityLevel
): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

// ---------------------------------------------------------------------------
// Daily Calorie Target
// ---------------------------------------------------------------------------

/**
 * Calculate daily calorie goal based on TDEE and user goal.
 * @param tdee - Total Daily Energy Expenditure
 * @param goal - User's fitness goal
 * @returns Daily calorie target
 */
export function calculateGoalCalories(tdee: number, goal: Goal): number {
  return Math.max(1200, tdee + GOAL_CALORIE_ADJUSTMENT[goal]); // Minimum 1200 kcal safety floor
}

// ---------------------------------------------------------------------------
// Macro Targets
// ---------------------------------------------------------------------------

/**
 * Calculate daily protein target in grams.
 * @param weightKg - Weight in kilograms
 * @param goal - User's fitness goal
 */
export function calculateProteinTarget(weightKg: number, goal: Goal): number {
  return Math.round(weightKg * PROTEIN_TARGETS[goal]);
}

/**
 * Calculate daily fat target in grams.
 * @param weightKg - Weight in kilograms
 * @param goal - User's fitness goal
 * @param dietaryPreference - User's dietary preference
 */
export function calculateFatTarget(
  weightKg: number,
  goal: Goal,
  dietaryPreference: DietaryPreference
): number {
  const multiplier =
    dietaryPreference === "KETO" ? FAT_TARGETS.KETO : FAT_TARGETS[goal];
  return Math.round(weightKg * multiplier);
}

/**
 * Calculate daily carbohydrate target in grams.
 * Carbs fill the remaining calorie budget after protein and fat.
 * @param goalCalories - Daily calorie target
 * @param proteinG - Daily protein target in grams
 * @param fatG - Daily fat target in grams
 * @param dietaryPreference - User's dietary preference
 */
export function calculateCarbTarget(
  goalCalories: number,
  proteinG: number,
  fatG: number,
  dietaryPreference: DietaryPreference
): number {
  // Keto: very low carbs (<20g)
  if (dietaryPreference === "KETO") return 20;

  const proteinCalories = proteinG * KCAL_PER_GRAM.PROTEIN;
  const fatCalories = fatG * KCAL_PER_GRAM.FAT;
  const remainingCalories = goalCalories - proteinCalories - fatCalories;
  return Math.max(0, Math.round(remainingCalories / KCAL_PER_GRAM.CARBS));
}

// ---------------------------------------------------------------------------
// Master Calculation Function
// ---------------------------------------------------------------------------

/**
 * Run all nutrition calculations from a user profile.
 * Returns the complete nutrition goal set.
 */
export function calculateNutritionGoals(params: {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: string;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietaryPreference: DietaryPreference;
}): NutritionCalculationResult {
  const { weightKg, heightCm, age, gender, activityLevel, goal, dietaryPreference } = params;

  const bmi = calculateBMI(weightKg, heightCm);
  const { label: bmiCategory } = getBMICategory(bmi);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const goalCalories = calculateGoalCalories(tdee, goal);
  const proteinG = calculateProteinTarget(weightKg, goal);
  const fatG = calculateFatTarget(weightKg, goal, dietaryPreference);
  const carbsG = calculateCarbTarget(goalCalories, proteinG, fatG, dietaryPreference);

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    goalCalories,
    proteinG,
    carbsG,
    fatG,
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Scale nutrition values by a quantity multiplier.
 * Used when a user logs a food with a custom quantity.
 */
export function scaleNutrition(
  baseNutrition: {
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    fiberG?: number | null;
  },
  quantity: number,
  baseQuantity = 100
): typeof baseNutrition {
  const factor = quantity / baseQuantity;
  return {
    calories: Math.round(baseNutrition.calories * factor * 10) / 10,
    proteinG: Math.round(baseNutrition.proteinG * factor * 10) / 10,
    carbsG: Math.round(baseNutrition.carbsG * factor * 10) / 10,
    fatG: Math.round(baseNutrition.fatG * factor * 10) / 10,
    fiberG: baseNutrition.fiberG != null
      ? Math.round(baseNutrition.fiberG * factor * 10) / 10
      : null,
  };
}
