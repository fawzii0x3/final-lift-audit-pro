import { z } from "zod";

export const trolleyEntrySchema = z.object({
  position: z.enum(["1", "2"]),
  trolley_type: z.enum(["top_run", "under_run"]).optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serial: z.string().optional(),
  image_path: z.string().optional(),
});

export const trolleyEntriesSchema = z.object({
  entries: z.array(trolleyEntrySchema).max(2, "Maximum 2 trolleys allowed"),
});
