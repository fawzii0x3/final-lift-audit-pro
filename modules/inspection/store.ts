import { create, useStore } from "zustand";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { jsonStorage } from "@modules/shared/store";
import type { InspectionsInsert } from "@modules/shared/api";
import type { Optional } from "@modules/shared/types";
import type { Database } from "@modules/shared/supabase";

type Step = number;
type CompletedSteps = Step[];

type EquipmentData = Database["public"]["Tables"]["inspection_equipment"]["Insert"];
type HoistData = Database["public"]["Tables"]["inspection_hoists"]["Insert"];
type TrolleyData = Database["public"]["Tables"]["inspection_trolleys"]["Insert"];

interface IDraftStoreState {
  completedSteps: CompletedSteps;
  inspection: Optional<InspectionsInsert>;
  inspectionId: Optional<string>;
  equipment: Optional<EquipmentData>;
  hoists: Optional<HoistData[]>;
  trolleys: Optional<TrolleyData[]>;
}

export interface IDraftStore extends IDraftStoreState {
  clear: () => void;
  setInspection: (inspection: InspectionsInsert) => void;
  setInspectionId: (id: string) => void;
  setEquipment: (equipment: EquipmentData) => void;
  setHoists: (hoists: HoistData[]) => void;
  setTrolleys: (trolleys: TrolleyData[]) => void;
  setCompletedSteps: (steps: CompletedSteps) => void;
  markStepCompleted: (step: number) => void;
}

const initialState: IDraftStoreState = {
  inspection: null,
  inspectionId: null,
  equipment: null,
  hoists: null,
  trolleys: null,
  completedSteps: [],
};

const draftState: StateCreator<IDraftStore> = (set) => ({
  ...initialState,
  clear: () => {
    set(initialState);
  },
  setInspection: (inspection) => {
    set({ inspection });
  },
  setInspectionId: (inspectionId) => {
    set({ inspectionId });
  },
  setEquipment: (equipment) => {
    set({ equipment });
  },
  setHoists: (hoists) => {
    set({ hoists });
  },
  setTrolleys: (trolleys) => {
    set({ trolleys });
  },
  setCompletedSteps: (completedSteps) => {
    set({ completedSteps });
  },
  markStepCompleted: (step) => {
    set((state) => ({
      completedSteps: [...state.completedSteps, step].filter((s, i, arr) => arr.indexOf(s) === i),
    }));
  },
});

export const DraftStore = create(
  persist(draftState, {
    name: "draft-store",
    storage: jsonStorage,
  }),
);

export function useDraftInspection() {
  const { inspection, setInspection } = useStore(DraftStore);
  return {
    inspection,
    setInspection,
  };
}

export function useDraftInspectionId() {
  const { inspectionId, setInspectionId } = useStore(DraftStore);
  return {
    inspectionId,
    setInspectionId,
  };
}

export function useDraftEquipment() {
  const { equipment, setEquipment } = useStore(DraftStore);
  return {
    equipment,
    setEquipment,
  };
}

export function useDraftHoists() {
  const { hoists, setHoists } = useStore(DraftStore);
  return {
    hoists,
    setHoists,
  };
}

export function useDraftTrolleys() {
  const { trolleys, setTrolleys } = useStore(DraftStore);
  return {
    trolleys,
    setTrolleys,
  };
}

export function useDraftCompletedSteps() {
  const { completedSteps } = useStore(DraftStore);
  return { completedSteps };
}

export function useDraftStepManagement() {
  const { markStepCompleted } = useStore(DraftStore);
  return {
    markStepCompleted,
  };
}
