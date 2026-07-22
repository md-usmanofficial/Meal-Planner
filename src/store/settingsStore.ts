/**
 * Settings Store — manages UI settings like dark mode and unit preferences.
 * Automatically syncs the `dark` class on the <html> element.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
  darkMode: boolean;
  units: "METRIC" | "IMPERIAL";
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setUnits: (units: "METRIC" | "IMPERIAL") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      units: "METRIC",
      toggleDarkMode: () => {
        const nextMode = !get().darkMode;
        if (typeof window !== "undefined") {
          if (nextMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        set({ darkMode: nextMode });
      },
      setDarkMode: (darkMode) => {
        if (typeof window !== "undefined") {
          if (darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
        set({ darkMode });
      },
      setUnits: (units) => set({ units }),
    }),
    {
      name: "nutriplan-settings",
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          if (state.darkMode) {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
        }
      },
    }
  )
);
