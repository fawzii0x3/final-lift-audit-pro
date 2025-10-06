import { useLocation } from "react-router";
import { Routes } from "@modules/shared/routes";

const Step: Record<string, number> = {
  [Routes.INSPECTIONS_NEW.CLIENTS]: 1,
  [Routes.INSPECTIONS_NEW.EQUIPMENT]: 2,
  [Routes.INSPECTIONS_NEW.HOIST]: 3,
  [Routes.INSPECTIONS_NEW.TROLLEY]: 4,
  [Routes.INSPECTIONS_NEW.VERIFICATION]: 5,
  [Routes.INSPECTIONS_NEW.PREVIEW]: 6,
};

export const StepPaths: Record<number, string> = {
  1: Routes.INSPECTIONS_NEW.CLIENTS,
  2: Routes.INSPECTIONS_NEW.EQUIPMENT,
  3: Routes.INSPECTIONS_NEW.HOIST,
  4: Routes.INSPECTIONS_NEW.TROLLEY,
  5: Routes.INSPECTIONS_NEW.VERIFICATION,
  6: Routes.INSPECTIONS_NEW.PREVIEW,
};

export function useCurrentStep() {
  const location = useLocation();
  return Step[location.pathname] || 0;
}
