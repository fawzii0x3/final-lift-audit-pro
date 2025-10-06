import { create, useStore } from "zustand";
import type { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { jsonStorage } from "@modules/shared/store";
import type { InspectionsInsert } from "@modules/shared/api";
import type { Optional } from "@modules/shared/types";

type Step = number;
type CompletedSteps = Step[];

interface IDraftStoreState {
  completedSteps: CompletedSteps;
  client: Optional<InspectionsInsert>;
}

export interface IDraftStore extends IDraftStoreState {
  clear: () => void;
  setClient: (name: InspectionsInsert) => void;
  setCompletedSteps: (steps: CompletedSteps) => void;
}

const initialState: IDraftStoreState = {
  client: null,
  completedSteps: [],
};

const draftState: StateCreator<IDraftStore> = (set) => ({
  ...initialState,
  clear: () => {
    set(initialState);
  },
  setClient: (client) => {
    set({ client });
  },
  setCompletedSteps: (completedSteps) => {
    set({ completedSteps });
  },
});

export const DraftStore = create(
  persist(draftState, {
    name: "draft-store",
    storage: jsonStorage,
  }),
);

export function useDraftClient() {
  const { client } = useStore(DraftStore);
  return {
    client,
  };
}

export function useDraftCompletedSteps() {
  const { completedSteps } = useStore(DraftStore);
  return { completedSteps };
}
