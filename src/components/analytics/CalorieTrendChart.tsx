"use client";

/**
 * CalorieTrendChart — Area/Bar chart comparing daily consumed calories vs goal target line.
 * Powered by Recharts.
 */

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

interface CalorieTrendChartProps {
  data: Array<{ date: string; consumed: number; goal: number }>;
}

export function CalorieTrendChart({ data }: CalorieTrendChartProps) {
  const goalValue = data[0]?.goal || 2000;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-foreground">Calorie Intake vs Goal</h3>
          <p className="text-xs text-muted-foreground">Daily calorie consumption trend</p>
        </div>
        <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
          Goal: {goalValue} kcal
        </span>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorConsumed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border, #e2e8f0)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #64748b)" }} />
            <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #64748b)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card, #ffffff)",
                borderColor: "var(--color-border, #e2e8f0)",
                borderRadius: "1rem",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            />
            <ReferenceLine y={goalValue} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "Target Goal", fill: "#ef4444", fontSize: 10 }} />
            <Area type="monotone" dataKey="consumed" name="Consumed Calories" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConsumed)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
