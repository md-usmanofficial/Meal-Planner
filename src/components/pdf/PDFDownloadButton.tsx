"use client";

/**
 * PDFDownloadButton — Client-side button to download Meal Plan PDF document.
 * Powered by @react-pdf/renderer.
 */

import { useState, useEffect } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealPlanPDFDocument, type PDFMealData } from "@/components/pdf/MealPlanPDFDocument";

interface PDFDownloadButtonProps {
  planName: string;
  userName?: string;
  planType?: string;
  startDate?: string;
  endDate?: string;
  targetCalories?: number;
  targetProtein?: number;
  targetCarbs?: number;
  targetFat?: number;
  meals: PDFMealData[];
}

export function PDFDownloadButton({
  planName,
  userName = "Jessica Smith",
  planType = "Weekly",
  startDate = new Date().toLocaleDateString(),
  endDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
  targetCalories = 2000,
  targetProtein = 120,
  targetCarbs = 250,
  targetFat = 65,
  meals,
}: PDFDownloadButtonProps) {
  const [isClient, setIsClient] = useState(false);
  const [PDFDownloadLink, setPDFDownloadLink] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import @react-pdf/renderer on client to prevent SSR window crashes
    import("@react-pdf/renderer").then((mod) => {
      setPDFDownloadLink(() => mod.PDFDownloadLink);
    });
  }, []);

  if (!isClient || !PDFDownloadLink) {
    return (
      <Button variant="outline" size="sm" disabled className="rounded-xl font-bold gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> Preparing PDF...
      </Button>
    );
  }

  const document = (
    <MealPlanPDFDocument
      planName={planName}
      userName={userName}
      planType={planType}
      startDate={startDate}
      endDate={endDate}
      targetCalories={targetCalories}
      targetProtein={targetProtein}
      targetCarbs={targetCarbs}
      targetFat={targetFat}
      meals={meals}
    />
  );

  return (
    <PDFDownloadLink
      document={document}
      fileName={`${planName.toLowerCase().replace(/[^a-z0-9]/g, "-")}-plan.pdf`}
    >
      {({ loading }: { loading: boolean }) => (
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          className="rounded-xl font-bold gap-2 border-primary/30 text-primary hover:bg-primary/10"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Generating PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" /> Export PDF
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
