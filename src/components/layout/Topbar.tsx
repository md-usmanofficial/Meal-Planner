"use client";

/**
 * Topbar Header Component.
 * Search bar, notifications, theme toggle, and user profile avatar dropdown.
 */

import { useState } from "react";
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
} from "lucide-react";
import { signOutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [searchQuery, setSearchQuery] = useState("");

  const initials = getInitials(userName);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card/60 backdrop-blur-xl px-4 lg:px-6">
      {/* Mobile Menu Trigger & Search Bar */}
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
            className="h-10 w-full rounded-xl bg-background pl-9 pr-4 text-sm border-border/80 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl"
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>

        {/* Notifications Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl"
          title="Notifications"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

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
              <Link href={ROUTES.SETTINGS} className="flex w-full items-center gap-2 py-1">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href={ROUTES.SETTINGS} className="flex w-full items-center gap-2 py-1">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span>App Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <form action={signOutAction} className="w-full">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 text-destructive font-medium text-xs py-1"
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
