"use client";

/**
 * Reset Password Page — Phase 1 Authentication.
 *
 * Called after the user clicks the reset link in their email.
 * Supabase automatically authenticates the user via the URL hash token.
 */

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Set a new password
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password you haven&apos;t used before.
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
          <PasswordInput
            id="reset-password"
            name="password"
            autoComplete="new-password"
            placeholder="Create a strong password"
            disabled={isPending}
            className="h-11"
          />
        </AuthFormField>

        {/* Confirm new password */}
        <AuthFormField
          id="reset-confirm-password"
          label="Confirm new password"
          error={state?.fieldErrors?.confirmPassword}
          required
        >
          <PasswordInput
            id="reset-confirm-password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Repeat your new password"
            disabled={isPending}
            className="h-11"
          />
        </AuthFormField>

        <Button
          type="submit"
          id="reset-submit"
          disabled={isPending}
          className="h-11 w-full text-base font-semibold"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Updating password…
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </form>

      {/* Back to login */}
      <p className="text-center text-sm text-muted-foreground">
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary hover:underline"
        >
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
