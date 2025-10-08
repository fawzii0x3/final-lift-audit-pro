import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RenderClient } from "./render-client";
import { useNavigate } from "react-router";
import { useClients } from "@modules/shared/api";
import { EmptyList } from "@modules/shared/components";

export function ClientScreen() {
  const navigate = useNavigate();

  const { clients, isLoading } = useClients();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clients</h1>
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
        <h1 className="text-3xl font-bold">Clients</h1>
        <Button onClick={() => navigate("/clients/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>
      {clients.length === 0 ? (
        <EmptyList />
      ) : (
        <div className="bg-card rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Adresse</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <RenderClient client={client} key={client.id} />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
