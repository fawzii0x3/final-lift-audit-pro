import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import z from "zod";
import { useCreateForm } from "@modules/shared/components/form/use-form.tsx";
import { useTechnicians, useClients } from "@modules/shared/api";
import { DraftInspectionSchema, useCreatDraftInspection } from "./hooks";

export function ClientInfo() {
  const { clients, isLoading: clientsLoading } = useClients();
  const { technicians, isLoading: profilesLoading } = useTechnicians();

  const loadingData = clientsLoading || profilesLoading;

  const { createField, Form } = useCreateForm(DraftInspectionSchema, {});
  const { createDraftInspection, isPending } = useCreatDraftInspection();
  const ClientIdField = createField("client_id", "select", {
    data: clients.map((client) => ({
      label: client.name,
      value: client.id,
      key: client.id,
    })),
    placeholder: "Sélectionner un client (optionnel)",
    label: "Client",
    disabled: false,
    readonly: false,
  });

  const TechnicianIdField = createField("technician_id", "select", {
    data: technicians.map((tech) => ({
      label: tech.display_name,
      value: tech.id,
      key: tech.id,
    })),
    placeholder: "Sélectionner un technicien",
    label: "Technicien",
    disabled: false,
    readonly: false,
  });
  const DateField = createField("scheduled_date", "date", {
    label: "Date d'inspection *",
    placeholder: "Sélectionner une date",
    disabled: false,
    readonly: false,
    minDate: undefined,
    maxDate: new Date("2100-01-01"),
  });
  async function handleSubmit(data: z.infer<typeof DraftInspectionSchema>) {
    await createDraftInspection(data);
  }

  if (loadingData) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Renseignements du Client</CardTitle>
      </CardHeader>
      <CardContent>
        <Form submitHandler={handleSubmit}>
          <div className="space-y-6">
            {ClientIdField}
            {TechnicianIdField}
            {DateField}
            <div className="flex justify-end pt-6 border-t">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Création..." : "Sauvegarder & Suivant"}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
