"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Utensils,
  Flame,
  Droplets,
  Search,
  BookOpen,
  ShieldCheck,
  Download,
  Zap,
  Scale,
  Award,
  Heart,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

const sampleMeals = {
  breakfast: {
    title: "Avocado & Poached Egg Toast",
    cal: 380,
    protein: 20,
    carbs: 30,
    fat: 18,
    time: "10 mins",
    tag: "High Protein",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
  },
  lunch: {
    title: "Salmon & Quinoa Power Bowl",
    cal: 520,
    protein: 38,
    carbs: 42,
    fat: 20,
    time: "15 mins",
    tag: "Heart Healthy",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
  },
  dinner: {
    title: "Roasted Chicken & Vegetables",
    cal: 460,
    protein: 45,
    carbs: 16,
    fat: 18,
    time: "20 mins",
    tag: "Keto Friendly",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80",
  },
  snack: {
    title: "Greek Yogurt Berry Parfait",
    cal: 220,
    protein: 16,
    carbs: 24,
    fat: 5,
    time: "5 mins",
    tag: "Quick & Easy",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",
  },
};

export function LandingPageClient() {
  const [activeTab, setActiveTab] = useState<keyof typeof sampleMeals>("lunch");
  const [calcGoal, setCalcGoal] = useState<"loss" | "maintain" | "gain">("loss");
  const [calcWeight, setCalcWeight] = useState(70);

  const targetCal =
    calcGoal === "loss"
      ? Math.round(calcWeight * 24)
      : calcGoal === "gain"
      ? Math.round(calcWeight * 34)
      : Math.round(calcWeight * 28);
  const targetProtein = Math.round(calcWeight * 1.8);
  const targetCarbs = Math.round((targetCal * 0.45) / 4);
  const targetFat = Math.round((targetCal * 0.25) / 9);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white font-sans">
      {/* -------------------------------------------------------------------
          SOFT FRESH GREENISH GRADIENT HEADER & AMBIENT GLOW
          ------------------------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-emerald-200/40 via-emerald-100/20 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-teal-100/30 blur-[140px] rounded-full" />
      </div>

      {/* -------------------------------------------------------------------
          NAVBAR (Clean White & Soft Green Shadow)
          ------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-emerald-100/80 shadow-xs">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Utensils className="h-5 w-5 font-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                Nutri<span className="text-emerald-600">Plan</span>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#calculator" className="hover:text-emerald-600 transition-colors">Macro Calculator</a>
            <a href="#recipes-preview" className="hover:text-emerald-600 transition-colors">Recipe Preview</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.LOGIN}
              className="text-xs font-bold text-slate-700 hover:text-emerald-600 transition-colors px-2 py-1.5"
            >
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/20 text-xs px-4 py-2 hover:scale-105 active:scale-95 transition-all">
                Get Started Free <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------
          HERO SECTION (Compact Padding, Fresh Greenish White Palette)
          ------------------------------------------------------------------- */}
      <section className="relative z-10 pt-10 pb-12 sm:pt-14 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-bold text-emerald-700 shadow-2xs mb-5"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Smart Nutrition & AI Meal Planner</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="max-w-4xl text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900"
          >
            Eat Smarter. Feel Great. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Tailored Nutritious Meals Every Day.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-4 max-w-2xl text-sm sm:text-base text-slate-600 leading-relaxed font-medium"
          >
            NutriPlan generates personalized calorie plans, macro breakdowns, and recipe recommendations based on your unique goals and diet — 100% free with no hidden paywalls.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-7 py-5 font-extrabold shadow-lg shadow-emerald-600/25 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm">
                Start My Free Meal Plan <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
            <a href="#calculator" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-xl border-emerald-200 bg-white text-slate-800 hover:bg-emerald-50 font-bold px-6 py-5 text-xs sm:text-sm shadow-xs transition-all">
                <Scale className="mr-1.5 h-4 w-4 text-emerald-600" /> Calculate Macro Targets
              </Button>
            </a>
          </motion.div>

          {/* Trust Row */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-5 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Free Forever</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> No Credit Card</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified Nutrition Data</span>
          </div>
        </div>

        {/* HERO APP PREVIEW CARD */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 relative mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-xl shadow-emerald-900/5">
            {/* Window Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> nutriplan.app/dashboard
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                Live Active Plan
              </Badge>
            </div>

            {/* Dashboard Mock Grid */}
            <div className="p-5 sm:p-6 space-y-4">
              {/* Macro Bar Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <span className="text-[11px] text-slate-500 font-semibold block">Calories</span>
                  <span className="text-base font-black text-slate-900">1,840 <span className="text-[10px] text-slate-400 font-normal">/ 2,100 kcal</span></span>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-emerald-200/60 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-[87%] rounded-full" />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/50">
                  <span className="text-[11px] text-slate-500 font-semibold block">Protein</span>
                  <span className="text-base font-black text-emerald-700">128g <span className="text-[10px] text-slate-400 font-normal">/ 140g</span></span>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-emerald-200/60 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-[91%] rounded-full" />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/50">
                  <span className="text-[11px] text-slate-500 font-semibold block">Carbs</span>
                  <span className="text-base font-black text-amber-700">190g <span className="text-[10px] text-slate-400 font-normal">/ 220g</span></span>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-amber-200/60 overflow-hidden">
                    <div className="h-full bg-amber-500 w-[86%] rounded-full" />
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50">
                  <span className="text-[11px] text-slate-500 font-semibold block">Fat</span>
                  <span className="text-base font-black text-indigo-700">55g <span className="text-[10px] text-slate-400 font-normal">/ 65g</span></span>
                  <div className="mt-1.5 h-1.5 w-full rounded-full bg-indigo-200/60 overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[84%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Schedule list */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                  <span>Today's Meal Checklist</span>
                  <span className="text-emerald-700 font-semibold">3 of 4 Ticked</span>
                </div>

                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white font-black text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 line-through opacity-80">Breakfast: Avocado & Eggs Toast</h4>
                      <p className="text-[10px] text-slate-500">380 kcal · 20g Protein</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-100/60 text-emerald-800 border-emerald-300 text-[10px]">
                    08:30 AM
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* -------------------------------------------------------------------
          STATS COUNTER STRIP
          ------------------------------------------------------------------- */}
      <section className="border-y border-emerald-100 bg-white py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">500,000+</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Recipes Database</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">2,000,000+</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Verified Foods</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">100%</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Free & Unlimited</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-emerald-700">0</p>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Ads or Paywalls</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          INTERACTIVE MACRO CALCULATOR DEMO (Compact White/Green Card)
          ------------------------------------------------------------------- */}
      <section id="calculator" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 sm:p-10 shadow-lg shadow-emerald-900/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-2.5 py-0.5 font-bold">
                Interactive Tool
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Live Calorie & <br />
                <span className="text-emerald-700">Macro Calculator</span>
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Test how NutriPlan automatically configures your target nutrition numbers before you sign up.
              </p>
            </div>

            <div className="lg:col-span-7 bg-emerald-50/40 p-5 sm:p-6 rounded-xl border border-emerald-100 space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Your Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcGoal("loss")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      calcGoal === "loss"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50"
                    }`}
                  >
                    Weight Loss
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGoal("maintain")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      calcGoal === "maintain"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50"
                    }`}
                  >
                    Maintain
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGoal("gain")}
                    className={`py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                      calcGoal === "gain"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-emerald-50"
                    }`}
                  >
                    Muscle Gain
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-600">Weight:</span>
                  <span className="text-emerald-700 font-extrabold">{calcWeight} kg ({Math.round(calcWeight * 2.20462)} lbs)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-200/60">
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-amber-600 block">Calories</span>
                  <span className="text-base font-black text-slate-900">{targetCal}</span>
                  <span className="text-[9px] text-slate-500 block">kcal/day</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-emerald-700 block">Protein</span>
                  <span className="text-base font-black text-slate-900">{targetProtein}g</span>
                  <span className="text-[9px] text-slate-500 block">daily</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-amber-600 block">Carbs</span>
                  <span className="text-base font-black text-slate-900">{targetCarbs}g</span>
                  <span className="text-[9px] text-slate-500 block">daily</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-emerald-100 text-center">
                  <span className="text-[10px] font-bold text-indigo-600 block">Fat</span>
                  <span className="text-base font-black text-slate-900">{targetFat}g</span>
                  <span className="text-[9px] text-slate-500 block">daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          BENTO GRID FEATURES
          ------------------------------------------------------------------- */}
      <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-10 space-y-2">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-2.5 py-0.5 font-bold">
            All-In-One Toolkit
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
            Features Designed for Your Health Success
          </h2>
          <p className="text-slate-600 max-w-md mx-auto text-xs sm:text-sm font-medium">
            Everything integrated smoothly into one simple, clean application.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-900/5 hover:border-emerald-300 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 mb-4">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5">Smart Meal Plan Generator</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Generate daily, weekly, or monthly meal plans tailored to your exact calorie target, dietary preferences (Vegetarian, Keto, Halal, Vegan), and allergies.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-900/5 hover:border-emerald-300 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700 mb-4">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1.5">Custom Recipes</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Save your own home recipes with automatically calculated nutrition metrics.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-900/5 hover:border-emerald-300 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 mb-4">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1.5">Live Food Search</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Search USDA and Spoonacular databases with debounced instant lookup.
            </p>
          </div>

          <div className="md:col-span-2 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-900/5 hover:border-emerald-300 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 mb-4">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-1.5">PDF Plan Export</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Export your complete meal plans as clean, printable PDF documents anytime.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          WHAT YOU WILL COOK SECTION (SMALL & SLEEK PER USER REQUEST)
          ------------------------------------------------------------------- */}
      <section id="recipes-preview" className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-6 space-y-1.5">
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 text-xs px-2.5 py-0.5 font-bold">
            Recipe Preview
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            What You Will Cook
          </h2>
          <p className="text-slate-600 text-xs">
            Delicious, balanced dishes created for your daily schedule.
          </p>
        </div>

        {/* Compact Meal Slot Tabs */}
        <div className="flex justify-center gap-1.5 mb-6">
          {(["breakfast", "lunch", "dinner", "snack"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-extrabold capitalize transition-all ${
                activeTab === tab
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Compact Recipe Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-md grid grid-cols-1 sm:grid-cols-12 max-w-3xl mx-auto"
          >
            <div className="sm:col-span-5 h-44 sm:h-full relative overflow-hidden bg-slate-100">
              <img
                src={sampleMeals[activeTab].image}
                alt={sampleMeals[activeTab].title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-3 left-3 bg-white/90 text-emerald-800 backdrop-blur-xs text-[10px] border-none font-bold">
                {sampleMeals[activeTab].tag}
              </Badge>
            </div>

            <div className="sm:col-span-7 p-5 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 leading-snug mb-1">
                  {sampleMeals[activeTab].title}
                </h3>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1 text-amber-600">
                    <Flame className="h-3.5 w-3.5 fill-amber-500" /> {sampleMeals[activeTab].cal} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {sampleMeals[activeTab].time}
                  </span>
                </div>
              </div>

              {/* Macro Row */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                  <span className="text-[9px] text-emerald-700 font-bold block">Protein</span>
                  <span className="text-xs font-black text-slate-900">{sampleMeals[activeTab].protein}g</span>
                </div>
                <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                  <span className="text-[9px] text-amber-700 font-bold block">Carbs</span>
                  <span className="text-xs font-black text-slate-900">{sampleMeals[activeTab].carbs}g</span>
                </div>
                <div className="p-2 rounded-lg bg-indigo-50/60 border border-indigo-100">
                  <span className="text-[9px] text-indigo-700 font-bold block">Fat</span>
                  <span className="text-xs font-black text-slate-900">{sampleMeals[activeTab].fat}g</span>
                </div>
              </div>

              <Link href={ROUTES.REGISTER}>
                <Button className="w-full h-9 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs">
                  Generate Plan With This Recipe <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* -------------------------------------------------------------------
          BOTTOM CTA BANNER
          ------------------------------------------------------------------- */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-10">
        <div className="rounded-2xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-600 p-8 sm:p-12 text-center text-white shadow-xl shadow-emerald-900/10">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Ready to Start Eating Better Today?
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium">
              Create your free account and get your personalized meal plan in less than a minute.
            </p>
            <Link href={ROUTES.REGISTER} className="inline-block pt-2">
              <Button className="rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 px-7 py-5 font-black shadow-md text-xs sm:text-sm transition-all hover:scale-105 active:scale-95">
                Create My Free Account <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          FOOTER
          ------------------------------------------------------------------- */}
      <footer className="border-t border-emerald-100 bg-white py-8 relative z-10 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-xs">
              <Utensils className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-slate-900">NutriPlan</span>
            <span>— Smart Meal Planner</span>
          </div>
          <p>© {new Date().getFullYear()} NutriPlan · Built with Next.js 16 & Supabase</p>
        </div>
      </footer>
    </div>
  );
}
