import { useOrgId } from "./profile.tsx";
import { QueryKeys } from "./const.ts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { ensureArray } from "@modules/shared/helpers";

export function useTechnicians() {
  const orgId = useOrgId();
  const query = useQuery({
    queryKey: [QueryKeys.TECHNICIANS, "org", orgId],
    queryFn: async () => {
      if (!orgId) {
        throw new Error("Organization ID is required to fetch technicians");
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "org_technician")
        .eq("org_id", orgId);
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!orgId,
  });
  const technicians = ensureArray(query.data);
  return {
    technicians,
    ...query,
  };
}

export function useDeleteTechnician() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (technicianId: string) => {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", technicianId);
      if (error) {
        throw error;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.TECHNICIANS] });
    },
  });
}

export type UseTechniciansReturn = ReturnType<typeof useTechnicians>;
export type Technician = UseTechniciansReturn["technicians"][number];
