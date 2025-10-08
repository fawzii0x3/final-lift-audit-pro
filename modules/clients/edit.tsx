import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useUpdateClient, useClients } from "@modules/shared/api";
import { Routes } from "@modules/shared/routes";
import { useCreateForm } from "@modules/shared/components/form/use-form";
import { z } from "zod";
import { useEffect } from "react";

const clientEditSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
});

type ClientEditForm = z.infer<typeof clientEditSchema>;

export function EditClient() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { mutateAsync: updateClient, isPending } = useUpdateClient();
  const { clients, isLoading } = useClients();

  const { createField, Form, form } = useCreateForm(clientEditSchema, {
    defaultValues: {
      name: "",
      phone_number: "",
      address: "",
      email: "",
    },
  });

  // Find the client to edit
  const client = clients.find((c) => c.id === id);

  // Populate form with client data when available
  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name || "",
        phone_number: client.phone_number || "",
        address: client.address || "",
        email: client.email || "",
      });
    }
  }, [client, form]);

  const handleUpdateClient = async (data: ClientEditForm) => {
    if (!id) {
      toast.error("Client ID is required");
      return;
    }

    try {
      await updateClient({
        id,
        name: data.name,
        phone_number: data.phone_number || null,
        address: data.address || null,
        email: data.email || null,
      });

      toast.success(`${data.name} has been updated successfully.`);
      navigate(Routes.CLIENTS);
    } catch (error) {
      console.error("Error updating client:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to update client. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(Routes.CLIENTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux clients
          </Button>
        </div>
        <div className="animate-pulse">
          <div className="bg-muted rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(Routes.CLIENTS)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux clients
          </Button>
        </div>
        <Card className="max-w-2xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Client not found</h3>
              <p className="text-muted-foreground mb-4">
                The client you're looking for doesn't exist or has been deleted.
              </p>
              <Button onClick={() => navigate(Routes.CLIENTS)}>
                Return to Clients
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(Routes.CLIENTS)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux clients
        </Button>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Modifier le client</CardTitle>
          <CardDescription>
            Modifiez les informations du client {client.name}.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form submitHandler={handleUpdateClient} id="client-edit-form" className="space-y-6">
            {createField("name", "text", {
              label: "Nom du client *",
              placeholder: "Nom du client",
              disabled: isPending,
            })}

            {createField("phone_number", "text", {
              label: "Téléphone",
              placeholder: "(514) 555-0123",
              disabled: isPending,
            })}

            {createField("email", "text", {
              label: "Email",
              placeholder: "contact@exemple.com",
              disabled: isPending,
            })}

            {createField("address", "text", {
              label: "Adresse",
              placeholder: "123 Boulevard Industriel, Montréal, QC H3B 1A1",
              disabled: isPending,
            })}

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(Routes.CLIENTS)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button type="submit" form="client-edit-form" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Mise à jour..." : "Mettre à jour"}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
