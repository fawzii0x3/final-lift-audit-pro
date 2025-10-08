import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { HoistsSchema } from "@modules/inspection/hoists/schema.tsx";
import { useCreateArrayForm } from "@modules/shared/components";
import { useDraftHoists, useDraftStepManagement } from "../store";
import { useNavigate, useParams } from "react-router";
import { Routes } from "@modules/shared/routes";
import { toast } from "sonner";

export function HoistScreen() {
  const navigate = useNavigate();
  const { inspectionId } = useParams<{ inspectionId: string }>();
  const { hoists, setHoists } = useDraftHoists();
  const { markStepCompleted } = useDraftStepManagement();
  
  // Use stored hoists data as default values
  const defaultValues = {
    entries: hoists && hoists.length > 0 ? hoists.map(hoist => ({
      position: (hoist.position?.toString() as "1" | "2") || "1",
      hoist_type: (hoist.hoist_type as "palan_à_câble" | "palan_à_chaîne" | undefined) || undefined,
      capacity: hoist.capacity || "",
      manufacturer: hoist.manufacturer || "",
      model: hoist.model || "",
      serial: hoist.serial || "",
      image_path: undefined, // Not in database schema
    })) : [
      {
        position: "1" as const,
        hoist_type: undefined,
        capacity: "",
        manufacturer: "",
        model: "",
        serial: "",
        image_path: undefined,
      },
    ],
  };

  const { useArrayField, createArrayField, Form } = useCreateArrayForm(
    HoistsSchema,
    { defaultValues },
  );
  const { fields, append, remove } = useArrayField("entries");
  
  const handleSubmit = async (data: any) => {
    try {
      const hoistsData = data.entries.map((entry: any) => ({
        inspection_id: inspectionId || "",
        position: entry.position,
        hoist_type: entry.hoist_type || null,
        capacity: entry.capacity || null,
        manufacturer: entry.manufacturer || null,
        model: entry.model || null,
        serial: entry.serial || null,
        image_path: entry.image_path || null,
      }));

      // Store hoists data in the store
      setHoists(hoistsData);

      // Mark hoists step as completed
      markStepCompleted(3); // Mark hoists step as completed

      toast.success("Palans sauvegardés avec succès");
      navigate(Routes.INSPECTIONS_NEW.TROLLEY.replace(':inspectionId', inspectionId || ''));
    } catch (error) {
      console.error("Error saving hoists:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la sauvegarde des palans";
      toast.error(errorMessage);
    }
  };

  const addHoist = () => {
    if (fields.length < 2) {
      const position = fields.length === 0 ? "1" : "2";
      append({
        position: position as "1" | "2",
        hoist_type: undefined,
        capacity: "",
        manufacturer: "",
        model: "",
        serial: "",
        image_path: undefined,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Palans</CardTitle>
        <CardDescription>
          Ajoutez les informations du palan (maximum 2 palans).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form submitHandler={handleSubmit} className="space-y-6">
          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun palan ajouté pour le moment.</p>
              <Button
                type="button"
                variant="outline"
                onClick={addHoist}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier palan
              </Button>
            </div>
          )}
          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Palan {index + 1}</CardTitle>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {createArrayField("entries", index, "hoist_type", "select", {
                    disabled: false,
                    readonly: false,
                    placeholder: "Sélectionner le type",
                    label: "Type de palan",
                    data: [
                      {
                        value: "palan_à_câble",
                        label: "Palan à câble",
                        key: "palan_à_câble",
                      },
                      {
                        value: "palan_à_chaîne",
                        label: "Palan à chaîne",
                        key: "palan_à_chaîne",
                      },
                    ],
                  })}
                  {createArrayField("entries", index, "capacity", "text", {
                    label: "Capacité",
                    placeholder: "5 t, 10 t, etc.",
                    disabled: false,
                  })}
                  {createArrayField("entries", index, "manufacturer", "text", {
                    label: "Fabricant",
                    disabled: false,
                  })}
                  {createArrayField("entries", index, "model", "text", {
                    label: "Modèle",
                    disabled: false,
                  })}
                  <div className="md:col-span-2">
                    {createArrayField("entries", index, "serial", "text", {
                      label: "N° de série",
                      disabled: false,
                    })}
                  </div>
                  <div className="md:col-span-2">
                    {createArrayField("entries", index, "image_path", "text", {
                      label: "Photo de la plaque signalétique",
                      disabled: false,
                      placeholder: "URL de l'image",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {fields.length > 0 && fields.length < 2 && (
            <Button
              type="button"
              variant="outline"
              onClick={addHoist}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter le deuxième palan
            </Button>
          )}
          <div className="flex justify-end pt-6 border-t">
            {/*<Button*/}
            {/*  type="submit"*/}
            {/*  disabled={loading || form.formState.isSubmitting}*/}
            {/*>*/}
            {/*  {loading || form.formState.isSubmitting*/}
            {/*    ? "Enregistrement..."*/}
            {/*    : "Enregistrer et continuer"}*/}
            {/*</Button>*/}
            <Button type="submit">Enregistrer et continuer</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
