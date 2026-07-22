"use client";

/**
 * UnitPreferencesCard — Metric (kg/cm) vs Imperial (lbs/ft) measurement system selector.
 */

import { Scale } from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";
import { cn } from "@/lib/utils";

export function UnitPreferencesCard() {
  const { units, setUnits } = useSettingsStore();

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Scale className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-extrabold text-foreground">Measurement Units</h4>
          <p className="text-xs text-muted-foreground">Select system for weight & height metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={() => setUnits("METRIC")}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all",
            units === "METRIC"
              ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
              : "border-border bg-card text-foreground hover:bg-accent"
          )}
        >
          <span className="text-sm font-extrabold">Metric System</span>
          <span className="text-[10px] text-muted-foreground">Kilograms (kg) & Centimeters (cm)</span>
        </button>

        <button
          type="button"
          onClick={() => setUnits("IMPERIAL")}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all",
            units === "IMPERIAL"
              ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
              : "border-border bg-card text-foreground hover:bg-accent"
          )}
        >
          <span className="text-sm font-extrabold">Imperial System</span>
          <span className="text-[10px] text-muted-foreground">Pounds (lbs) & Feet/Inches (ft)</span>
        </button>
      </div>
    </div>
  );
}
