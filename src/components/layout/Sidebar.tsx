"use client";

/**
 * Sidebar Navigation Component.
 * Responsive desktop sidebar navigation matching the design system.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Apple,
  BarChart3,
  CalendarDays,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Meal Plans", href: ROUTES.MEAL_PLANS, icon: CalendarDays },
  { name: "Food Log", href: ROUTES.FOOD_LOG, icon: ClipboardList },
  { name: "Recipes", href: ROUTES.RECIPES, icon: ChefHat },
  { name: "Nutrition", href: ROUTES.NUTRITION, icon: Apple },
  { name: "Analytics", href: ROUTES.ANALYTICS, icon: BarChart3 },
  { name: "Progress", href: ROUTES.PROGRESS, icon: TrendingUp },
  { name: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-card/60 backdrop-blur-xl lg:flex lg:flex-col">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-extrabold text-base shadow-sm">
          N
        </div>
        <div>
          <span className="text-base font-extrabold tracking-tight text-foreground block leading-none">
            NutriPlan
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">Smart Meal Planner</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pro / Recipe CTA Card */}
      <div className="p-3">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <p className="text-xs font-bold text-foreground">Personalized AI Recipes</p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Get instant meal recommendations tailored to your goals.
          </p>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="border-t border-border p-3">
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive text-sm font-medium"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </form>
      </div>
    </aside>
  );
}
