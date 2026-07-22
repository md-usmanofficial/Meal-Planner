/**
 * Shared TypeScript types for user profile and related entities.
 */

export type ActivityLevel =
  | "SEDENTARY"
  | "LIGHTLY_ACTIVE"
  | "MODERATELY_ACTIVE"
  | "VERY_ACTIVE"
  | "EXTRA_ACTIVE";

export type Goal =
  | "WEIGHT_LOSS"
  | "WEIGHT_GAIN"
  | "MAINTENANCE"
  | "MUSCLE_GAIN";

export type DietaryPreference =
  | "NONE"
  | "VEGETARIAN"
  | "VEGAN"
  | "HALAL"
  | "KETO"
  | "GLUTEN_FREE"
  | "PALEO";

export type Units = "METRIC" | "IMPERIAL";

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  gender: string | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  targetWeightKg: number | null;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  healthConditions: string[];
  avatarUrl: string | null;
  isOnboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NutritionGoal {
  id: string;
  userId: string;
  bmi: number | null;
  bmr: number | null;
  tdee: number | null;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  darkMode: boolean;
  units: Units;
  emailNotifs: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  waterGoalMl: number;
  updatedAt: Date;
}

// Form data types (for React Hook Form)
export interface ProfileFormData {
  name: string;
  gender: string;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  activityLevel: ActivityLevel;
  goal: Goal;
  dietaryPreference: DietaryPreference;
  allergies: string[];
  healthConditions: string[];
}

export interface SettingsFormData {
  darkMode: boolean;
  units: Units;
  emailNotifs: boolean;
  mealReminders: boolean;
  waterReminders: boolean;
  waterGoalMl: number;
}
