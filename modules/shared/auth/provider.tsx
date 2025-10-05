import { type PropsWithChildren, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import type { Optional } from "../types";
import { useSignIn, useSignOut, useResetPassword } from "./hooks.tsx";
import { AuthContext } from "./context.tsx";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<Optional<User>>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const mutateSignIn = useSignIn();
  const mutateSignOut = useSignOut();
  const mutateResetPassword = useResetPassword();

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
        resetPassword: mutateResetPassword.mutateAsync,
      }}
    >
      {!loading ? children : `<div>Loading...</div>`}
    </AuthContext>
  );
}
