"use client";

/**
 * MacroDonutChart — Pie/Donut chart displaying actual Protein, Carbs, and Fat ratio.
 * Powered by Recharts.
 */

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface MacroDonutChartProps {
  data: Array<{ name: string; value: number; grams: number; color: string }>;
}

export function MacroDonutChart({ data }: MacroDonutChartProps) {
  const totalCalories = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-foreground">Macronutrient Distribution</h3>
        <p className="text-xs text-muted-foreground">Calories split across Protein, Carbs & Fat</p>
      </div>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card, #ffffff)",
                borderColor: "var(--color-border, #e2e8f0)",
                borderRadius: "1rem",
                fontSize: "12px",
              }}
              formatter={(value: any, name: any, item: any) => [
                `${value} kcal (${item.payload.grams}g)`,
                name,
              ]}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
          <span className="text-xs text-muted-foreground font-semibold">Total</span>
          <span className="text-lg font-extrabold text-foreground">{totalCalories} kcal</span>
        </div>
      </div>
    </div>
  );
}
