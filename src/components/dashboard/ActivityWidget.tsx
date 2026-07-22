"use client";

/**
 * ActivityWidget — Weekly activity completion bar chart.
 * Renders live database target completion percentages for each day of the week.
 */

import { CheckSquare } from "lucide-react";

export interface ActivityDayData {
  dayName: string;
  completionPercentage: number;
  isToday?: boolean;
}

interface ActivityWidgetProps {
  daysData?: ActivityDayData[];
  todayCompletionPercentage?: number;
}

const defaultWeekDays: ActivityDayData[] = [
  { dayName: "Sun", completionPercentage: 0 },
  { dayName: "Mon", completionPercentage: 0 },
  { dayName: "Tue", completionPercentage: 0 },
  { dayName: "Wed", completionPercentage: 0 },
  { dayName: "Thu", completionPercentage: 0 },
  { dayName: "Fri", completionPercentage: 0 },
  { dayName: "Sat", completionPercentage: 0 },
];

export function ActivityWidget({ daysData, todayCompletionPercentage = 0 }: ActivityWidgetProps) {
  const todayDayName = new Date().toLocaleDateString("en-US", { weekday: "short" });

  const weekList = defaultWeekDays.map((defaultDay) => {
    const matched = daysData?.find((d) => d.dayName.toLowerCase() === defaultDay.dayName.toLowerCase());
    const isToday = defaultDay.dayName.toLowerCase() === todayDayName.toLowerCase();
    return {
      dayName: defaultDay.dayName,
      completionPercentage: isToday ? todayCompletionPercentage : matched ? matched.completionPercentage : 0,
      isToday,
    };
  });

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" /> Goal Completion
        </h3>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-lg">
          Today: {todayCompletionPercentage}%
        </span>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between gap-2 h-28 pt-2">
        {weekList.map((d) => (
          <div key={d.dayName} className="flex flex-col items-center flex-1 h-full justify-end gap-1.5 group">
            <span className={`text-[10px] font-extrabold ${d.isToday ? "text-primary" : "text-muted-foreground/60"}`}>
              {d.completionPercentage}%
            </span>
            <div className="w-full max-w-[24px] h-full bg-muted/40 rounded-full overflow-hidden flex items-end">
              <div
                className={`w-full rounded-full transition-all duration-500 ${
                  d.isToday ? "bg-primary" : "bg-primary/30 group-hover:bg-primary/50"
                }`}
                style={{ height: `${Math.max(8, d.completionPercentage)}%` }}
              />
            </div>
            <span className={`text-[10px] font-semibold ${d.isToday ? "text-foreground font-extrabold" : "text-muted-foreground"}`}>
              {d.dayName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
