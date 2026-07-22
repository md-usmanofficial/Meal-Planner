"use client";

/**
 * Register Page — Clean White & Soft Green Theme with Password Strength Indicator.
 */

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, User, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { signUpAction } from "@/app/(auth)/actions";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { AuthActionState } from "@/lib/validations/auth";

const initialState: AuthActionState = null;

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character", test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
];

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpAction, initialState);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  const passedRules = PASSWORD_RULES.filter((r) => r.test(password));
  const strength = passedRules.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
          <Sparkles className="h-3 w-3 text-emerald-600" /> Free Account Setup
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Create Your Account ✨
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Start your personalized meal journey in seconds
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-3.5" noValidate>
        {/* Full Name */}
        <AuthFormField
          id="register-name"
          label="Full name"
          error={state?.fieldErrors?.name}
          required
        >
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Jessica Smith"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        {/* Email */}
        <AuthFormField
          id="register-email"
          label="Email address"
          error={state?.fieldErrors?.email}
          required
        >
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        {/* Password */}
        <AuthFormField
          id="register-password"
          label="Password"
          error={state?.fieldErrors?.password}
          required
        >
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <PasswordInput
              id="register-password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </AuthFormField>

        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-all duration-300",
                    i <= strength
                      ? strength <= 1
                        ? "bg-rose-500"
                        : strength <= 2
                          ? "bg-amber-500"
                          : strength <= 3
                            ? "bg-yellow-400"
                            : "bg-emerald-600"
                      : "bg-slate-200"
                  )}
                />
              ))}
            </div>
            <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={cn(
                      "flex items-center gap-1.5 text-[11px] font-medium",
                      passed ? "text-emerald-700 font-bold" : "text-slate-500"
                    )}
                  >
                    {passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                    )}
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Confirm Password */}
        <AuthFormField
          id="register-confirm-password"
          label="Confirm password"
          error={state?.fieldErrors?.confirmPassword}
          required
        >
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <PasswordInput
              id="register-confirm-password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat your password"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        {/* Terms note */}
        <p className="text-[11px] text-slate-500 font-medium">
          By signing up, you agree to our{" "}
          <span className="text-emerald-700 font-bold hover:underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="text-emerald-700 font-bold hover:underline cursor-pointer">Privacy Policy</span>.
        </p>

        {/* Submit */}
        <Button
          type="submit"
          id="register-submit"
          disabled={isPending}
          className="h-10 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/20 transition-all text-xs sm:text-sm mt-1"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Creating account…
            </>
          ) : (
            <>
              Create Free Account <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <Separator className="bg-slate-100 my-3" />

      {/* Switch to Login */}
      <p className="text-center text-xs text-slate-600 font-medium">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-extrabold text-emerald-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
