import { z } from "zod";

export const hoistEntrySchema = z.object({
  position: z.enum(["1", "2"]),
  hoist_type: z.enum(["palan_à_câble", "palan_à_chaîne"]).optional(),
  capacity: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  image_path: z.string().optional(),
});

export const HoistsSchema = z.object({
  entries: z.array(hoistEntrySchema).max(2, "Maximum 2 hoists allowed"),
});
