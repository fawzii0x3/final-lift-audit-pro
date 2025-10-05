import { createContext } from "react";
import type { Optional } from "@modules/shared/types";
import type { User } from "@supabase/supabase-js";
import { useSignIn } from "@modules/shared/auth/hooks.tsx";

export interface AuthState {
  user: Optional<User>;
  loading: boolean;
  signIn: ReturnType<typeof useSignIn>["mutateAsync"];
  signOut: () => Promise<void>;
}
export const AuthContext = createContext<AuthState>({
  user: null,
  signIn: async () => {
    throw new Error("AuthProvider not mounted");
  },
  signOut: async () => {
    throw new Error("AuthProvider not mounted");
  },
  loading: true,
});
