import type { Tables } from "../supabase";
import { supabase } from "../supabase";
import type { Optional } from "../types";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./const.ts";

interface ProfileProps {
  userId: Optional<string>;
}
type UserProfile = Tables<"profiles">;
interface fetchProfileResponse {
  profile: UserProfile | null;
  needsOnboarding: boolean;
}

async function fetchProfile({
  userId,
}: ProfileProps): Promise<fetchProfileResponse> {
  const result: fetchProfileResponse = { profile: null, needsOnboarding: true };
  if (!userId) {
    throw new Error("User ID is required to fetch profile");
  }
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Error fetching profile:", profileError);
    result.needsOnboarding = true;
  }
  if (!profileData) {
    result.needsOnboarding = true;
  } else {
    result.profile = profileData;
  }
  return result;
}

export function useProfile({ userId }: ProfileProps) {
  return useQuery({
    queryKey: [QueryKeys.PROFILE, { userId }],
    queryFn: async () => {
      return fetchProfile({ userId: userId });
    },
    enabled: !!userId,
  });
}
