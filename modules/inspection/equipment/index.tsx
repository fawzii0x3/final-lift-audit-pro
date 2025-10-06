import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/image-upload";
import { EquipmentSchema } from "./hooks.ts";
import { equipmentTypes } from "@modules/shared/types";
import { useCreateForm } from "@modules/shared/components";

export function EquipmentScreen() {
  const { Form, createField } = useCreateForm(EquipmentSchema, {});
  const TypeField = createField("equipment_type", "select", {
    label: "Type d'équipement *",
    data: equipmentTypes.map((type) => ({
      label: type.label,
      value: type.value,
      key: type.value,
    })),
    placeholder: "Sélectionner le type d'équipement",
    readonly: false,
    disabled: false,
  });

  const EquipmentNumberField = createField("equipment_number", "text", {
    label: "Numéro de l'équipement",
    disabled: false,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Équipement</CardTitle>
      </CardHeader>
      <CardContent>
        <Form className="space-y-6" submitHandler={(_) => {}}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TypeField}
            {EquipmentNumberField}
            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="manufacturer"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Manufacturier</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}
            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="model"*/}
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
            {/*  name="serial"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Numéro de série</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="capacity"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Capacité</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input*/}
            {/*          placeholder="5, 10, 15, 5 tonnes, 10T..."*/}
            {/*          {...field}*/}
            {/*        />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="height_ft"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Hauteur (pi)</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input*/}
            {/*          type="number"*/}
            {/*          step="0.1"*/}
            {/*          min="0"*/}
            {/*          {...field}*/}
            {/*          onChange={(e) =>*/}
            {/*            field.onChange(*/}
            {/*              e.target.value*/}
            {/*                ? parseFloat(e.target.value)*/}
            {/*                : undefined,*/}
            {/*            )*/}
            {/*          }*/}
            {/*        />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="ordered_by"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Commandé par</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input {...field} />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="power_voltage"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Voltage de puissance</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input {...field} placeholder="480V" />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="control_voltage"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem>*/}
            {/*      <FormLabel>Voltage de commande</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input {...field} placeholder="120V" />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}

            {/*<FormField*/}
            {/*  control={form.control}*/}
            {/*  name="location_label"*/}
            {/*  render={({ field }) => (*/}
            {/*    <FormItem className="md:col-span-2">*/}
            {/*      <FormLabel>Emplacement</FormLabel>*/}
            {/*      <FormControl>*/}
            {/*        <Input {...field} placeholder="Building A, Bay 3" />*/}
            {/*      </FormControl>*/}
            {/*      <FormMessage />*/}
            {/*    </FormItem>*/}
            {/*  )}*/}
            {/*/>*/}
          </div>

          <div className="flex justify-end pt-6 border-t">
            {/*<Button*/}
            {/*  type="submit"*/}
            {/*  disabled={loading || form.formState.isSubmitting}*/}
            {/*>*/}
            {/*  {loading || form.formState.isSubmitting*/}
            {/*    ? "Sauvegarde..."*/}
            {/*    : "Sauvegarder & Suivant"}*/}
            {/*</Button>*/}
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
