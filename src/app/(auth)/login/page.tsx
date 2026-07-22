"use client";

/**
 * Login Page — Clean White & Soft Green Palette with Responsive Design.
 */

import { Suspense, useActionState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Mail, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { signInAction } from "@/app/(auth)/actions";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants/routes";
import type { AuthActionState } from "@/lib/validations/auth";

const initialState: AuthActionState = null;

function LoginFormContent() {
  const [state, formAction, isPending] = useActionState(signInAction, initialState);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    if (message) toast.info(message);
  }, [message]);

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome Back 👋
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Sign in to access your custom meal plans and nutrition logs
        </p>
      </div>

      {/* Info Banner */}
      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-4" noValidate>
        {/* Email */}
        <AuthFormField
          id="login-email"
          label="Email address"
          error={state?.fieldErrors?.email}
          required
        >
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isPending}
              aria-describedby={state?.fieldErrors?.email ? "login-email-error" : undefined}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        {/* Password */}
        <AuthFormField
          id="login-password"
          label="Password"
          error={state?.fieldErrors?.password}
          required
        >
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <PasswordInput
              id="login-password"
              name="password"
              autoComplete="current-password"
              placeholder="••••••••"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        {/* Forgot password */}
        <div className="flex justify-end pt-0.5">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
            tabIndex={isPending ? -1 : 0}
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          id="login-submit"
          disabled={isPending}
          className="h-10 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/20 transition-all text-xs sm:text-sm mt-1"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            <>
              Sign In to Account <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <Separator className="bg-slate-100 my-3" />

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-600 font-medium">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-extrabold text-emerald-700 hover:underline"
        >
          Create one free
        </Link>
      </p>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-xs text-slate-500">Loading sign-in...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
