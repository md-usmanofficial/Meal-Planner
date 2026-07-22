/**
 * Dashboard Layout (Server Component).
 * Checks Supabase authentication and verifies if the user completed onboarding.
 * Redirects un-onboarded users directly to /onboarding to set up their real personal metrics.
 */

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileService } from "@/services/profile.service";
import { DashboardLayoutClient } from "@/components/layout/DashboardLayoutClient";
import { ROUTES } from "@/constants/routes";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch full profile and onboarding status from Prisma database
  const fullProfile = await ProfileService.getFullProfile(user.id);
  const profile = fullProfile?.profile;

  // If user hasn't completed onboarding wizard, force redirect to /onboarding
  if (!profile || !profile.isOnboardingComplete) {
    redirect("/onboarding");
  }

  const userName = profile.name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  const userEmail = user.email || "";

  return (
    <DashboardLayoutClient
      userName={userName}
      userEmail={userEmail}
      avatarUrl={profile.avatarUrl}
    >
      {children}
    </DashboardLayoutClient>
  );
}
