import { use } from "react";
import { AuthContext } from "@modules/shared/auth/context.tsx";
import { useOrgId } from "@modules/shared/api";
import { useCreateInspection } from "@modules/shared/api/inspection.tsx";
import z from "zod";
import { toast } from "sonner";

export const DraftInspectionSchema = z.object({
  client_id: z.string().uuid("Please select a client").or(z.literal("")),
  technician_id: z.string().uuid().optional().or(z.literal("")),
  scheduled_date: z.string().min(1, "Please select a date"),
});

// eslint-disable-next-line react-refresh/only-export-components
export function useCreatDraftInspection() {
  const { user } = use(AuthContext);
  const orgId = useOrgId();
  const { mutateAsync, isPending } = useCreateInspection();

  async function createDraftInspection(
    data: z.infer<typeof DraftInspectionSchema>,
  ) {
    if (!orgId) {
      toast.error("Organization ID is required to create an inspection");
      throw new Error("Organization ID is required to create an inspection");
    }
    if (!user?.id) {
      toast.error("User ID is required to create an inspection");
      throw new Error("User ID is required to create an inspection");
    }
    return await mutateAsync({
      status: "draft",
      org_id: orgId,
      client_id: data.client_id,
      technician_id: data.technician_id || null,
      scheduled_date: data.scheduled_date,
      created_by: user.id,
    });
  }
  return { createDraftInspection, isPending };
}
