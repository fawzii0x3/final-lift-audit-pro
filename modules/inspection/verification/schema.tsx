import z from "zod";

export const checkItemSchema = z.object({
  item_key: z.string(), // Accept any string for custom items
  component: z.enum(["equipment", "palan", "chariot"]),
  component_position: z.coerce.number().int().nonnegative().optional(), // Align with database number type
  component_name: z.string().optional(),
  component_type: z.enum(["hoist", "trolley", "equipment"]).optional(),
  component_id: z.string().uuid().optional(),
  status: z.enum(["unchecked", "checked_ok", "issue"]),
  problem_type: z.string().optional(),
  comment: z.string().optional(),
  is_valid: z.boolean().default(true).optional(),
  validation_image_path: z.string().optional(),
  validation_comment: z.string().optional(),
});

export const checkListSchema = z.object({
  items: z.array(checkItemSchema),
});
