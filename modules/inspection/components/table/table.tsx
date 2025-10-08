import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import type { InspectionsType } from "@modules/shared/api";
import { Table, Download, Edit, Trash2 } from "lucide-react";
import { getEquipmentNumber } from "./helper";
import { Button } from "@/components/ui/button";
import { formatInspectionDate } from "@modules/shared/helpers";

interface InspectionTableProps {
  inspections: InspectionsType[];
  loading: boolean;
  isAdmin: boolean;
  exporting: boolean;
  onExportPDF: (inspection: InspectionsType) => void;
  onEditInspection: (inspectionId: string) => void;
  onDeleteInspection: (inspectionId: string) => void;
}

export function InspectionTable({
  inspections,
  loading,
  isAdmin,
  exporting,
  onExportPDF,
  onEditInspection,
  onDeleteInspection,
}: InspectionTableProps) {
  return (
    <div className="bg-card rounded-lg border shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Équipement</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Technicien</TableHead>
            <TableHead>Date prévue</TableHead>
            <TableHead>Dernière modification</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inspections.map((inspection) => (
            <TableRow key={inspection.id}>
              <TableCell className="font-medium">
                Équipement #{getEquipmentNumber(inspection)}
              </TableCell>
              <TableCell>{inspection.client?.name || "-"}</TableCell>
              <TableCell>
                {inspection.technician?.display_name || "-"}
              </TableCell>
              <TableCell>
                {formatInspectionDate(inspection.scheduled_date)}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatInspectionDate(inspection.updated_at)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExportPDF(inspection)}
                    disabled={loading || exporting}
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEditInspection(inspection.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  {isAdmin && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer l'inspection
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette inspection
                            ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteInspection(inspection.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
