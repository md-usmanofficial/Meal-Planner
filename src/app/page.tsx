/**
 * Landing Page — The modern entry point for NutriPlan.
 * Renders the ultra-modern, high-converting LandingPageClient component.
 */

import type { Metadata } from "next";
import { LandingPageClient } from "@/components/landing/LandingPageClient";

export const metadata: Metadata = {
  title: "NutriPlan — Smart AI Meal Planner & Nutrition Tracker",
  description:
    "Plan your meals, track calories and macros, monitor your health progress, and discover thousands of recipes. Start your journey to a healthier you.",
};

export default function LandingPage() {
  return <LandingPageClient />;
}
