import { get, set, del } from "idb-keyval";
import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client";

export function createIDBPersister(key = "react-query-cache"): Persister {
  return {
    async persistClient(client: PersistedClient) {
      try {
        await set(key, client);
      } catch (error) {
        console.error("Failed to persist React Query client:", error);
      }
    },
    async restoreClient() {
      try {
        return await get<PersistedClient | undefined>(key);
      } catch (error) {
        console.error("Failed to restore React Query client:", error);
        return undefined;
      }
    },
    async removeClient() {
      try {
        await del(key);
      } catch (error) {
        console.error("Failed to remove React Query client:", error);
      }
    },
  };
}
