import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentSchema } from "./hooks.ts";
import { equipmentTypes } from "@modules/shared/types";
import { useCreateForm } from "@modules/shared/components";
import { Routes } from "@modules/shared/routes";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useDraftEquipment, useDraftStepManagement } from "../store";
import { z } from "zod";

export function EquipmentScreen() {
  const navigate = useNavigate();
  const { inspectionId } = useParams<{ inspectionId: string }>();
  const { equipment, setEquipment } = useDraftEquipment();
  const { markStepCompleted } = useDraftStepManagement();
  
  // Use stored equipment data as default values
  const defaultValues = {
    equipment_type: equipment?.equipment_type || "",
    equipment_number: equipment?.equipment_number || "",
    manufacturer: equipment?.manufacturer || "",
    model: equipment?.model || "",
    serial: equipment?.serial || "",
    capacity: equipment?.capacity || "",
    height_ft: equipment?.height_ft || undefined,
    ordered_by: equipment?.ordered_by || "",
    power_voltage: equipment?.power_voltage || "",
    control_voltage: equipment?.control_voltage || "",
    location_label: equipment?.location_label || "",
  };

  const { Form, createField } = useCreateForm(EquipmentSchema, { defaultValues });

  const handleSubmit = async (data: z.infer<typeof EquipmentSchema>) => {
    try {
      const equipmentData = {
        inspection_id: inspectionId || "",
        equipment_type: data.equipment_type,
        equipment_number: data.equipment_number || null,
        manufacturer: data.manufacturer || null,
        model: data.model || null,
        serial: data.serial || null,
        capacity: data.capacity || null,
        height_ft: data.height_ft || null,
        ordered_by: data.ordered_by || null,
        power_voltage: data.power_voltage || null,
        control_voltage: data.control_voltage || null,
        location_label: data.location_label || null,
      };

      // Store equipment data in the store
      setEquipment(equipmentData);

      // Mark equipment step as completed
      markStepCompleted(2); // Mark equipment step as completed

      toast.success("Équipement sauvegardé avec succès");
      navigate(`${Routes.INSPECTIONS_NEW.HOIST}/${inspectionId}`);
    } catch (error) {
      console.error("Error saving equipment:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la sauvegarde de l'équipement";
      toast.error(errorMessage);
    }
  };
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
        <Form className="space-y-6" submitHandler={handleSubmit}>
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
            <Button type="submit">
              Sauvegarder & Suivant
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
