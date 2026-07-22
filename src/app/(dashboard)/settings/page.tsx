"use client";

/**
 * Settings Page — App Preferences & Account Settings Hub.
 *
 * Supports:
 * - Dark / Light Mode preference switch
 * - Metric vs Imperial unit system selector
 * - Notification and meal reminder alerts
 * - Security password update form
 */

import { Settings } from "lucide-react";
import { ThemeToggleCard } from "@/components/settings/ThemeToggleCard";
import { UnitPreferencesCard } from "@/components/settings/UnitPreferencesCard";
import { NotificationSettingsCard } from "@/components/settings/NotificationSettingsCard";
import { AccountSettingsForm } from "@/components/settings/AccountSettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-7 w-7 text-primary" /> Settings & Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize your interface theme, measurement units, notifications, and security options.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="space-y-6">
        <ThemeToggleCard />
        <UnitPreferencesCard />
        <NotificationSettingsCard />
        <AccountSettingsForm />
      </div>
    </div>
  );
}
