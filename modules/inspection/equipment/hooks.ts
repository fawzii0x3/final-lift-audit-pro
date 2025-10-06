import { z } from "zod";
export const EquipmentSchema = z.object({
  equipment_type: z.enum([
    "pont_roulant",
    "pont_roulant_double_palan",
    "monorail",
    "gantry",
    "semigantry",
    "potence",
    "palan_electrique",
    "palan_manuel",
  ]),
  equipment_number: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  capacity: z.string().optional(),
  height_ft: z.coerce
    .number()
    .positive("Height must be a positive number")
    .optional(),
  ordered_by: z.string().optional(),
  power_voltage: z.string().optional(),
  control_voltage: z.string().optional(),
  location_label: z.string().optional(),
  image_path: z.string().optional(),
});
