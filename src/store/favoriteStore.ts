/**
 * Favorite Store — Manages user saved/favorite recipes and foods.
 * Uses Zustand persist middleware to maintain favorite state across page reloads.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Recipe } from "@/types/recipe";

interface FavoriteState {
  favorites: Recipe[];
  addFavorite: (recipe: Recipe) => void;
  removeFavorite: (recipeId: string) => void;
  toggleFavorite: (recipe: Recipe) => boolean; // returns isFavorite state after toggle
  isFavorite: (recipeId: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (recipe) => {
        const current = get().favorites;
        if (!current.some((r) => r.id === recipe.id)) {
          set({ favorites: [...current, recipe] });
        }
      },
      removeFavorite: (recipeId) => {
        set({ favorites: get().favorites.filter((r) => r.id !== recipeId) });
      },
      toggleFavorite: (recipe) => {
        const current = get().favorites;
        const exists = current.some((r) => r.id === recipe.id);
        if (exists) {
          set({ favorites: current.filter((r) => r.id !== recipe.id) });
          return false;
        } else {
          set({ favorites: [...current, recipe] });
          return true;
        }
      },
      isFavorite: (recipeId) => {
        return get().favorites.some((r) => r.id === recipeId);
      },
    }),
    {
      name: "nutriplan-favorite-recipes",
    }
  )
);
