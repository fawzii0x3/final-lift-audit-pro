import { createBrowserRouter } from "react-router";
import { Auth } from "@modules/auth/screens";
import { Landing } from "@modules/shared/screens/Landing.tsx";
import { Dashboard } from "@modules/shared/screens/Dashboard.tsx";
import { ProtectedRoot } from "@modules/shared/Layouts/ProtectedRoot.tsx";
import { ProtectedRootWrapper } from "@modules/shared/components/ProtectedRoute.tsx";
import { InspectionNew } from "@modules/inspection/base.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: ProtectedRoot,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "/clients",
        Component: () => <div>Clients</div>,
      },
    ],
  },
  {
    path: "/inspections/new",
    Component: ProtectedRootWrapper,
    children: [{ index: true, Component: InspectionNew }],
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
