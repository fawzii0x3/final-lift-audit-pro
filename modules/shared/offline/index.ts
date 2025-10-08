// Core offline utilities
export { createIDBPersister } from "./idb-persister";
export {
  useNetworkStatus,
  useNetworkStatusWithCallback,
  isOnline,
} from "./network";

// Queue management
export {
  db,
  enqueueRequest,
  enqueueMutation,
  getAllQueuedRequests,
  getAllQueuedMutations,
  removeQueuedRequest,
  removeQueuedMutation,
  updateRetryCount,
  clearExpiredItems,
  type QueuedRequest,
  type QueuedMutation,
} from "./queue";

// Offline mutations
export { useOfflineMutation, replayQueuedMutations } from "./offline-mutations";

// Background sync
export {
  registerMutation,
  useBackgroundSync,
  registerServiceWorker,
  startPeriodicCleanup,
} from "./background-sync";

// Realtime sync
export {
  useRealtimeSync,
  useRealtimeSubscription,
  resolveConflict,
  type ConflictResolution,
} from "./realtime-sync";

// Offline API
export { OfflineApi, createOfflineApi } from "./offline-api";

// UI Components
export { OfflineIndicator, OnlineIndicator } from "./OfflineIndicator";
