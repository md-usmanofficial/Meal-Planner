"use client";

/**
 * DashboardLayoutClient — Client wrapper for Topbar, Sidebar, MobileNav, and Viewport.
 */

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { MobileNav } from "@/components/layout/MobileNav";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  avatarUrl?: string | null;
}

export function DashboardLayoutClient({
  children,
  userName,
  userEmail,
  avatarUrl,
}: DashboardLayoutClientProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Navigation Drawer */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar Header */}
        <Topbar
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
