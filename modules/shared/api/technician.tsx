import { useOrgId } from "./profile.tsx";
import { QueryKeys } from "./const.ts";
import { useQuery } from "@tanstack/react-query";
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
