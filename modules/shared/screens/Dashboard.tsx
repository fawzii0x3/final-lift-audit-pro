import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList, Users, UserCog } from "lucide-react";
import { useNavigate } from "react-router";
import { use } from "react";
import { AuthContext } from "../auth/context";
import { useProfile } from "../api";

export function Dashboard() {
  const { user } = use(AuthContext);
  const { profile } = useProfile();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Nouvelle inspection",
      description: "Créer une nouvelle inspection",
      icon: Plus,
      action: () => navigate("/inspections/new"),
      color: "bg-primary text-primary-foreground",
    },
    {
      title: "Inspections",
      description: "Voir toutes les inspections",
      icon: ClipboardList,
      action: () => navigate("/inspections"),
      color: "bg-secondary text-secondary-foreground",
    },
    {
      title: "Clients",
      description: "Gérer les clients",
      icon: Users,
      action: () => navigate("/clients"),
      color: "bg-accent text-accent-foreground",
    },
    {
      title: "Techniciens",
      description: "Voir les techniciens",
      icon: UserCog,
      action: () => navigate("/technicians"),
      color: "bg-muted text-muted-foreground",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue, {profile?.display_name || user?.email}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-2">
              <div
                className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-2`}
              >
                <action.icon className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-start p-0"
                onClick={action.action}
              >
                Accèder →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
