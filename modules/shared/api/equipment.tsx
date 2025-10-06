import { useQuery } from "@tanstack/react-query";
import type { Optional } from "../types";
import { supabase } from "../supabase";
import { QueryKeys } from "./const";

export function useEquipmentByInspectionId(inspectionId: Optional<string>) {
  const { data, ...query } = useQuery({
    queryKey: [QueryKeys.INSPECTION_EQUIPMENT, { inspectionId }],
    queryFn: async () => {
      if (!inspectionId) {
        throw new Error("No inspection ID provided");
      }
      const { data, error } = await supabase
        .from("inspection_equipment")
        .select("*")
        .eq("inspection_id", inspectionId)
        .single();
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!inspectionId,
  });
  return { equipment: data, ...query };
}
