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
  TrendingUp,
  Search,
  BookOpen,
  PieChart,
  ShieldCheck,
  Download,
  Zap,
  Star,
  ChevronRight,
  Scale,
  Award,
  Layers,
  Heart,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";

// Sample recipes for interactive preview tab
const sampleMeals = {
  breakfast: {
    title: "Avocado & Poached Egg Protein Toast",
    cal: 420,
    protein: 22,
    carbs: 34,
    fat: 20,
    time: "12 mins",
    tag: "High Protein",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
  },
  lunch: {
    title: "Mediterranean Salmon & Quinoa Power Bowl",
    cal: 580,
    protein: 42,
    carbs: 48,
    fat: 24,
    time: "20 mins",
    tag: "Heart Healthy",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  },
  dinner: {
    title: "Herb Roasted Chicken Breast & Asparagus",
    cal: 510,
    protein: 50,
    carbs: 18,
    fat: 22,
    time: "25 mins",
    tag: "Keto Friendly",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
  },
  snack: {
    title: "Greek Yogurt Berry Parfait with Chia",
    cal: 260,
    protein: 18,
    carbs: 28,
    fat: 6,
    time: "5 mins",
    tag: "Quick & Easy",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",
  },
};

export function LandingPageClient() {
  const [activeTab, setActiveTab] = useState<keyof typeof sampleMeals>("lunch");
  const [calcGoal, setCalcGoal] = useState<"loss" | "maintain" | "gain">("loss");
  const [calcWeight, setCalcWeight] = useState(72);

  // Quick calorie calculator
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
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden font-sans">
      {/* -------------------------------------------------------------------
          AMBIENT BACKGROUND GLOW METEORS & MESH
          ------------------------------------------------------------------- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-emerald-500/15 blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[700px] h-[700px] rounded-full bg-teal-500/10 blur-[160px]" />
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* -------------------------------------------------------------------
          NAVIGATION BAR
          ------------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/80">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Utensils className="h-5 w-5 font-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                Nutri<span className="text-emerald-400">Plan</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                Smart Meal Science
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#calculator" className="hover:text-emerald-400 transition-colors">
              Macro Calculator
            </a>
            <a href="#preview" className="hover:text-emerald-400 transition-colors">
              Live Preview
            </a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
              How It Works
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-4">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm font-bold text-slate-300 hover:text-white transition-colors hidden sm:block px-3 py-2"
            >
              Sign In
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-6 py-5 font-extrabold text-slate-950 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all text-xs sm:text-sm">
                Get Started Free <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* -------------------------------------------------------------------
          HERO SECTION
          ------------------------------------------------------------------- */}
      <section className="relative z-10 pt-16 pb-20 lg:pt-24 lg:pb-32 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* AI & Rule Engine Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold text-emerald-400 shadow-inner backdrop-blur-md mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Next-Gen Smart Meal Planner & Macro Engine</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white"
          >
            Fuel Your Body. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Master Your Nutrition.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-slate-400 leading-relaxed font-medium"
          >
            Customized AI meal plans, automated macro tracking, 500,000+ recipe database, and dynamic analytics — engineered to get you real results without the guesswork.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link href={ROUTES.REGISTER} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 px-8 py-6 text-base font-extrabold text-slate-950 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all">
                Create My Free Meal Plan <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <a href="#calculator" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto rounded-2xl border-slate-700 bg-slate-900/80 px-8 py-6 text-base font-bold text-slate-200 hover:bg-slate-800 hover:text-white transition-all">
                <Scale className="mr-2 h-5 w-5 text-emerald-400" /> Calculate Macro Targets
              </Button>
            </a>
          </motion.div>

          {/* Feature Highlights Trust Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 font-semibold"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Free Forever
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> No Credit Card Needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Personalized Macro Math
            </span>
          </motion.div>
        </div>

        {/* -------------------------------------------------------------------
            HERO DASHBOARD SHOWCASE (Interactive Mockup)
            ------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 relative mx-auto max-w-5xl"
        >
          {/* Floating Micro Badge 1 */}
          <div className="absolute -top-6 -left-4 sm:-left-8 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl animate-bounce duration-[4000ms]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-white">Daily Target</p>
              <p className="text-[11px] text-emerald-400 font-bold">94% Calorie Match</p>
            </div>
          </div>

          {/* Floating Micro Badge 2 */}
          <div className="absolute -bottom-6 -right-4 sm:-right-8 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <Droplets className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-black text-white">Water Intake</p>
              <p className="text-[11px] text-blue-400 font-bold">2.0 / 2.5 Liters Logged</p>
            </div>
          </div>

          {/* Window Container */}
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
            {/* macOS Browser Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-4 text-xs font-semibold text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> nutriplan.app/dashboard
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Live Active Plan
              </Badge>
            </div>

            {/* Dashboard Mock Content */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Target Macro Stat Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
                  <span className="text-xs text-slate-400 font-bold block mb-1">Calories</span>
                  <span className="text-xl font-black text-white">1,840 <span className="text-xs text-slate-400 font-normal">/ 2,100 kcal</span></span>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[87%] rounded-full" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
                  <span className="text-xs text-slate-400 font-bold block mb-1">Protein</span>
                  <span className="text-xl font-black text-emerald-400">128g <span className="text-xs text-slate-400 font-normal">/ 140g</span></span>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 w-[91%] rounded-full" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
                  <span className="text-xs text-slate-400 font-bold block mb-1">Carbs</span>
                  <span className="text-xl font-black text-amber-400">190g <span className="text-xs text-slate-400 font-normal">/ 220g</span></span>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 w-[86%] rounded-full" />
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
                  <span className="text-xs text-slate-400 font-bold block mb-1">Fat</span>
                  <span className="text-xl font-black text-indigo-400">55g <span className="text-xs text-slate-400 font-normal">/ 65g</span></span>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-400 w-[84%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Schedule Meal Rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-extrabold text-slate-400 uppercase tracking-wider px-1">
                  <span>Today's Meal Schedule</span>
                  <span className="text-emerald-400 font-semibold">3 of 4 Completed</span>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-slate-950 font-black text-xs">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white line-through opacity-80">Breakfast: Avocado & Eggs Toast</h4>
                      <p className="text-xs text-slate-400">420 kcal · 22g Protein</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs">
                    08:30 AM
                  </Badge>
                </div>

                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Lunch: Mediterranean Salmon Bowl</h4>
                      <p className="text-xs text-slate-400">580 kcal · 42g Protein</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
                    01:15 PM
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
      <section className="border-y border-slate-800/80 bg-slate-900/50 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                500,000+
              </p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Recipes Database</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                2,000,000+
              </p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Verified Foods</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                100%
              </p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Free & Unlimited</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                0
              </p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Ads or Paywalls</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          INTERACTIVE MACRO CALCULATOR DEMO WIDGET
          ------------------------------------------------------------------- */}
      <section id="calculator" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Header */}
            <div className="lg:col-span-5 space-y-4">
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs px-3 py-1">
                Interactive Demo
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Try the Live <br />
                <span className="text-emerald-400">Macro Calculator</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                NutriPlan automatically calculates your exact daily Calorie, Protein, Carb, and Fat targets based on your weight and fitness objective.
              </p>

              <div className="pt-2 space-y-3 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Personalized Harris-Benedict BMR equation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Custom macro split per dietary preference</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Automatic meal portion scaling</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Controls */}
            <div className="lg:col-span-7 bg-slate-950/80 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              {/* Goal Tabs */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Select Your Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalcGoal("loss")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                      calcGoal === "loss"
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    Weight Loss
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGoal("maintain")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                      calcGoal === "maintain"
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    Maintain
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcGoal("gain")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all ${
                      calcGoal === "gain"
                        ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    Muscle Gain
                  </button>
                </div>
              </div>

              {/* Weight Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Current Weight:</span>
                  <span className="text-emerald-400 font-extrabold text-sm">{calcWeight} kg ({Math.round(calcWeight * 2.20462)} lbs)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="140"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Calculated Outputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-amber-400 block mb-0.5">Calories</span>
                  <span className="text-lg font-black text-white">{targetCal}</span>
                  <span className="text-[9px] text-slate-400 block">kcal / day</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-emerald-400 block mb-0.5">Protein</span>
                  <span className="text-lg font-black text-white">{targetProtein}g</span>
                  <span className="text-[9px] text-slate-400 block">daily</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-blue-400 block mb-0.5">Carbs</span>
                  <span className="text-lg font-black text-white">{targetCarbs}g</span>
                  <span className="text-[9px] text-slate-400 block">daily</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <span className="text-[10px] font-bold text-indigo-400 block mb-0.5">Fat</span>
                  <span className="text-lg font-black text-white">{targetFat}g</span>
                  <span className="text-[9px] text-slate-400 block">daily</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          BENTO GRID FEATURES SHOWCASE
          ------------------------------------------------------------------- */}
      <section id="features" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs px-3 py-1">
            Core Toolkit
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Built for Real Results. <br />
            <span className="text-emerald-400">Zero Complications.</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
            Everything you need to plan, track, cook, and scale your nutrition journey in one unified platform.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento 1: Smart AI Plan Generator */}
          <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">Automated AI Meal Plan Generator</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Instant daily, weekly, or monthly plan creation aligned with your calories, macronutrients, food preferences (Vegetarian, Vegan, Keto, Halal), and ingredient allergies.
            </p>
          </div>

          {/* Bento 2: Custom Recipes */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">Custom Recipe Creator</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Create and save your own homemade recipes with auto-calculated macros and custom step-by-step instructions.
            </p>
          </div>

          {/* Bento 3: Live Food Search */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">USDA & Spoonacular API</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Search millions of branded foods and global recipes with live debounced search and verified nutritional data.
            </p>
          </div>

          {/* Bento 4: PDF Export */}
          <div className="md:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/60 p-8 hover:border-slate-700 transition-all group relative overflow-hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">One-Click PDF Export</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Download your complete weekly meal plan as a beautifully formatted PDF report to print out or store on your mobile devices.
            </p>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          LIVE SAMPLE RECIPES INTERACTIVE PREVIEW
          ------------------------------------------------------------------- */}
      <section id="preview" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-3">
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs px-3 py-1">
            Recipe Showcase
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Explore What You'll Cook
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm">
            Delicious, macro-friendly dishes created for every goal and meal slot.
          </p>
        </div>

        {/* Meal Slot Tabs */}
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {(["breakfast", "lunch", "dinner", "snack"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold capitalize transition-all ${
                activeTab === tab
                  ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Recipe Display Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl grid grid-cols-1 md:grid-cols-2"
          >
            <div className="h-64 md:h-auto relative overflow-hidden bg-slate-950">
              <img
                src={sampleMeals[activeTab].image}
                alt={sampleMeals[activeTab].title}
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-slate-950/80 text-emerald-400 backdrop-blur-md text-xs border-none font-extrabold">
                {sampleMeals[activeTab].tag}
              </Badge>
            </div>

            <div className="p-8 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black text-white leading-tight mb-2">
                  {sampleMeals[activeTab].title}
                </h3>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1 text-amber-400">
                    <Flame className="h-4 w-4" /> {sampleMeals[activeTab].cal} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> {sampleMeals[activeTab].time}
                  </span>
                </div>
              </div>

              {/* Macro Pills */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-bold block">Protein</span>
                  <span className="text-base font-black text-white">{sampleMeals[activeTab].protein}g</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-bold block">Carbs</span>
                  <span className="text-base font-black text-white">{sampleMeals[activeTab].carbs}g</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-indigo-400 font-bold block">Fat</span>
                  <span className="text-base font-black text-white">{sampleMeals[activeTab].fat}g</span>
                </div>
              </div>

              <Link href={ROUTES.REGISTER}>
                <Button className="w-full rounded-2xl bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 transition-all text-xs">
                  Generate Plan With This Recipe <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* -------------------------------------------------------------------
          HIGH-CONVERTING BOTTOM CTA BANNER
          ------------------------------------------------------------------- */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-10 sm:p-16 text-center shadow-2xl shadow-emerald-500/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Ready to Take Control of Your Meals?
            </h2>
            <p className="text-slate-950/80 text-sm sm:text-base font-semibold">
              Join thousands of individuals who plan meals, track calories, and build custom recipes effortlessly with NutriPlan.
            </p>
            <Link href={ROUTES.REGISTER}>
              <Button className="rounded-2xl bg-slate-950 px-8 py-6 text-base font-black text-white shadow-2xl hover:scale-105 active:scale-95 transition-all mt-4">
                Start Planning Free Now <ArrowRight className="ml-2 h-5 w-5 text-emerald-400" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------------
          FOOTER
          ------------------------------------------------------------------- */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12 relative z-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-black">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-white text-sm">NutriPlan</span>
            <span>— Smart Meal Planner & Nutrition Tracker</span>
          </div>

          <p className="text-center sm:text-right">
            Built with Next.js 16 App Router & Supabase · Powered by Public Nutrition APIs
          </p>
        </div>
      </footer>
    </div>
  );
}
