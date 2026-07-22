/**
 * Root Layout — wraps every page in the application.
 * Sets up fonts, theme provider, and global notification system.
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NutriPlan — Smart Meal Planner",
    template: "%s | NutriPlan",
  },
  description:
    "Plan your meals, track nutrition, monitor your health progress, and discover delicious recipes — all in one place.",
  keywords: [
    "meal planner",
    "nutrition tracker",
    "calorie counter",
    "recipe discovery",
    "health tracking",
    "diet planning",
    "food log",
    "weight loss",
    "healthy eating",
  ],
  authors: [{ name: "NutriPlan" }],
  creator: "NutriPlan",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "NutriPlan — Smart Meal Planner",
    description:
      "Plan your meals, track nutrition, monitor your health progress, and discover delicious recipes.",
    siteName: "NutriPlan",
  },
  twitter: {
    card: "summary_large_image",
    title: "NutriPlan — Smart Meal Planner",
    description:
      "Plan your meals, track nutrition, monitor your health progress, and discover delicious recipes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              fontFamily: "var(--font-inter)",
            },
          }}
        />
      </body>
    </html>
  );
}
