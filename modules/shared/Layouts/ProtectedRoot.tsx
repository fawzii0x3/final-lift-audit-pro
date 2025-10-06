import { ProtectedRoute } from "../components/ProtectedRoute";
import { AppLayout } from "./AppLayout.tsx";
import { Outlet } from "react-router";

export function ProtectedRoot() {
  return (
    <ProtectedRoute>
      <AppLayout>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  );
}
