"use client";

/**
 * Topbar Header Component.
 * Global search, interactive notifications center, theme toggle, and user profile avatar dropdown.
 */

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Moon,
  Search,
  Sun,
  User,
  LogOut,
  Settings,
  Menu,
  CheckCheck,
  Utensils,
  Droplets,
  Award,
} from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettingsStore } from "@/store/settingsStore";
import { getInitials } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "meal" | "water" | "streak";
  isRead: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Lunch Reminder 🥗",
    message: "Time for your Mediterranean Salmon Bowl!",
    time: "10 mins ago",
    type: "meal",
    isRead: false,
  },
  {
    id: "notif-2",
    title: "Hydration Alert 💧",
    message: "Don't forget your afternoon 500ml water intake.",
    time: "1 hour ago",
    type: "water",
    isRead: false,
  },
  {
    id: "notif-3",
    title: "Daily Goal Achieved! 🏆",
    message: "You reached 90%+ of your daily protein target yesterday.",
    time: "Yesterday",
    type: "streak",
    isRead: true,
  },
];

interface TopbarProps {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  onOpenMobileNav?: () => void;
}

export function Topbar({
  userName = "Jessica Smith",
  userEmail = "jessica@example.com",
  avatarUrl,
  onOpenMobileNav,
}: TopbarProps) {
  const { darkMode, toggleDarkMode } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    setMounted(true);
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read.");
  };

  const handleToggleTheme = () => {
    toggleDarkMode();
    const isNowDark = !darkMode;
    toast.success(isNowDark ? "Switched to Dark Mode 🌙" : "Switched to Light Mode ☀️");
  };

  const initials = getInitials(userName);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/60 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile Menu Trigger & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl"
          onClick={onOpenMobileNav}
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search recipes, foods, or meal plans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl bg-background pl-9 pr-4 text-xs border-border/80 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right Action Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark / Light Mode Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl border border-border/60 hover:bg-accent cursor-pointer"
          onClick={handleToggleTheme}
          title={mounted && darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {mounted && darkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          )}
        </Button>

        {/* Interactive Notifications Center Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl border border-border/60 hover:bg-accent cursor-pointer"
              title="Notifications"
            >
              <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 rounded-3xl p-3 shadow-2xl border border-border">
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                    {unreadCount} new
                  </Badge>
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCheck className="h-3 w-3" /> Read all
                </button>
              )}
            </div>

            <DropdownMenuSeparator className="my-1" />

            <div className="space-y-1.5 max-h-72 overflow-y-auto py-1">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-2.5 rounded-2xl transition-colors flex items-start gap-2.5 ${
                    notif.isRead ? "bg-muted/20 opacity-75" : "bg-primary/5 border border-primary/10"
                  }`}
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
                    {notif.type === "meal" ? (
                      <Utensils className="h-3.5 w-3.5" />
                    ) : notif.type === "water" ? (
                      <Droplets className="h-3.5 w-3.5" />
                    ) : (
                      <Award className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span className="truncate">{notif.title}</span>
                      <span className="text-[9px] text-muted-foreground font-normal shrink-0">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <DropdownMenuSeparator className="my-1" />

            <div className="pt-1 text-center">
              <Link
                href={ROUTES.SETTINGS}
                className="text-xs font-bold text-primary hover:underline block py-1"
              >
                Configure Reminder Settings →
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-accent cursor-pointer transition-colors outline-none">
            <Avatar className="h-8 w-8 border border-primary/20">
              <AvatarImage src={avatarUrl || undefined} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block text-xs font-bold text-foreground">
              {userName.split(" ")[0]}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl">
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-foreground leading-none">{userName}</p>
                <p className="text-xs text-muted-foreground leading-none">{userEmail}</p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href={ROUTES.SETTINGS} className="flex w-full items-center gap-2 py-1 cursor-pointer">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href={ROUTES.SETTINGS} className="flex w-full items-center gap-2 py-1 cursor-pointer">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>App Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <form action={signOutAction} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-destructive font-medium text-xs py-1 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
