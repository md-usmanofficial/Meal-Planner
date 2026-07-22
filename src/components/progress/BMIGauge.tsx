"use client";

/**
 * BMIGauge Component — Visual BMI category gauge & status display.
 */

import { Scale } from "lucide-react";
import { getBMICategory } from "@/lib/nutrition/calculations";

interface BMIGaugeProps {
  bmi: number;
  weightKg: number;
  heightCm: number;
}

export function BMIGauge({ bmi, weightKg, heightCm }: BMIGaugeProps) {
  const category = getBMICategory(bmi);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" /> Body Mass Index (BMI)
        </h3>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full border"
          style={{ color: category.color, borderColor: category.color }}
        >
          {category.label}
        </span>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-3xl font-extrabold text-foreground">{bmi}</span>
          <span className="text-xs text-muted-foreground ml-1">kg/m²</span>
        </div>
        <div className="text-right text-xs text-muted-foreground font-semibold">
          <span>{weightKg} kg</span> • <span>{heightCm} cm</span>
        </div>
      </div>

      {/* Visual Color Bar */}
      <div className="space-y-1.5 pt-2">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[18.5%]" style={{ backgroundColor: "#60a5fa" }} title="Underweight (<18.5)" />
          <div className="h-full w-[31.5%]" style={{ backgroundColor: "#34d399" }} title="Normal (18.5 - 24.9)" />
          <div className="h-full w-[25%]" style={{ backgroundColor: "#fbbf24" }} title="Overweight (25 - 29.9)" />
          <div className="h-full w-[25%]" style={{ backgroundColor: "#f87171" }} title="Obese (>=30)" />
        </div>
        <div className="flex justify-between text-[9px] text-muted-foreground font-bold">
          <span>15</span>
          <span>18.5</span>
          <span>25.0</span>
          <span>30.0</span>
          <span>40</span>
        </div>
      </div>
    </div>
  );
}
