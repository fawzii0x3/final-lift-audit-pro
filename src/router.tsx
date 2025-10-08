import { createBrowserRouter, Navigate } from "react-router";
import { Routes } from "@modules/shared/routes";
import { Auth } from "@modules/auth/screens";
import { Landing } from "@modules/shared/screens/Landing";
import { Dashboard } from "@modules/shared/screens/Dashboard";
import { ProtectedRoot } from "@modules/shared/Layouts/ProtectedRoot";
import { ProtectedRoute } from "@modules/shared/components/ProtectedRoute";
import { InspectionNew } from "@modules/inspection/base";
import { ClientInfo } from "@modules/inspection/client";
import { EquipmentScreen } from "@modules/inspection/equipment";
import { HoistScreen } from "@modules/inspection/hoists";
import { TrolleyScreen } from "@modules/inspection/trolley";
import { VerificationScreen } from "@modules/inspection/verification";
import { PreviewScreen } from "@modules/inspection/preview";
import { Inspections } from "@modules/inspection/screen";
import { ClientScreen } from "@modules/clients/screen";
import { Technicians } from "@modules/techniciens/screen";

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
        Component: ClientScreen,
      },
      {
        path: Routes.INSPECTIONS,
        Component: Inspections,
      },
      {
        path: Routes.TECHNICIANS,
        Component: Technicians,
      },
    ],
  },
  {
    path: Routes.INSPECTION_NEW_BASE,
    Component: () => (
      <ProtectedRoute>
        <InspectionNew />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={Routes.INSPECTIONS_NEW.CLIENTS} replace />,
      },
      {
        path: Routes.INSPECTIONS_NEW.CLIENTS,
        Component: ClientInfo,
      },
      {
        path: Routes.INSPECTIONS_NEW.EQUIPMENT,
        Component: EquipmentScreen,
      },
      {
        path: Routes.INSPECTIONS_NEW.HOIST,
        Component: HoistScreen,
      },
      {
        path: Routes.INSPECTIONS_NEW.TROLLEY,
        Component: TrolleyScreen,
      },
      {
        path: Routes.INSPECTIONS_NEW.VERIFICATION,
        Component: VerificationScreen,
      },
      {
        path: Routes.INSPECTIONS_NEW.PREVIEW,
        Component: PreviewScreen,
      },
    ],
  },
  {
    path: Routes.LANDING,
    element: <Landing />,
  },
  {
    path: Routes.AUTH,
    element: <Auth />,
  },
]);
