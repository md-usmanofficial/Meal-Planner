/**
 * Profile Store — caches the user's profile and nutrition goals client-side.
 * Avoids redundant fetches across components.
 */

import { create } from "zustand";
import type { UserProfile, NutritionGoal, UserSettings } from "@/types/profile";

interface ProfileState {
  profile: UserProfile | null;
  nutritionGoal: NutritionGoal | null;
  settings: UserSettings | null;
  isLoaded: boolean;
  setProfile: (profile: UserProfile | null) => void;
  setNutritionGoal: (goal: NutritionGoal | null) => void;
  setSettings: (settings: UserSettings | null) => void;
  setLoaded: (loaded: boolean) => void;
  reset: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  nutritionGoal: null,
  settings: null,
  isLoaded: false,

  setProfile: (profile) => set({ profile }),
  setNutritionGoal: (nutritionGoal) => set({ nutritionGoal }),
  setSettings: (settings) => set({ settings }),
  setLoaded: (isLoaded) => set({ isLoaded }),

  reset: () =>
    set({ profile: null, nutritionGoal: null, settings: null, isLoaded: false }),
}));
