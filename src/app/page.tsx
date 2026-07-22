/**
 * Landing Page — The first thing unauthenticated users see.
 * Features a hero section, feature cards, and a strong CTA.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "NutriPlan — Smart Meal Planner & Nutrition Tracker",
  description:
    "Plan your meals, track nutrition, monitor your health progress, and discover thousands of recipes. Start your journey to a healthier you.",
};

const features = [
  {
    icon: "🥗",
    title: "Smart Meal Planning",
    description:
      "Generate personalized daily, weekly, or monthly meal plans based on your goals, preferences, and dietary needs.",
  },
  {
    icon: "📊",
    title: "Nutrition Tracking",
    description:
      "Log your meals and automatically calculate calories, protein, carbs, and fat. Stay on track effortlessly.",
  },
  {
    icon: "🔍",
    title: "Recipe Discovery",
    description:
      "Explore thousands of recipes filtered by diet, ingredients, cooking time, and nutritional targets.",
  },
  {
    icon: "📈",
    title: "Progress Analytics",
    description:
      "Track your weight, BMI, water intake, and meal streaks with beautiful charts and insights.",
  },
  {
    icon: "🧠",
    title: "Smart Recommendations",
    description:
      "Our rule-based engine recommends meals based on your profile, allergies, goals, and preferences — no AI black box.",
  },
  {
    icon: "📄",
    title: "PDF Export",
    description:
      "Download or print your meal plans as beautifully formatted PDFs to take with you anywhere.",
  },
];

const stats = [
  { value: "500K+", label: "Recipes Available" },
  { value: "2M+", label: "Foods in Database" },
  { value: "100%", label: "Free to Use" },
  { value: "0", label: "Ads, Ever" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ----------------------------------------------------------------
          NAVIGATION
          ---------------------------------------------------------------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              N
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              NutriPlan
            </span>
          </div>

          {/* Nav Links */}
          <div className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              How it works
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign in
            </Link>
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ----------------------------------------------------------------
          HERO
          ---------------------------------------------------------------- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16">
        {/* Background gradient blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            <span>100% Free — Powered by public APIs</span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Eat smarter.{" "}
            <span className="gradient-text">Feel better.</span>
            <br />
            Every single day.
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            NutriPlan is your all-in-one meal planner, nutrition tracker, and
            recipe discovery app. Personalized to your goals, allergies, and
            lifestyle — no subscriptions, no fluff.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={ROUTES.REGISTER}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
            >
              Start planning for free
              <span aria-hidden>→</span>
            </Link>
            <Link
              href={ROUTES.LOGIN}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3.5 text-base font-semibold text-foreground shadow-sm hover:bg-accent transition-all"
            >
              Sign in to your account
            </Link>
          </div>

          {/* Social proof */}
          <p className="mt-8 text-sm text-muted-foreground">
            No credit card required · No account limits · Open source ready
          </p>
        </div>

        {/* Hero dashboard preview */}
        <div className="relative z-10 mx-auto mt-20 w-full max-w-5xl px-4">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
            {/* Fake browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="ml-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                nutriplan.app/dashboard
              </div>
            </div>
            {/* Dashboard preview content */}
            <div className="grid grid-cols-3 gap-4 p-6">
              {/* Today's plan */}
              <div className="col-span-1 rounded-xl border border-border bg-background p-4">
                <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Today&apos;s Plan
                </p>
                {["Avocado Toast", "Quinoa Salad", "Grilled Turkey"].map((meal, i) => (
                  <div key={i} className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm text-foreground">{meal}</span>
                  </div>
                ))}
              </div>
              {/* Nutrition cards */}
              <div className="col-span-2 grid grid-cols-2 gap-3">
                {[
                  { label: "Calories", value: "1,840", total: "2,200", color: "bg-primary" },
                  { label: "Protein", value: "92g", total: "120g", color: "bg-macro-protein" },
                  { label: "Carbs", value: "210g", total: "250g", color: "bg-macro-carbs" },
                  { label: "Water", value: "1.5L", total: "2L", color: "bg-blue-400" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-border bg-background p-3">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-lg font-bold text-foreground">{item.value}</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                      <div className={`h-full w-3/4 rounded-full ${item.color} progress-fill`} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">of {item.total}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          STATS
          ---------------------------------------------------------------- */}
      <section className="border-y border-border bg-card py-12">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-extrabold gradient-text">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          FEATURES
          ---------------------------------------------------------------- */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Everything you need to eat well
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A complete toolkit — from planning to tracking to discovering.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-hover group rounded-2xl border border-border bg-card p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl group-hover:bg-primary/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          HOW IT WORKS
          ---------------------------------------------------------------- */}
      <section id="how-it-works" className="bg-card py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Up and running in 3 steps
          </h2>
          <p className="mb-16 text-lg text-muted-foreground">
            No complicated setup. No imports. Just sign up and start.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create your profile",
                description:
                  "Tell us your goals, dietary preferences, allergies, and activity level.",
              },
              {
                step: "02",
                title: "Get your plan",
                description:
                  "We generate a personalized meal plan with calorie and macro targets calculated for you.",
              },
              {
                step: "03",
                title: "Track and improve",
                description:
                  "Log your meals, track progress, and refine your plan as you go.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <span className="text-xl font-extrabold text-primary">{item.step}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          CTA BANNER
          ---------------------------------------------------------------- */}
      <section className="gradient-brand py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-4 text-3xl font-extrabold text-white sm:text-4xl">
            Ready to transform your nutrition?
          </h2>
          <p className="mb-8 text-lg text-white/80">
            Join thousands of people who plan, track, and discover with NutriPlan.
          </p>
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary shadow-lg hover:bg-white/90 active:scale-95 transition-all"
          >
            Get started — it&apos;s free
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ----------------------------------------------------------------
          FOOTER
          ---------------------------------------------------------------- */}
      <footer className="border-t border-border bg-background py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
              N
            </div>
            <span className="font-medium text-foreground">NutriPlan</span>
            <span>— Smart Meal Planner</span>
          </div>
          <p>Built with Next.js 15 · Powered by free public APIs</p>
        </div>
      </footer>
    </div>
  );
}
