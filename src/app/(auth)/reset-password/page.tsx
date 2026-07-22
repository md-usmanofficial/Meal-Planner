"use client";

/**
 * Reset Password Page — Clean White & Soft Green Theme.
 */

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { resetPasswordAction } from "@/app/(auth)/actions";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { AuthActionState } from "@/lib/validations/auth";

const initialState: AuthActionState = null;

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState
  );

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
          Set New Password 🔐
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Enter your new password below to secure your NutriPlan account
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-4" noValidate>
        {/* New password */}
        <AuthFormField
          id="reset-password"
          label="New password"
          error={state?.fieldErrors?.password}
          required
        >
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <PasswordInput
              id="reset-password"
              name="password"
              autoComplete="new-password"
              placeholder="Create a strong password"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        {/* Confirm new password */}
        <AuthFormField
          id="reset-confirm-password"
          label="Confirm new password"
          error={state?.fieldErrors?.confirmPassword}
          required
        >
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            <PasswordInput
              id="reset-confirm-password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat your new password"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        <Button
          type="submit"
          id="reset-submit"
          disabled={isPending}
          className="h-10 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/20 transition-all text-xs sm:text-sm mt-1"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Updating password…
            </>
          ) : (
            <>
              Update Password <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Back to login */}
      <p className="text-center text-xs text-slate-600 font-medium">
        <Link
          href={ROUTES.LOGIN}
          className="font-extrabold text-emerald-700 hover:underline"
        >
          ← Back to sign in
        </Link>
      </p>
    </motion.div>
  );
}
