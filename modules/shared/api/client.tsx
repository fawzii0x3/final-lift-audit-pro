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

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: {
      org_id: string;
      name: string;
      phone_number?: string | null;
      address?: string | null;
      email?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("clients")
        .insert([clientData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CLIENTS] });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientData: {
      id: string;
      name: string;
      phone_number?: string | null;
      address?: string | null;
      email?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("clients")
        .update({
          name: clientData.name,
          phone_number: clientData.phone_number,
          address: clientData.address,
          email: clientData.email,
        })
        .eq("id", clientData.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.CLIENTS] });
    },
  });
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
