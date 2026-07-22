/**
 * TypeScript types for progress tracking (weight, water, streaks, daily progress).
 */

export interface WeightLog {
  id: string;
  userId: string;
  weightKg: number;
  date: Date;
  notes: string | null;
  createdAt: Date;
}

export interface WaterLog {
  id: string;
  userId: string;
  amountMl: number;
  date: Date;
  createdAt: Date;
}

export interface DailyProgress {
  id: string;
  userId: string;
  date: Date;
  caloriesConsumed: number;
  caloriesGoal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  waterMl: number;
  waterGoalMl: number;
  mealsCompleted: number;
  mealsTotal: number;
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeightLogFormData {
  weightKg: number;
  date: Date;
  notes?: string;
}

export interface WaterLogFormData {
  amountMl: number;
  date: Date;
}

/**
 * Aggregated progress stats for analytics charts
 */
export interface WeeklyProgressSummary {
  weekStart: Date;
  weekEnd: Date;
  avgCalories: number;
  avgProteinG: number;
  avgCarbsG: number;
  avgFatG: number;
  avgWaterMl: number;
  totalMealsCompleted: number;
  avgWeight: number | null;
  daysTracked: number;
}

export interface MonthlyProgressSummary {
  month: number;
  year: number;
  avgCalories: number;
  avgWeight: number | null;
  totalWaterMl: number;
  totalMealsCompleted: number;
  daysTracked: number;
}

/**
 * Chart data point (generic, used by Recharts)
 */
export interface ChartDataPoint {
  label: string;    // x-axis label
  date: string;     // ISO date string
  value: number;    // primary value
  [key: string]: string | number;  // additional series
}
