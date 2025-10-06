import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

import { trolleyEntriesSchema } from "./schema";
import { useCreateArrayForm } from "@modules/shared/components";

export function TrolleyScreen() {
  const { Form, useArrayField, createArrayField } = useCreateArrayForm(
    trolleyEntriesSchema,
    {
      defaultValues: {
        entries: [
          {
            position: "1",
            trolley_type: undefined,
            manufacturer: "",
            model: "",
            serial: "",
            image_path: undefined,
          },
        ],
      },
    },
  );

  const { fields, append, remove } = useArrayField("entries");

  const onSubmit = async (formData: unknown) => {
    console.log("Form submitted:", formData);
  };

  const addTrolley = () => {
    if (fields.length < 2) {
      const position = fields.length === 0 ? "1" : "2";
      append({
        position: position as "1" | "2",
        trolley_type: undefined,
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
        <CardTitle>Chariots</CardTitle>
        <CardDescription>
          Ajoutez les informations du chariot (maximum 2 chariots).
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form submitHandler={onSubmit} className="space-y-6">
          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Aucun chariot ajouté pour le moment.</p>
              <Button
                type="button"
                variant="outline"
                onClick={addTrolley}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier chariot
              </Button>
            </div>
          )}

          {fields.map((field, index) => (
            <Card key={field.id} className="relative">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Chariot {index + 1}</CardTitle>
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
                  {createArrayField(
                    "entries",
                    index,
                    "trolley_type",
                    "select",
                    {
                      label: "Type de chariot",
                      placeholder: "Sélectionner le type",
                      disabled: false,
                      readonly: false,
                      data: [
                        {
                          value: "top_run",
                          label: "Top run",
                          key: "top_run",
                        },
                        {
                          value: "under_run",
                          label: "Under run",
                          key: "under_run",
                        },
                      ],
                    },
                  )}
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
              onClick={addTrolley}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Ajouter le deuxième chariot
            </Button>
          )}

          <div className="flex justify-end pt-6 border-t">
            <Button type="submit">Enregistrer et continuer</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
