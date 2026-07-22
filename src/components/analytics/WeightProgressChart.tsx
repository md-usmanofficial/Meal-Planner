"use client";

/**
 * WeightProgressChart — Smooth line chart tracking weight change over time.
 * Powered by Recharts.
 */

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface WeightProgressChartProps {
  data: Array<{ date: string; weightKg: number }>;
}

export function WeightProgressChart({ data }: WeightProgressChartProps) {
  const minWeight = Math.floor(Math.min(...data.map((d) => d.weightKg))) - 2;
  const maxWeight = Math.ceil(Math.max(...data.map((d) => d.weightKg))) + 2;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-3">
      <div>
        <h3 className="text-base font-extrabold text-foreground">Weight Trend Progress</h3>
        <p className="text-xs text-muted-foreground">Recorded weigh-in history</p>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border, #e2e8f0)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #64748b)" }} />
            <YAxis domain={[minWeight, maxWeight]} tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #64748b)" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card, #ffffff)",
                borderColor: "var(--color-border, #e2e8f0)",
                borderRadius: "1rem",
                fontSize: "12px",
                fontWeight: "bold",
              }}
              formatter={(value: any) => [`${value} kg`, "Weight"]}
            />
            <Line
              type="monotone"
              dataKey="weightKg"
              stroke="var(--color-primary, #8b5cf6)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--color-primary, #8b5cf6)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
