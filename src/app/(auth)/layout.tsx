/**
 * Auth Layout — Clean White & Soft Emerald Theme.
 * Fully responsive layout for Login, Register, Forgot & Reset Password pages.
 */

import Link from "next/link";
import { Utensils, Sparkles, ShieldCheck, Heart, Award } from "lucide-react";
import { ROUTES } from "@/constants/routes";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-hidden">
      {/* Background soft emerald glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] bg-gradient-to-b from-emerald-200/30 via-teal-100/20 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* ----------------------------------------------------------------
          LEFT BRAND HERO PANEL (Large Screens)
          ---------------------------------------------------------------- */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12 lg:p-16 border-r border-emerald-100 bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-slate-50">
        {/* Top Logo */}
        <Link href={ROUTES.HOME} className="flex items-center gap-2.5 group w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-300">
            <Utensils className="h-5 w-5 font-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              Nutri<span className="text-emerald-600">Plan</span>
            </span>
          </div>
        </Link>

        {/* Center Content */}
        <div className="max-w-md my-auto py-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3.5 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            <span>Smart Nutrition Science</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
            Transform How You <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
              Eat & Reach Goals.
            </span>
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed font-medium">
            Join thousands of health enthusiasts who use NutriPlan for automated macro calculations, personalized weekly meal plans, and live recipe discovery.
          </p>

          {/* Feature Checkpoints */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { text: "Smart AI Meal Plans", icon: Sparkles },
              { text: "Automatic Macro Math", icon: Award },
              { text: "500,000+ Recipes", icon: Utensils },
              { text: "Water & Goal Analytics", icon: Heart },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-100 bg-white shadow-2xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <item.icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-extrabold text-slate-800">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Security Note */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>SSL Encrypted · Supabase Secure Authentication</span>
        </div>
      </div>

      {/* ----------------------------------------------------------------
          RIGHT FORM CONTAINER (Clean White Card)
          ---------------------------------------------------------------- */}
      <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Header Logo */}
          <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
            <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                <Utensils className="h-5 w-5 font-black" />
              </div>
              <span className="text-xl font-black text-slate-900">
                Nutri<span className="text-emerald-600">Plan</span>
              </span>
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 sm:p-8 shadow-xl shadow-emerald-900/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
