const INSPECTIONS_NEW_BASE = "/inspections/new";
export const Routes = {
  DASHBOARD: "/",
  CLIENTS: "/clients",
  CLIENTS_CREATE: "/clients/new",
  CLIENTS_EDIT: "/clients/edit",
  INSPECTIONS: "/inspections",
  INSPECTION_NEW_BASE: INSPECTIONS_NEW_BASE,
  TECHNICIANS: "/technicians",
  TECHNICIANS_CREATE: "/technicians/create",
  LANDING: "/landing",
  AUTH: "/auth",
  INSPECTIONS_NEW: {
    CLIENTS: `${INSPECTIONS_NEW_BASE}/:inspectionId/client`,
    EQUIPMENT: `${INSPECTIONS_NEW_BASE}/:inspectionId/equipment`,
    HOIST: `${INSPECTIONS_NEW_BASE}/:inspectionId/hoist`,
    TROLLEY: `${INSPECTIONS_NEW_BASE}/:inspectionId/trolley`,
    VERIFICATION: `${INSPECTIONS_NEW_BASE}/:inspectionId/verification`,
    PREVIEW: `${INSPECTIONS_NEW_BASE}/:inspectionId/preview`,
  },
};
