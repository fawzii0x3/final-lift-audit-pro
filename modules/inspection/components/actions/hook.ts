import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { downloadInspectionPDFWithReactPdf } from "@/lib/pdf/reactPdfService";
import { getInspectionData } from "@/lib/pdf/inspectionDataService";
import type { Inspection } from "./useInspections";

export const useInspectionActions = () => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  const exportPDF = useCallback(
    async (inspection: Inspection | { id: string }) => {
      try {
        setExporting(true);

        // Show initial loading toast
        toast({
          title: "Génération du PDF en cours...",
          description: "Création du rapport corporatif...",
        });

        // Fetch complete inspection data for PDF generation
        const completeInspectionData = await getInspectionData(inspection.id);
        console.log("completeInspectionData", completeInspectionData);

        // Use the new React PDF export function
        await downloadInspectionPDFWithReactPdf(completeInspectionData);

        toast({
          title: "Succès",
          description: "Rapport PDF corporatif exporté avec succès.",
        });
      } catch (error) {
        console.error("Error exporting PDF:", error);

        // Show specific error message from the PDF generation function
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Impossible d'exporter le rapport PDF.";

        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setExporting(false);
      }
    },
    [toast],
  );

  return {
    exporting,
    exportPDF,
  };
};
