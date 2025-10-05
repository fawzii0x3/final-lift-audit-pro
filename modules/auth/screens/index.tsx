import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "@modules/shared/auth/context.tsx";
const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type AuthFormData = z.infer<typeof authSchema>;
export function Auth() {
  const [showPassword, setShowPassword] = useState(false);
  const { user, signIn, resetPassword, loading } = use(AuthContext);
  const navigate = useNavigate();
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);
  const onSubmit = async (data: AuthFormData) => {
    const { user } = await signIn(data);
    if (user) {
      navigate("/");
    }
  };
  const handleForgotPassword = async (email: string) => {
    if (!email) {
      return;
    }
    const success = await resetPassword(email);
    if (success) {
      setResetEmailSent(true);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: "url(/bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Enhanced gradient overlay with depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/40 via-gray-800/30 to-slate-900/40"></div>

      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-md shadow-2xl relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
        <CardHeader className="text-center pb-8 bg-gradient-to-br from-white/10 to-white/5 rounded-t-3xl border-b border-white/20 relative overflow-hidden">
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] animate-shine"></div>

          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg transform transition-all duration-300 hover:scale-105">
              <img
                src={"/company-logo.png"}
                alt="Servitech Logo"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white drop-shadow-xl mb-2">
            Pont Roulant Servi-Tech
          </CardTitle>
          <CardDescription className="text-white/90 font-medium drop-shadow-lg text-lg">
            Application d'inspection digitale
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-gradient-to-br from-white/5 to-transparent">
          {resetEmailSent ? (
            <div className="text-center space-y-6">
              <div className="p-6 bg-green-500/20 border border-green-400/30 rounded-2xl backdrop-blur-sm shadow-lg">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-green-100"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-green-100 font-medium text-lg">
                  Un email de réinitialisation a été envoyé à votre adresse
                  email.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => setResetEmailSent(false)}
                className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 transition-all duration-300 py-3 rounded-xl font-medium"
              >
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-white font-semibold text-sm uppercase tracking-wide"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/60 focus:ring-white/30 rounded-xl py-3 px-4 transition-all duration-300 hover:bg-white/15"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-300 font-medium">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-white font-semibold text-sm uppercase tracking-wide"
                >
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Entrez votre mot de passe"
                    className="bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-white/60 focus:ring-white/30 rounded-xl py-3 px-4 pr-12 transition-all duration-300 hover:bg-white/15"
                    {...register("password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-white/20 text-white/70 hover:text-white rounded-lg transition-all duration-200"
                    style={{
                      filter: "drop-shadow(0 0 2px rgba(0, 0, 0, 0.8))",
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-300 font-medium">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="link"
                  className="px-0 text-sm text-white/80 hover:text-white font-medium transition-colors duration-200"
                  onClick={() => {
                    const email = document.getElementById(
                      "email",
                    ) as HTMLInputElement;
                    handleForgotPassword(email?.value);
                  }}
                >
                  Mot de passe oublié ?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white border border-white/30 font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Connexion...
                  </div>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
