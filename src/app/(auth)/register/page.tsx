"use client";

/**
 * Register Page — Phase 1 Authentication.
 *
 * Multi-field sign-up form with password strength indicator.
 * Uses React 19 useActionState + Server Action.
 */

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
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
import { useState } from "react";

const initialState: AuthActionState = null;

/** Password requirement rules for the strength indicator */
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Start your nutrition journey — free, forever.
        </p>
      </div>

      {/* Register Form */}
      <form action={formAction} className="space-y-4" noValidate>
        {/* Name */}
        <AuthFormField
          id="register-name"
          label="Full name"
          error={state?.fieldErrors?.name}
          required
        >
          <Input
            id="register-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Jessica Smith"
            disabled={isPending}
            className="h-11"
          />
        </AuthFormField>

        {/* Email */}
        <AuthFormField
          id="register-email"
          label="Email address"
          error={state?.fieldErrors?.email}
          required
        >
          <Input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            disabled={isPending}
            className="h-11"
          />
        </AuthFormField>

        {/* Password */}
        <AuthFormField
          id="register-password"
          label="Password"
          error={state?.fieldErrors?.password}
          required
        >
          <PasswordInput
            id="register-password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            disabled={isPending}
            className="h-11"
            onChange={(e) => setPassword(e.target.value)}
          />
        </AuthFormField>

        {/* Password strength indicator */}
        {password.length > 0 && (
          <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    i <= strength
                      ? strength <= 1
                        ? "bg-destructive"
                        : strength <= 2
                          ? "bg-amber-500"
                          : strength <= 3
                            ? "bg-yellow-400"
                            : "bg-green-500"
                      : "bg-border"
                  )}
                />
              ))}
            </div>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(password);
                return (
                  <li
                    key={rule.label}
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      passed ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                    )}
                  >
                    {passed ? (
                      <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden />
                    ) : (
                      <XCircle className="h-3 w-3 shrink-0" aria-hidden />
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
          <PasswordInput
            id="register-confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your password"
            disabled={isPending}
            className="h-11"
          />
        </AuthFormField>

        {/* Terms note */}
        <p className="text-xs text-muted-foreground">
          By creating an account, you agree to our{" "}
          <span className="text-primary">Terms of Service</span> and{" "}
          <span className="text-primary">Privacy Policy</span>.
        </p>

        {/* Submit */}
        <Button
          type="submit"
          id="register-submit"
          disabled={isPending}
          className="h-11 w-full text-base font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Creating account…
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <Separator />

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
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
