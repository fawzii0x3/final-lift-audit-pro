import { type PropsWithChildren, use } from "react";
import { AuthContext } from "../auth/context";
import { useProfile } from "../api";
import { Navigate, Outlet } from "react-router";
// TODO : add when onboarding is ready
export function ProtectedRoute({ children }: PropsWithChildren) {
  const { user, loading: authLoading } = use(AuthContext);
  // const { needsOnboarding, isLoading: profileLoading } = useProfile();
  const { isLoading: profileLoading } = useProfile();
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

  // if (needsOnboarding) {
  //   return <Navigate to="/onboarding" replace />;
  // }

  return children;
}

export function ProtectedRootWrapper() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
