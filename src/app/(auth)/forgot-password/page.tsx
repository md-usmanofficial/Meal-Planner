"use client";

/**
 * Forgot Password Page — Clean White & Soft Green Theme.
 */

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { forgotPasswordAction } from "@/app/(auth)/actions";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { AuthActionState } from "@/lib/validations/auth";

const initialState: AuthActionState = null;

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    initialState
  );

  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  if (state?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-5 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <Mail className="h-7 w-7" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Check Your Inbox 📩
          </h1>
          <p className="mt-2 text-xs text-slate-600 font-medium leading-relaxed">{state.success}</p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center text-xs font-bold text-emerald-700 hover:underline"
        >
          ← Back to sign in
        </Link>
      </motion.div>
    );
  }

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
          Forgot Password? 🔑
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Enter your registered email and we'll send a password recovery link
        </p>
      </div>

      {/* Form */}
      <form action={formAction} className="space-y-4" noValidate>
        <AuthFormField
          id="forgot-email"
          label="Email address"
          error={state?.fieldErrors?.email}
          required
        >
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="forgot-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              disabled={isPending}
              className="h-10 rounded-xl bg-slate-50/50 border-slate-200 text-xs pl-10 text-slate-900 placeholder:text-slate-400 focus-visible:border-emerald-600 focus-visible:ring-emerald-500/20"
            />
          </div>
        </AuthFormField>

        <Button
          type="submit"
          id="forgot-submit"
          disabled={isPending}
          className="h-10 w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/20 transition-all text-xs sm:text-sm mt-1"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Sending link…
            </>
          ) : (
            <>
              Send Reset Link <ArrowRight className="ml-1.5 h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      {/* Back to login */}
      <p className="text-center text-xs text-slate-600 font-medium">
        Remember your password?{" "}
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
