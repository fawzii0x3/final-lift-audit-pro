import Dexie, { type Table } from "dexie";

export interface QueuedRequest {
  id?: number;
  url: string;
  method: string;
  body?: unknown;
  headers?: Record<string, string>;
  createdAt: number;
  retryCount: number;
  maxRetries: number;
  queryKey?: string[];
  mutationId?: string;
}

export interface QueuedMutation {
  id?: number;
  mutationId: string;
  queryKey: string[];
  mutationFn: string; // serialized function name
  variables: unknown;
  createdAt: number;
  retryCount: number;
  maxRetries: number;
}

class OfflineDB extends Dexie {
  queue!: Table<QueuedRequest>;
  mutations!: Table<QueuedMutation>;

  constructor() {
    super("OfflineDB");
    this.version(1).stores({
      queue: "++id, createdAt, retryCount",
      mutations: "++id, mutationId, queryKey, createdAt, retryCount",
    });
  }
}

export const db = new OfflineDB();

// Queue management functions
export async function enqueueRequest(
  request: Omit<QueuedRequest, "id" | "createdAt" | "retryCount">,
) {
  const queuedRequest: QueuedRequest = {
    ...request,
    createdAt: Date.now(),
    retryCount: 0,
    maxRetries: request.maxRetries || 3,
  };
  return await db.queue.add(queuedRequest);
}

export async function enqueueMutation(
  mutation: Omit<QueuedMutation, "id" | "createdAt" | "retryCount">,
) {
  const queuedMutation: QueuedMutation = {
    ...mutation,
    createdAt: Date.now(),
    retryCount: 0,
    maxRetries: mutation.maxRetries || 3,
  };
  return await db.mutations.add(queuedMutation);
}

export async function getAllQueuedRequests() {
  return await db.queue.orderBy("createdAt").toArray();
}

export async function getAllQueuedMutations() {
  return await db.mutations.orderBy("createdAt").toArray();
}

export async function removeQueuedRequest(id: number) {
  return await db.queue.delete(id);
}

export async function removeQueuedMutation(id: number) {
  return await db.mutations.delete(id);
}

export async function updateRetryCount(
  id: number,
  retryCount: number,
  table: "queue" | "mutations" = "queue",
) {
  if (table === "queue") {
    return await db.queue.update(id, { retryCount });
  } else {
    return await db.mutations.update(id, { retryCount });
  }
}

export async function clearExpiredItems(maxAge = 24 * 60 * 60 * 1000) {
  // 24 hours
  const cutoff = Date.now() - maxAge;
  await db.queue.where("createdAt").below(cutoff).delete();
  await db.mutations.where("createdAt").below(cutoff).delete();
}
