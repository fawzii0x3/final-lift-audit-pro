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
    // onOnline - replay queued mutations with debouncing
    async () => {
      console.log("Network back online, replaying queued mutations...");
      try {
        // Add a small delay to prevent rapid firing
        await new Promise(resolve => setTimeout(resolve, 100));
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
      // Check if service worker is already registered
      const existingRegistration = await navigator.serviceWorker.getRegistration();
      if (existingRegistration) {
        console.log("Service Worker already registered:", existingRegistration);
        return existingRegistration;
      }

      // VitePWA handles service worker registration automatically
      // We just need to wait for it to be ready
      const registration = await navigator.serviceWorker.ready;
      console.log("Service Worker ready:", registration);

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
      // Don't throw error, just log it since PWA might handle this
    }
  }
}

// Periodic cleanup of expired items
export function startPeriodicCleanup() {
  // Clean up expired items every hour with requestIdleCallback for better performance
  const scheduleCleanup = () => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(async () => {
        try {
          await clearExpiredItems();
          console.log("Cleaned up expired offline items");
        } catch (error) {
          console.error("Failed to clean up expired items:", error);
        }
        // Schedule next cleanup
        setTimeout(scheduleCleanup, 60 * 60 * 1000); // 1 hour
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(async () => {
        try {
          await clearExpiredItems();
          console.log("Cleaned up expired offline items");
        } catch (error) {
          console.error("Failed to clean up expired items:", error);
        }
        scheduleCleanup();
      }, 60 * 60 * 1000); // 1 hour
    }
  };
  
  scheduleCleanup();
}
