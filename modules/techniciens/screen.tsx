import { UserPlus, User, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router";
import { useDeleteTechnician, useTechnicians } from "@modules/shared/api";
import { Routes } from "@modules/shared/routes";
import { toast } from "sonner";

export function Technicians() {
  const navigate = useNavigate();

  const { technicians, isLoading } = useTechnicians();
  const { mutateAsync: deleteTechnician, isPending: isDeleting } = useDeleteTechnician();

  const handleDeleteTechnician = async (technicianId: string, technicianName: string) => {
    try {
      await deleteTechnician(technicianId);
      toast.success(`Le technicien "${technicianName}" a été supprimé avec succès.`);
    } catch (error) {
      console.error("Error deleting technician:", error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer le technicien. Veuillez réessayer.";
      toast.error(errorMessage);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "org_admin":
        return <Badge variant="default">Admin</Badge>;
      case "org_technician":
        return <Badge variant="secondary">Technicien</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Techniciens</h1>
        </div>
        <div className="animate-pulse">
          <div className="bg-muted rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Techniciens</h1>
        <Button onClick={() => navigate(Routes.TECHNICIANS_CREATE)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Créer un technicien
        </Button>
      </div>

      {technicians.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun technicien</h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer le premier compte technicien pour votre
            organisation.
          </p>
          <Button onClick={() => navigate(Routes.TECHNICIANS_CREATE)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Créer un technicien
          </Button>
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {technicians.map((technician) => (
                <TableRow key={technician.id}>
                  <TableCell className="font-medium">
                    {technician.display_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                      {technician.email}
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(technician.role)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(technician.created_at).toLocaleDateString(
                      "fr-FR",
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Supprimer le technicien
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le technicien "
                            {technician.display_name}" ? Cette action est
                            irréversible et supprimera également toutes les
                            données associées.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTechnician(technician.id, technician.display_name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={isDeleting}
                          >
                            {isDeleting ? "Suppression..." : "Supprimer"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
