import { useNavigate } from "react-router";
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
import { useCreateClient } from "@modules/shared/api";
import { useProfile } from "@modules/shared/api/profile";
import { Routes } from "@modules/shared/routes";
import { useCreateForm } from "@modules/shared/components/form/use-form";
import { z } from "zod";

const clientCreateSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  phone_number: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional().or(z.literal("")),
});

type ClientCreateForm = z.infer<typeof clientCreateSchema>;

export function CreateClient() {
  const navigate = useNavigate();
  const { mutateAsync: createClient, isPending } = useCreateClient();
  const { profile } = useProfile();

  const { createField, Form } = useCreateForm(clientCreateSchema, {
    defaultValues: {
      name: "",
      phone_number: "",
      address: "",
      email: "",
    },
  });

  const handleCreateClient = async (data: ClientCreateForm) => {
    try {
      if (!profile?.org_id) {
        throw new Error("Organization ID is required to create client");
      }

      await createClient({
        org_id: profile.org_id,
        name: data.name,
        phone_number: data.phone_number || null,
        address: data.address || null,
        email: data.email || null,
      });

      toast.success(`${data.name} has been added successfully.`);
      navigate(Routes.CLIENTS);
    } catch (error) {
      console.error("Error creating client:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create client. Please try again.";
      toast.error(errorMessage);
    }
  };

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
          <CardTitle>Ajouter un client</CardTitle>
          <CardDescription>
            Ajoutez un nouveau client à votre organisation. Vous pourrez créer
            des inspections pour ce client plus tard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form submitHandler={handleCreateClient} id="client-form" className="space-y-6">
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
              <Button type="submit" form="client-form" disabled={isPending}>
                <Save className="mr-2 h-4 w-4" />
                {isPending ? "Création..." : "Créer"}
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}