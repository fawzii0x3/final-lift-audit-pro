import { type PropsWithChildren, use } from "react";
import { AuthContext } from "./context.tsx";
import { useProfile } from "../api/profile.tsx";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading: authLoading } = use(AuthContext);
  const { data, isLoading: profileLoading } = useProfile({ userId: user?.id });
  const needsOnboarding = data ? !data.needsOnboarding : false;
  const loading = authLoading || profileLoading;

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
