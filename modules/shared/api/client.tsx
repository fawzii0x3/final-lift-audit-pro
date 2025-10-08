import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QueryKeys } from "./const";
import { supabase } from "../supabase";
import { useOrgId } from "./profile.tsx";
import { ensureArray } from "../helpers";

export function useClients() {
  const orgId = useOrgId();
  const result = useQuery({
    queryKey: [QueryKeys.CLIENTS, { orgId }],
    queryFn: async () => {
      if (!orgId) {
        throw new Error("Organization ID is required to fetch clients");
      }
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("org_id", orgId)
        .order("name", { ascending: false });
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!orgId,
  });
  const clients = ensureArray(result.data);
  return {
    clients,
    ...result,
  };
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) {
        return false;
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CLIENTS] });
    },
  });
}

export type UseClientsReturn = ReturnType<typeof useClients>;
export type Clients = UseClientsReturn["clients"][number];
