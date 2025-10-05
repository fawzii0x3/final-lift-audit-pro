import { useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { toast } from "sonner";

export function useSignIn() {
  return useMutation({
    mutationFn: async (props: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        ...props,
      });
      if (error) {
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast.success("Welcome back!");
    },
    onError: () => {
      toast.error("Error signing in");
    },
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      return;
    },
    onSuccess: () => {
      toast.success("Signed out successfully");
    },
    onError: () => {
      toast.error("Error signing out");
    },
  });
}
