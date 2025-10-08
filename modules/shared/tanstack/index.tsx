import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createIDBPersister } from "../offline/idb-persister";
import type { PropsWithChildren } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount) => {
        // Don't retry if offline
        if (!navigator.onLine) return false;
        return failureCount < 3;
      },
    },
    mutations: {
      networkMode: "offlineFirst",
      retry: (failureCount) => {
        // Don't retry mutations if offline
        if (!navigator.onLine) return false;
        return failureCount < 2;
      },
    },
  },
});

const idbPersister = createIDBPersister("react-query-cache");

export function TanStackProvider({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: idbPersister,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        buster: "v1", // Change this to bust cache when needed
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
