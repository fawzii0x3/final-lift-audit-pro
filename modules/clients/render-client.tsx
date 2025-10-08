import { TableCell, TableRow } from "@/components/ui/table.tsx";
import { Edit, Mail, MapPin, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
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
} from "@/components/ui/alert-dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useState } from "react";
import { type Clients, useDeleteClient } from "@modules/shared/api";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface Props {
  client: Clients;
}

export function RenderClient({ client }: Props) {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useDeleteClient();
  const [confirmationText, setConfirmationText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDeleteClient = async (clientId: string) => {
    try {
      await mutateAsync(clientId);
      toast("Client supprimé", {
        description: "Le client a été supprimé avec succès.",
      });
      setIsDialogOpen(false);
      setConfirmationText("");
    } catch (error) {
      console.error("Error deleting client:", error);
      toast("Erreur", {
        description: "Impossible de supprimer le client. Veuillez réessayer.",
      });
    }
  };

  const isDeleteEnabled = confirmationText === client.name;
  return (
    <TableRow>
      <TableCell className="font-medium">{client.name}</TableCell>
      <TableCell>
        {client.email && (
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
            {client.email}
          </div>
        )}
      </TableCell>
      <TableCell>
        {client.phone_number && (
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
            {client.phone_number}
          </div>
        )}
      </TableCell>
      <TableCell>
        {client.address && (
          <div className="flex items-start text-sm max-w-xs">
            <MapPin className="mr-2 h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <span className="break-words">{client.address}</span>
          </div>
        )}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {new Date(client.created_at).toLocaleDateString("fr-FR")}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/clients/${client.id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
                <AlertDialogDescription>
                  Êtes-vous sûr de vouloir supprimer le client "{client.name}" ?
                  Cette action est irréversible et supprimera également toutes
                  les inspections associées.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <label
                  htmlFor="confirmation-input"
                  className="text-sm font-medium"
                >
                  Pour confirmer, tapez le nom du client :{" "}
                  <span className="font-semibold text-foreground">
                    {client.name}
                  </span>
                </label>
                <Input
                  id="confirmation-input"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  placeholder={`Tapez "${client.name}" pour confirmer`}
                  className="mt-2"
                  disabled={isPending}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => {
                    setConfirmationText("");
                    setIsDialogOpen(false);
                  }}
                  disabled={isPending}
                >
                  Annuler
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDeleteClient(client.id)}
                  disabled={!isDeleteEnabled || isPending}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
                >
                  {isPending ? "Suppression..." : "Supprimer"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
