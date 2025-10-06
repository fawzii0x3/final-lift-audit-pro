import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import { Routes } from "@modules/shared/routes";

// Lazy imports
const Auth = lazy(() =>
  import("@modules/auth/screens").then((module) => ({ default: module.Auth })),
);
const Landing = lazy(() =>
  import("@modules/shared/screens/Landing.tsx").then((module) => ({
    default: module.Landing,
  })),
);
const Dashboard = lazy(() =>
  import("@modules/shared/screens/Dashboard.tsx").then((module) => ({
    default: module.Dashboard,
  })),
);
const ProtectedRoot = lazy(() =>
  import("@modules/shared/Layouts/ProtectedRoot.tsx").then((module) => ({
    default: module.ProtectedRoot,
  })),
);
const ProtectedRoute = lazy(() =>
  import("@modules/shared/components/ProtectedRoute.tsx").then((module) => ({
    default: module.ProtectedRoute,
  })),
);
const InspectionNew = lazy(() =>
  import("@modules/inspection/base.tsx").then((module) => ({
    default: module.InspectionNew,
  })),
);
const ClientInfo = lazy(() =>
  import("@modules/inspection/client").then((module) => ({
    default: module.ClientInfo,
  })),
);

export const router = createBrowserRouter([
  {
    path: Routes.DASHBOARD,
    Component: ProtectedRoot,
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: Routes.CLIENTS,
        Component: () => <div>Clients</div>,
      },
    ],
  },
  {
    path: Routes.INSPECTIONS.NEW,
    Component: () => (
      <ProtectedRoute>
        <InspectionNew />
      </ProtectedRoute>
    ),
    children: [{ index: true, Component: ClientInfo }],
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
