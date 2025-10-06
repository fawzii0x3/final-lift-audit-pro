import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, type TablesInsert } from "../supabase";
import { QueryKeys } from "./const";

export type InspectionCheckItemsInsert = TablesInsert<"inspection_check_items">;
export type InspectionsInsert = TablesInsert<"inspections">;

export function useCreateInspection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inspection: InspectionsInsert) => {
      const { data, error } = await supabase
        .from("inspections")
        .insert(inspection)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: [QueryKeys.INSPECTIONS],
      });
      await queryClient.invalidateQueries({
        queryKey: ["inspections", "client", data.client_id],
      });
    },
  });
}

export const useCreateInspectionCheckItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: InspectionCheckItemsInsert) => {
      const { data, error } = await supabase
        .from("inspection_check_items")
        .insert(item)
        .select()
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["inspection_check_items"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["inspection_check_items", "inspection", data.inspection_id],
      });
    },
  });
};
