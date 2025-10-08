import type { Tables } from "../supabase";
import { supabase } from "../supabase";
import type { Optional } from "../types";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "./const.ts";
import { use } from "react";
import { AuthContext } from "../auth/context.tsx";

interface ProfileProps {
  userId: Optional<string>;
}
type UserProfile = Tables<"profiles">;

type ProfileRoles = "admin" | "technician" | "client";

const roleMaps: Record<string, ProfileRoles> = {
  org_admin: "admin",
  org_technician: "technician",
  org_client: "client",
};

interface fetchProfileResponse {
  profile: UserProfile | null;
  needsOnboarding: boolean;
}

async function fetchProfile({
  userId,
}: ProfileProps): Promise<fetchProfileResponse> {
  const result: fetchProfileResponse = {
    profile: null,
    needsOnboarding: false,
  };
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

export function useProfile() {
  const { user } = use(AuthContext);
  const userId = user?.id;
  const { data, ...result } = useQuery({
    queryKey: [QueryKeys.PROFILE, { userId }],
    queryFn: async () => {
      return fetchProfile({ userId: userId });
    },
    enabled: !!userId,
  });
  const profile = data?.profile;
  const needsOnboarding = data?.needsOnboarding;
  return {
    profile,
    needsOnboarding,
    ...result,
  };
}

export function useOrgId() {
  const { profile } = useProfile();
  return profile?.org_id;
}

export function useUserRole(): ProfileRoles | null {
  const { profile } = useProfile();
  if (!profile?.role) {
    return null;
  }
  const role = profile.role;
  return roleMaps[role] ?? null;
}
