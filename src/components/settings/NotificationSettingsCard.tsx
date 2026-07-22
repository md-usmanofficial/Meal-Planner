"use client";

/**
 * NotificationSettingsCard — Email & meal reminder toggle switches.
 */

import { useState } from "react";
import { Bell, Mail } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function NotificationSettingsCard() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);

  const handleEmailToggle = (val: boolean) => {
    setEmailNotifications(val);
    toast.success(val ? "Email notifications enabled." : "Email notifications muted.");
  };

  const handleRemindersToggle = (val: boolean) => {
    setMealReminders(val);
    toast.success(val ? "Meal reminders enabled." : "Meal reminders muted.");
  };

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3 border-b border-border/60 pb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-foreground">Notification Alerts</h4>
          <p className="text-xs text-muted-foreground">Manage email updates and meal reminder alerts</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-xs font-bold text-foreground block">Weekly Email Digest</span>
              <span className="text-[10px] text-muted-foreground">Receive weekly progress summaries and plan previews</span>
            </div>
          </div>
          <Switch checked={emailNotifications} onCheckedChange={handleEmailToggle} />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className="text-xs font-bold text-foreground block">Daily Meal Reminders</span>
              <span className="text-[10px] text-muted-foreground">Push notifications for scheduled breakfast, lunch & dinner</span>
            </div>
          </div>
          <Switch checked={mealReminders} onCheckedChange={handleRemindersToggle} />
        </div>
      </div>
    </div>
  );
}
