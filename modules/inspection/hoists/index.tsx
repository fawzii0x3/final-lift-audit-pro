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

export function HoistScreen() {
  const { useArrayField, createArrayField, Form } = useCreateArrayForm(
    HoistsSchema,
    {
      defaultValues: {
        entries: [
          {
            position: "1",
            hoist_type: undefined,
            capacity: "",
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
        <Form submitHandler={() => {}} className="space-y-6">
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
                  <CardTitle className="text-lg">
                    Palan {field.position}
                  </CardTitle>
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
                    "hoist_type",
                    "select",
                    {
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
                    },
                    index,
                  )}
                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name={`entries.${index}.capacity`}*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <FormItem>*/}
                  {/*      <FormLabel>Capacité</FormLabel>*/}
                  {/*      <FormControl>*/}
                  {/*        <Input {...field} placeholder="5 t, 10 t, etc." />*/}
                  {/*      </FormControl>*/}
                  {/*      <FormMessage />*/}
                  {/*    </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}

                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name={`entries.${index}.manufacturer`}*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <FormItem>*/}
                  {/*      <FormLabel>Fabricant</FormLabel>*/}
                  {/*      <FormControl>*/}
                  {/*        <Input {...field} />*/}
                  {/*      </FormControl>*/}
                  {/*      <FormMessage />*/}
                  {/*    </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}

                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name={`entries.${index}.model`}*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <FormItem>*/}
                  {/*      <FormLabel>Modèle</FormLabel>*/}
                  {/*      <FormControl>*/}
                  {/*        <Input {...field} />*/}
                  {/*      </FormControl>*/}
                  {/*      <FormMessage />*/}
                  {/*    </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}

                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name={`entries.${index}.serial`}*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <FormItem className="md:col-span-2">*/}
                  {/*      <FormLabel>N° de série</FormLabel>*/}
                  {/*      <FormControl>*/}
                  {/*        <Input {...field} />*/}
                  {/*      </FormControl>*/}
                  {/*      <FormMessage />*/}
                  {/*    </FormItem>*/}
                  {/*  )}*/}
                  {/*/>*/}

                  {/*<FormField*/}
                  {/*  control={form.control}*/}
                  {/*  name={`entries.${index}.image_path`}*/}
                  {/*  render={({ field }) => {*/}
                  {/*    // Get the current entry's position and find corresponding hoist ID*/}
                  {/*    const currentEntry = form.getValues(`entries.${index}`);*/}
                  {/*    const currentHoist = existingHoists.find(*/}
                  {/*      (hoist) =>*/}
                  {/*        hoist.position ===*/}
                  {/*        parseInt(currentEntry.position || "1"),*/}
                  {/*    );*/}

                  {/*    return (*/}
                  {/*      <FormItem className="md:col-span-2">*/}
                  {/*        <FormLabel>Photo de la plaque signalétique</FormLabel>*/}
                  {/*        <FormControl>*/}
                  {/*          <ImageUpload*/}
                  {/*            value={field.value}*/}
                  {/*            onChange={field.onChange}*/}
                  {/*            disabled={loading}*/}
                  {/*            inspectionId={inspectionId}*/}
                  {/*            context={`hoist_${currentEntry.position || "1"}`}*/}
                  {/*            hoistId={currentHoist?.id}*/}
                  {/*            onUploaded={() => onAutoSave?.(form.getValues())}*/}
                  {/*          />*/}
                  {/*        </FormControl>*/}
                  {/*        <FormMessage />*/}
                  {/*      </FormItem>*/}
                  {/*    );*/}
                  {/*  }}*/}
                  {/*/>*/}
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
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
