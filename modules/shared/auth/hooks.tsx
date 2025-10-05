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
//   const resetPassword = async (email: string) => {
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/reset-password`,
//       });
//
//       if (error) {
//         toast({
//           title: "Erreur",
//           description: error.message,
//           variant: "destructive",
//         });
//         return { error };
//       }
//
//       toast({
//         title: "Email envoyé",
//         description:
//           "Un email de réinitialisation a été envoyé à votre adresse.",
//       });
//
//       return { error: null };
//     } catch (error) {
//       return { error };
//     }
//   };
export function useResetPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return !error;
    },
    onSuccess: () => {
      toast.success("Reset email sent");
    },
    onError: () => {
      toast.error("Error sending reset email");
    },
  });
}
