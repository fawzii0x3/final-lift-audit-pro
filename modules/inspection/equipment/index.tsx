import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const ManufacturerField = createField("manufacturer", "text", {
    label: "Manufacturier",
    disabled: false,
  });

  const ModelField = createField("model", "text", {
    label: "Modèle",
    disabled: false,
  });

  const SerialField = createField("serial", "text", {
    label: "Numéro de série",
    disabled: false,
  });

  const CapacityField = createField("capacity", "text", {
    label: "Capacité",
    placeholder: "5, 10, 15, 5 tonnes, 10T...",
    disabled: false,
  });

  const HeightFtField = createField("height_ft", "text", {
    label: "Hauteur (pi)",
    type: "number",
    step: "0.1",
    min: "0",
    disabled: false,
  });

  const OrderedByField = createField("ordered_by", "text", {
    label: "Commandé par",
    disabled: false,
  });

  const PowerVoltageField = createField("power_voltage", "text", {
    label: "Voltage de puissance",
    placeholder: "480V",
    disabled: false,
  });

  const ControlVoltageField = createField("control_voltage", "text", {
    label: "Voltage de commande",
    placeholder: "120V",
    disabled: false,
  });

  const LocationLabelField = createField("location_label", "text", {
    label: "Emplacement",
    placeholder: "Building A, Bay 3",
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
            {ManufacturerField}
            {ModelField}
            {SerialField}
            {CapacityField}
            {HeightFtField}
            {OrderedByField}
            {PowerVoltageField}
            {ControlVoltageField}
            <div className="md:col-span-2">{LocationLabelField}</div>
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
            <Button type="submit">Sauvegarder & Suivant</Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
