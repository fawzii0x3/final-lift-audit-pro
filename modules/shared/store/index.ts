import type { StateStorage } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";
import Dexie, { type Table } from "dexie";

// Dexie database for Zustand state storage
class ZustandDB extends Dexie {
  state!: Table<{ key: string; value: string }>;

  constructor() {
    super("ZustandDB");
    this.version(1).stores({
      state: "key, value",
    });
  }
}

const zustandDB = new ZustandDB();

export const zustandStorage: StateStorage = {
  setItem: async (name, value) => {
    try {
      await zustandDB.state.put({ key: name, value });
    } catch (error) {
      console.error("Failed to set item in Zustand storage:", error);
    }
  },
  getItem: async (name) => {
    try {
      const item = await zustandDB.state.get(name);
      return item?.value ?? null;
    } catch (error) {
      console.error("Failed to get item from Zustand storage:", error);
      return null;
    }
  },
  removeItem: async (name) => {
    try {
      await zustandDB.state.delete(name);
    } catch (error) {
      console.error("Failed to remove item from Zustand storage:", error);
    }
  },
};

export const jsonStorage = createJSONStorage(() => zustandStorage);
