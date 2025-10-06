import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { QueryKeys } from "./const";
import type { Optional } from "@modules/shared/types";
import { ensureArray } from "@modules/shared/helpers";

export const useHoistsByInspection = (inspectionId: Optional<string>) => {
  const { data, ...query } = useQuery({
    queryKey: [QueryKeys.INSPECTION_HOISTS, { inspectionId }],
    queryFn: async () => {
      if (!inspectionId) {
        throw new Error("No inspection ID provided");
      }
      const { data, error } = await supabase
        .from("inspection_hoists")
        .select("*")
        .eq("inspection_id", inspectionId)
        .order("position", { ascending: true });
      if (error) {
        throw error;
      }
      return data;
    },
    enabled: !!inspectionId,
  });
  const hoists = ensureArray(data);
  return { hoists, ...query };
};
