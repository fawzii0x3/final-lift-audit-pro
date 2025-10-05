import { createBrowserRouter } from "react-router";
import { AppLayout } from "@modules/shared/Layouts/AppLayout.tsx";
import { ProtectedRoute } from "@modules/shared/components/ProtectedRoute.tsx";
import { Auth } from "@modules/auth/screens";
import { Landing } from "@modules/shared/screens/Landing.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>Hello World</AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/landing",
    element: <Landing />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);
