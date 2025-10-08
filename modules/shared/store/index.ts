import type { StateStorage } from "zustand/middleware";
import { createJSONStorage } from "zustand/middleware";

export const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return window.localStorage.set(name, value);
  },
  getItem: (name) => {
    const value = window.localStorage.getItem(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return window.localStorage.delete(name);
  },
};


export const jsonStorage = createJSONStorage(() => zustandStorage);
