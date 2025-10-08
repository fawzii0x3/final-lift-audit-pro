import { useNetworkStatusWithCallback } from "./network";
import { replayQueuedMutations } from "./offline-mutations";
import { clearExpiredItems } from "./queue";

// Global mutation map for replaying mutations
const mutationMap: Record<string, (variables: unknown) => Promise<unknown>> =
  {};

export function registerMutation(
  name: string,
  mutationFn: (variables: unknown) => Promise<unknown>,
) {
  mutationMap[name] = mutationFn;
}

export function useBackgroundSync() {
  useNetworkStatusWithCallback(
    // onOnline - replay queued mutations
    async () => {
      console.log("Network back online, replaying queued mutations...");
      try {
        await replayQueuedMutations(mutationMap);
        console.log("Successfully replayed all queued mutations");
      } catch (error) {
        console.error("Failed to replay queued mutations:", error);
      }
    },
    // onOffline
    () => {
      console.log("Network offline, mutations will be queued");
    },
  );
}

// Service worker registration for background sync
export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);

      // Listen for background sync events
      if ("sync" in window.ServiceWorkerRegistration.prototype) {
        registration.addEventListener(
          "sync",
          (event: Event & { tag?: string }) => {
            if (event.tag === "background-sync") {
              console.log("Background sync event triggered");
              replayQueuedMutations(mutationMap);
            }
          },
        );
      }

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}

// Periodic cleanup of expired items
export function startPeriodicCleanup() {
  // Clean up expired items every hour
  setInterval(
    async () => {
      try {
        await clearExpiredItems();
        console.log("Cleaned up expired offline items");
      } catch (error) {
        console.error("Failed to clean up expired items:", error);
      }
    },
    60 * 60 * 1000,
  ); // 1 hour
}
