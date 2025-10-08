import { Plus, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InspectionEmptyStateProps {
  onCreateInspection: () => void;
}

export function InspectionEmptyState({
  onCreateInspection,
}: InspectionEmptyStateProps) {
  return (
    <div className="text-center py-12 bg-muted/20 rounded-lg">
      <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Aucune inspection</h3>
      <p className="text-muted-foreground mb-4">
        Commencez par créer votre première inspection.
      </p>
      <Button onClick={onCreateInspection}>
        <Plus className="mr-2 h-4 w-4" />
        Nouvelle inspection
      </Button>
    </div>
  );
}
