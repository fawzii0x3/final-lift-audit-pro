import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { QueryKeys } from "./const";
import type { Optional } from "@modules/shared/types";
import { ensureArray } from "@modules/shared/helpers";

export function useTrolleysByInspectionId(inspectionId: Optional<string>) {
  const { data, ...query } = useQuery({
    queryKey: [QueryKeys.INSPECTION_TROLLEYS, { inspectionId }],
    queryFn: async () => {
      if (!inspectionId) {
        throw new Error("No inspection ID provided");
      }
      const { data, error } = await supabase
        .from("inspection_trolleys")
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
  const trolleys = ensureArray(data);
  return { trolleys, ...query };
}
