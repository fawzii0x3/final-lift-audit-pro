import { RealtimeChannel } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";

interface RealtimeSyncOptions {
  table: string;
  queryKey: string[];
  onInsert?: (payload: { new: unknown; old: unknown }) => void;
  onUpdate?: (payload: { new: unknown; old: unknown }) => void;
  onDelete?: (payload: { new: unknown; old: unknown }) => void;
  filter?: string;
}

export function useRealtimeSync(options: RealtimeSyncOptions) {
  const queryClient = useQueryClient();
  const { table, queryKey, onInsert, onUpdate, onDelete, filter } = options;

  const setupRealtimeSubscription = () => {
    const handleInsert = (payload: { new: unknown; old: unknown }) => {
      console.log("Realtime insert:", payload);

      // Update the query cache
      queryClient.setQueryData(queryKey, (oldData: unknown) => {
        if (Array.isArray(oldData)) {
          return [...oldData, payload.new];
        }
        return oldData;
      });

      onInsert?.(payload);
    };

    const handleUpdate = (payload: { new: unknown; old: unknown }) => {
      console.log("Realtime update:", payload);

      // Update the query cache
      queryClient.setQueryData(queryKey, (oldData: unknown) => {
        if (Array.isArray(oldData)) {
          return oldData.map((item: unknown) =>
            (item as { id: string }).id === (payload.new as { id: string }).id
              ? payload.new
              : item,
          );
        }
        return oldData;
      });

      onUpdate?.(payload);
    };

    const handleDelete = (payload: { new: unknown; old: unknown }) => {
      console.log("Realtime delete:", payload);

      // Update the query cache
      queryClient.setQueryData(queryKey, (oldData: unknown) => {
        if (Array.isArray(oldData)) {
          return oldData.filter(
            (item: unknown) =>
              (item as { id: string }).id !==
              (payload.old as { id: string }).id,
          );
        }
        return oldData;
      });

      onDelete?.(payload);
    };

    // Create the subscription
    const channel: RealtimeChannel = supabase
      .channel(`${table}-changes`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table,
          filter: filter || undefined,
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              handleInsert(payload);
              break;
            case "UPDATE":
              handleUpdate(payload);
              break;
            case "DELETE":
              handleDelete(payload);
              break;
          }
        },
      )
      .subscribe();

    return channel;
  };

  return { setupRealtimeSubscription };
}

// Conflict resolution utilities
export interface ConflictResolution {
  strategy: "last-write-wins" | "server-wins" | "client-wins" | "merge";
  timestampField?: string;
  mergeFunction?: (clientData: unknown, serverData: unknown) => unknown;
}

export function resolveConflict(
  clientData: unknown,
  serverData: unknown,
  resolution: ConflictResolution,
): unknown {
  switch (resolution.strategy) {
    case "last-write-wins":
      const clientTime = new Date(
        (clientData as Record<string, unknown>)[
          resolution.timestampField || "updated_at"
        ] as string,
      ).getTime();
      const serverTime = new Date(
        (serverData as Record<string, unknown>)[
          resolution.timestampField || "updated_at"
        ] as string,
      ).getTime();
      return clientTime > serverTime ? clientData : serverData;

    case "server-wins":
      return serverData;

    case "client-wins":
      return clientData;

    case "merge":
      return resolution.mergeFunction
        ? resolution.mergeFunction(clientData, serverData)
        : { ...serverData, ...clientData };

    default:
      return serverData;
  }
}

// Hook for managing realtime subscriptions
export function useRealtimeSubscription(
  table: string,
  queryKey: string[],
  options?: Partial<RealtimeSyncOptions>,
) {
  const { setupRealtimeSubscription } = useRealtimeSync({
    table,
    queryKey,
    ...options,
  });

  const subscribe = () => {
    return setupRealtimeSubscription();
  };

  return { subscribe };
}
