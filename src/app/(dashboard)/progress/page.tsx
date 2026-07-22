"use client";

/**
 * Progress Page — Comprehensive Progress Tracking Dashboard.
 *
 * Supports:
 * - Weight history log entries & history table
 * - Visual BMI Gauge & category classification
 * - Water intake logger
 * - Streak badge counter
 */

import { useState, useEffect } from "react";
import { TrendingUp, Scale, Droplets, Calendar, Flame } from "lucide-react";
import { BMIGauge } from "@/components/progress/BMIGauge";
import { StreakBadge } from "@/components/progress/StreakBadge";
import { WeightLogForm } from "@/components/progress/WeightLogForm";
import { useProfile } from "@/hooks/useProfile";
import { formatShortDate, formatWater } from "@/lib/utils";
import { logWaterAction } from "@/app/(dashboard)/progress/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WeightLogItem {
  id: string;
  weightKg: number;
  date: string;
  notes?: string | null;
}

export default function ProgressPage() {
  const { profile, nutritionGoal } = useProfile();
  const [weightLogs, setWeightLogs] = useState<WeightLogItem[]>([]);
  const [todayWaterMl, setTodayWaterMl] = useState(1500);
  const [streakDays, setStreakDays] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgressData = async () => {
    setIsLoading(true);
    try {
      const [wRes, waterRes] = await Promise.all([
        fetch("/api/progress/weight"),
        fetch("/api/progress/water"),
      ]);

      if (wRes.ok) {
        const wJson = await wRes.json();
        if (wJson.success) setWeightLogs(wJson.data);
      }

      if (waterRes.ok) {
        const waterJson = await waterRes.json();
        if (waterJson.success) setTodayWaterMl(waterJson.data.todayWater);
      }
    } catch (err) {
      console.error("Failed to fetch progress data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);

  const handleLogWater = async (amount: number) => {
    try {
      await logWaterAction(amount);
      setTodayWaterMl((prev) => prev + amount);
      toast.success(`Logged +${amount}ml water! 💧`);
    } catch (err) {
      console.error("Log water error:", err);
    }
  };

  const bmi = nutritionGoal?.bmi || (profile?.weightKg && profile?.heightCm ? Math.round((profile.weightKg / Math.pow(profile.heightCm / 100, 2)) * 10) / 10 : 22.5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" /> Progress Tracking
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Monitor your weight trends, BMI classification, water intake, and daily log streak.
          </p>
        </div>

        <WeightLogForm
          currentWeightKg={profile?.weightKg || 70}
          onWeightLogged={fetchProgressData}
        />
      </div>

      {/* Streak Banner */}
      <StreakBadge streakDays={streakDays} />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BMI Gauge */}
        <BMIGauge
          bmi={bmi}
          weightKg={profile?.weightKg || 70}
          heightCm={profile?.heightCm || 170}
        />

        {/* Water Logger Widget */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500 fill-blue-500" /> Daily Water Tracker
            </h3>
            <span className="text-xs font-bold text-muted-foreground">
              {formatWater(todayWaterMl)} / 2,000ml goal
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, (todayWaterMl / 2000) * 100)}%` }}
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <Button
              onClick={() => handleLogWater(250)}
              variant="outline"
              className="flex-1 rounded-2xl font-bold border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
            >
              + 250ml Glass
            </Button>
            <Button
              onClick={() => handleLogWater(500)}
              variant="outline"
              className="flex-1 rounded-2xl font-bold border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
            >
              + 500ml Bottle
            </Button>
          </div>
        </div>
      </div>

      {/* Weight History Table */}
      <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" /> Weight History Logs
          </h3>
          <span className="text-xs text-muted-foreground font-semibold">
            {weightLogs.length} total entries
          </span>
        </div>

        {weightLogs.length > 0 ? (
          <div className="divide-y divide-border/60">
            {weightLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xs">
                    {log.weightKg}kg
                  </div>
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      {formatShortDate(log.date)}
                    </span>
                    {log.notes && (
                      <span className="text-[10px] text-muted-foreground">{log.notes}</span>
                    )}
                  </div>
                </div>
                <span className="text-xs font-extrabold text-muted-foreground">
                  {log.weightKg} kg
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-border rounded-2xl">
            <Scale className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-xs text-muted-foreground">No weight logs recorded yet. Click above to log your first weight!</p>
          </div>
        )}
      </div>
    </div>
  );
}
