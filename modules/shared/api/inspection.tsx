import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase, type TablesInsert, type Database } from "../supabase";
import { QueryKeys } from "./const";
import { toast } from "sonner";
import { ensureArray } from "@modules/shared/helpers";

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

export function useCreateInspectionEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (equipmentData: Database["public"]["Tables"]["inspection_equipment"]["Insert"]) => {
      const { data, error } = await supabase
        .from("inspection_equipment")
        .insert(equipmentData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.INSPECTIONS] });
    },
  });
}

export function useDeleteInspection() {
  return useMutation({
    mutationFn: async (inspectionId: string) => {
      const { error } = await supabase
        .from("inspections")
        .delete()
        .eq("id", inspectionId);
      if (error) {
        throw error;
      }
      return inspectionId;
    },
    onSuccess: () => {
      toast.success("Inspection supprimée avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression de l'inspection");
    },
  });
}

export function useInspectionsList() {
  const { data, ...query } = useQuery({
    queryKey: [QueryKeys.INSPECTIONS],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inspections")
        .select(
          `
          *,
          client:clients(name, address, phone_number, email),
          technician:profiles!inspections_technician_id_fkey(display_name),
          equipment:inspection_equipment(equipment_number)
      `,
        )
        .order("updated_at", { ascending: false });
      if (error) {
        throw error;
      }
      return data;
    },
  });
  const inspections = ensureArray(data);
  return { inspections, ...query };
}

export type InspectionsType = ReturnType<
  typeof useInspectionsList
>["inspections"][number];
