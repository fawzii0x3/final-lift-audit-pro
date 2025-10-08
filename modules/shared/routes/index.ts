const INSPECTIONS_NEW_BASE = "/inspections/new";
export const Routes = {
  DASHBOARD: "/",
  CLIENTS: "/clients",
  INSPECTIONS: "/inspections",
  INSPECTION_NEW_BASE: INSPECTIONS_NEW_BASE,
  TECHNICIANS: "/technicians",
  INSPECTIONS_NEW: {
    CLIENTS: `${INSPECTIONS_NEW_BASE}/client`,
    EQUIPMENT: `${INSPECTIONS_NEW_BASE}/equipment`,
    HOIST: `${INSPECTIONS_NEW_BASE}/hoist`,
    TROLLEY: `${INSPECTIONS_NEW_BASE}/trolley`,
    VERIFICATION: `${INSPECTIONS_NEW_BASE}/verification`,
    PREVIEW: `${INSPECTIONS_NEW_BASE}/preview`,
  },
};
