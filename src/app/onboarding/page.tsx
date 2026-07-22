import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProfileService } from "@/services/profile.service";
import { OnboardingWizard } from "@/components/profile/OnboardingWizard";
import { ROUTES } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Onboarding — Setup Your Profile",
  description: "Set up your profile and custom nutrition targets.",
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Check if profile already completed onboarding
  const fullProfile = await ProfileService.getFullProfile(user.id);
  if (fullProfile?.profile?.isOnboardingComplete) {
    redirect(ROUTES.DASHBOARD);
  }

  const userName = user.user_metadata?.name || user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 px-4">
      <OnboardingWizard userName={userName} />
    </div>
  );
}
