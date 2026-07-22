"use client";

/**
 * Forgot Password Page — Phase 1 Authentication.
 *
 * Sends a password reset email via Supabase.
 * Shows success state after submission (prevents user enumeration).
 */

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
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

  // Show success state after email is sent
  if (state?.success) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Mail className="h-8 w-8 text-primary" aria-hidden />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{state.success}</p>
        </div>
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          ← Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Forgot your password?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
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
          <Input
            id="forgot-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            className="h-11"
          />
        </AuthFormField>

        <Button
          type="submit"
          id="forgot-submit"
          disabled={isPending}
          className="h-11 w-full text-base font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Sending reset link…
            </>
          ) : (
            "Send reset link"
          )}
        </Button>
      </form>

      {/* Back to login */}
      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
