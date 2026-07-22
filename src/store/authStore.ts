/**
 * Auth Store — manages the Supabase session on the client side.
 * Hydrated once on app load; updated on sign-in/sign-out events.
 */

import { create } from "zustand";
import { type User, type Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session, user: session?.user ?? null }),
  setLoading: (isLoading) => set({ isLoading }),

  signOut: () => set({ user: null, session: null }),
}));
