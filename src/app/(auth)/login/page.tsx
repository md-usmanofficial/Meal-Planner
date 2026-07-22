"use client";

/**
 * Login Page — Phase 1 Authentication.
 *
 * Uses React 19 useActionState + Server Action for secure server-side auth.
 * Validates with Zod on submit. Shows field-level and global error messages.
 */

import { Suspense, useActionState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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

  // Show server-side redirect messages as toasts
  useEffect(() => {
    if (message) toast.info(message);
  }, [message]);

  // Show global server errors as toasts
  useEffect(() => {
    if (state?.error) toast.error(state.error);
  }, [state?.error]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue to NutriPlan
        </p>
      </div>

      {/* Inline info banner */}
      {message && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
          {message}
        </div>
      )}

      {/* Login Form */}
      <form action={formAction} className="space-y-4" noValidate>
        {/* Email */}
        <AuthFormField
          id="login-email"
          label="Email address"
          error={state?.fieldErrors?.email}
          required
        >
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            aria-describedby={state?.fieldErrors?.email ? "login-email-error" : undefined}
            className="h-11"
          />
        </AuthFormField>

        {/* Password */}
        <AuthFormField
          id="login-password"
          label="Password"
          error={state?.fieldErrors?.password}
          required
        >
          <PasswordInput
            id="login-password"
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            disabled={isPending}
            className="h-11"
          />
        </AuthFormField>

        {/* Forgot password */}
        <div className="flex justify-end">
          <Link
            href={ROUTES.FORGOT_PASSWORD}
            className="text-sm text-primary hover:underline"
            tabIndex={isPending ? -1 : 0}
          >
            Forgot your password?
          </Link>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          id="login-submit"
          disabled={isPending}
          className="h-11 w-full text-base font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <Separator />

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-primary hover:underline"
        >
          Create one free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}
