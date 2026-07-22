"use client";

/**
 * ThemeToggleCard — Dark / Light mode toggle switch card.
 */

import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/store/settingsStore";

export function ThemeToggleCard() {
  const { darkMode, toggleDarkMode } = useSettingsStore();

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            {darkMode ? <Moon className="h-5 w-5 text-amber-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-foreground">Theme Preference</h4>
            <p className="text-xs text-muted-foreground">Toggle between Light and Dark interface modes</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-muted-foreground">{darkMode ? "Dark" : "Light"}</span>
          <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
        </div>
      </div>
    </div>
  );
}
