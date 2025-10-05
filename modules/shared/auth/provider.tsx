import { type PropsWithChildren, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import type { Optional } from "../types";
import { useSignIn, useSignOut } from "./hooks.tsx";
import { AuthContext } from "./context.tsx";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Optional<User>>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mutateSignIn = useSignIn();
  const mutateSignOut = useSignOut();

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user);
      setLoading(false);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext
      value={{
        loading,
        user,
        signIn: mutateSignIn.mutateAsync,
        signOut: mutateSignOut.mutateAsync,
      }}
    >
      {!loading ? children : `<div>Loading...</div>`}
    </AuthContext>
  );
}
