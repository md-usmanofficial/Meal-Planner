"use client";

/**
 * AccountSettingsForm — Password update form with validation.
 */

import { useState } from "react";
import { KeyRound, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { AuthFormField } from "@/components/auth/AuthFormField";
import { changePasswordAction } from "@/app/(dashboard)/settings/actions";
import { toast } from "sonner";

export function AccountSettingsForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsPending(true);
    try {
      const formData = new FormData();
      formData.set("password", password);
      formData.set("confirmPassword", confirmPassword);

      const res = await changePasswordAction(formData);
      setIsPending(false);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Password updated successfully! 🔒");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Change password error:", err);
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <KeyRound className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-foreground">Security & Password</h4>
          <p className="text-xs text-muted-foreground">Update your account password</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AuthFormField id="settings-password" label="New Password" required>
          <PasswordInput
            id="settings-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            className="h-10 text-xs"
          />
        </AuthFormField>

        <AuthFormField id="settings-confirm-password" label="Confirm New Password" required>
          <PasswordInput
            id="settings-confirm-password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            required
            className="h-10 text-xs"
          />
        </AuthFormField>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending || !password} className="rounded-xl font-bold gap-2">
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" /> Update Password
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
