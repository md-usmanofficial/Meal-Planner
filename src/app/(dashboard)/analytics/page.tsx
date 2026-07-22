"use client";

/**
 * Analytics Page — Recharts Analytics & Health Reports Hub.
 *
 * Supports:
 * - Time range selector (7 days, 30 days, 90 days)
 * - Calorie Intake vs Goal area chart
 * - Macro breakdown donut chart
 * - Weight progress trend line chart
 * - Meal plan adherence rate gauge
 */

import { useState, useEffect } from "react";
import { BarChart3, Calendar } from "lucide-react";
import { CalorieTrendChart } from "@/components/analytics/CalorieTrendChart";
import { MacroDonutChart } from "@/components/analytics/MacroDonutChart";
import { WeightProgressChart } from "@/components/analytics/WeightProgressChart";
import { AdherenceGauge } from "@/components/analytics/AdherenceGauge";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  calorieTrend: Array<{ date: string; consumed: number; goal: number }>;
  macroBreakdown: Array<{ name: string; value: number; grams: number; color: string }>;
  weightProgress: Array<{ date: string; weightKg: number }>;
  adherenceRate: number;
  totalMealsCount: number;
  completedMealsCount: number;
}

export default function AnalyticsPage() {
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnalytics = async (days: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/analytics?days=${days}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setData(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(rangeDays);
  }, [rangeDays]);

  return (
    <div className="space-y-6">
      {/* Header & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" /> Analytics & Reports
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Visualize your calorie intake, macronutrient split, weight trends, and meal plan adherence.
          </p>
        </div>

        {/* Range Selector Pills */}
        <div className="flex items-center gap-1 bg-card p-1 rounded-2xl border border-border shadow-2xs">
          {[
            { days: 7, label: "7 Days" },
            { days: 30, label: "30 Days" },
            { days: 90, label: "90 Days" },
          ].map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setRangeDays(r.days)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all",
                rangeDays === r.days
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Charts */}
      {isLoading || !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calorie Trend */}
          <CalorieTrendChart data={data.calorieTrend} />

          {/* Macro Donut */}
          <MacroDonutChart data={data.macroBreakdown} />

          {/* Weight Progress Line */}
          <WeightProgressChart data={data.weightProgress} />

          {/* Adherence Rate */}
          <AdherenceGauge
            adherenceRate={data.adherenceRate}
            totalMealsCount={data.totalMealsCount}
            completedMealsCount={data.completedMealsCount}
          />
        </div>
      )}
    </div>
  );
}
