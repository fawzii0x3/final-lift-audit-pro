import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";
import { useNavigate } from "react-router";

export function EmptyList() {
  const navigate = useNavigate();
  return (
    <div className="text-center py-12 bg-muted/20 rounded-lg">
      <User className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">Aucun client</h3>
      <p className="text-muted-foreground mb-4">
        Commencez par ajouter votre premier client pour créer des inspections.
      </p>
      <Button onClick={() => navigate("/clients/new")}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un client
      </Button>
    </div>
  );
}
