"use client";

/**
 * useProfile — Custom hook to sync profile & calculated nutrition targets
 * into client-side Zustand store (`useProfileStore`).
 */

import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import type { UserProfile, NutritionGoal, UserSettings } from "@/types/profile";

export function useProfile() {
  const {
    profile,
    nutritionGoal,
    settings,
    isLoaded,
    setProfile,
    setNutritionGoal,
    setSettings,
    setLoaded,
  } = useProfileStore();

  const [isLoading, setIsLoading] = useState(!isLoaded);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) return;

    async function fetchProfile() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setProfile(json.data.profile as UserProfile);
            setNutritionGoal(json.data.nutritionGoal as NutritionGoal);
            setSettings(json.data.settings as UserSettings);
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Could not load user profile.");
      } finally {
        setIsLoading(false);
        setLoaded(true);
      }
    }

    fetchProfile();
  }, [isLoaded, setProfile, setNutritionGoal, setSettings, setLoaded]);

  return {
    profile,
    nutritionGoal,
    settings,
    isLoading,
    error,
    isLoaded,
  };
}
