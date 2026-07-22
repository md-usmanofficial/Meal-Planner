"use client";

/**
 * TodaySchedule Widget — Timeline view of today's active meal plan and water intake.
 * Displays real-time completed status and links directly to the Meal Plans page.
 */

import Link from "next/link";
import { CheckCircle2, Clock, Flame, Droplets, ArrowRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { PlanGeneratorDialog } from "@/components/meal-plans/PlanGeneratorDialog";
import { ManualPlanBuilderDialog } from "@/components/meal-plans/ManualPlanBuilderDialog";

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: "Water Intake" | "Breakfast" | "Lunch" | "Dinner" | "Snack" | "Dessert";
  calories?: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  waterMl?: number;
  prepTimeMinutes?: number;
  completed: boolean;
  recipeData?: any;
}

interface TodayScheduleProps {
  items?: ScheduleItem[];
  onToggleItem?: (id: string) => void;
  onPlanGenerated?: () => void;
}

export function TodaySchedule({ items = [], onToggleItem, onPlanGenerated }: TodayScheduleProps) {
  const completedCount = items.filter((s) => s.completed).length;

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div>
          <h3 className="text-base font-bold text-foreground">
            View today&apos;s schedule
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {items.length > 0 ? `${completedCount} of ${items.length} activities completed` : "No active activities yet"}
          </p>
        </div>
      </div>

      {/* Timeline List or Create Plan CTA */}
      {items.length === 0 ? (
        <div className="py-8 text-center space-y-3 bg-muted/20 rounded-2xl border border-dashed border-border p-4">
          <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="text-xs font-bold text-foreground">No active meals planned for today</p>
          <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
            Build your first meal plan to unlock live tracking, macro intake analytics, & shopping lists!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <ManualPlanBuilderDialog onSuccess={onPlanGenerated} />
            <PlanGeneratorDialog onPlanGenerated={onPlanGenerated} />
          </div>
        </div>
      ) : (
        <div className="relative space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex items-start gap-3 pl-8 group cursor-pointer"
              onClick={() => onToggleItem?.(item.id)}
            >
              {/* Checkbox Timeline Node */}
              <div
                className={cn(
                  "absolute left-1 top-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-all",
                  item.completed
                    ? "bg-emerald-500 text-white"
                    : "border-2 border-muted-foreground/40 bg-card group-hover:border-primary"
                )}
              >
                {item.completed && <CheckCircle2 className="h-4 w-4" />}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <span className="text-[10px] font-semibold text-muted-foreground block">
                  {item.time}
                </span>
                <h4
                  className={cn(
                    "text-xs font-bold leading-tight transition-all",
                    item.completed ? "line-through text-muted-foreground" : "text-foreground"
                  )}
                >
                  {item.title}
                </h4>

                {/* Badges */}
                <div className="flex items-center gap-2 pt-0.5">
                  {item.type === "Water Intake" ? (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0 bg-blue-500/10 text-blue-500 border-blue-500/20">
                      <Droplets className="mr-1 h-2.5 w-2.5" /> Water ({item.waterMl || 500}ml)
                    </Badge>
                  ) : (
                    <>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1.5 py-0 border-transparent",
                          item.type === "Breakfast" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                          item.type === "Lunch" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                          item.type === "Dinner" && "bg-purple-500/10 text-purple-600 dark:text-purple-400",
                          item.type === "Snack" && "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                        )}
                      >
                        {item.type}
                      </Badge>

                      {item.calories && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Flame className="h-2.5 w-2.5 text-amber-500" /> {item.calories} kcal
                        </span>
                      )}

                      {item.prepTimeMinutes && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5 text-muted-foreground" /> {item.prepTimeMinutes} mins
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Button to Meal Plans Page */}
      <div className="pt-2">
        <Button
          asChild
          className="w-full h-10 rounded-2xl bg-amber-400 text-slate-950 font-extrabold hover:bg-amber-500 shadow-xs text-xs"
        >
          <Link href={ROUTES.MEAL_PLANS}>
            Manage Full Meal Plan <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
