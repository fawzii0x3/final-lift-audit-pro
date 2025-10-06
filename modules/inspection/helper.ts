import { useLocation } from "react-router";
import { Routes } from "@modules/shared/routes";

const Step: Record<string, number> = {
  [Routes.INSPECTIONS.NEW]: 1,
};

export function useCurrentStep() {
  const location = useLocation();
  return Step[location.pathname] || 0;
}
