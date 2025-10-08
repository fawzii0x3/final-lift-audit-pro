import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueMutation } from "./queue";
import { isOnline } from "./network";

interface OfflineMutationOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onMutate?: (variables: TVariables) => void | Promise<void>;
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: Error, variables: TVariables) => void | Promise<void>;
  onSettled?: (
    data: TData | undefined,
    error: Error | null,
    variables: TVariables,
  ) => void | Promise<void>;
  queryKey?: string[];
  maxRetries?: number;
}

export function useOfflineMutation<TData, TVariables>(
  options: OfflineMutationOptions<TData, TVariables>,
) {
  const queryClient = useQueryClient();
  const { mutationFn, queryKey, maxRetries = 3, ...mutationOptions } = options;

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      if (isOnline()) {
        // Try network first if online
        try {
          return await mutationFn(variables);
        } catch (error) {
          // If network fails, queue the mutation
          await enqueueMutation({
            mutationId: `mutation-${Date.now()}-${Math.random()}`,
            queryKey: queryKey || [],
            mutationFn: mutationFn.name || "anonymous",
            variables,
            maxRetries,
          });
          throw error;
        }
      } else {
        // Offline - queue the mutation
        await enqueueMutation({
          mutationId: `mutation-${Date.now()}-${Math.random()}`,
          queryKey: queryKey || [],
          mutationFn: mutationFn.name || "anonymous",
          variables,
          maxRetries,
        });

        // Return a temporary result to keep UI responsive
        return {
          id: `temp-${Date.now()}`,
          ...variables,
          _isOffline: true,
        } as TData;
      }
    },
    ...mutationOptions,
    onMutate: async (variables: TVariables) => {
      // Cancel any outgoing refetches
      if (queryKey) {
        await queryClient.cancelQueries({ queryKey });
      }

      // Snapshot the previous value
      const previousData = queryKey
        ? queryClient.getQueryData(queryKey)
        : undefined;

      // Optimistically update the cache
      if (queryKey && options.onMutate) {
        await options.onMutate(variables);
      }

      return { previousData };
    },
    onError: (
      error: Error,
      variables: TVariables,
      context?: { previousData?: unknown },
    ) => {
      // Revert optimistic update on error
      if (queryKey && context?.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }

      if (options.onError) {
        options.onError(error, variables);
      }
    },
    onSettled: (data, error, variables) => {
      // Invalidate queries to refetch fresh data
      if (queryKey) {
        queryClient.invalidateQueries({ queryKey });
      }

      if (options.onSettled) {
        options.onSettled(data, error, variables);
      }
    },
  });
}

// Helper function to replay queued mutations
export async function replayQueuedMutations(
  mutationMap: Record<string, (variables: unknown) => Promise<unknown>>,
) {
  const { getAllQueuedMutations, removeQueuedMutation, updateRetryCount } =
    await import("./queue");

  const queuedMutations = await getAllQueuedMutations();

  for (const mutation of queuedMutations) {
    try {
      const mutationFn = mutationMap[mutation.mutationFn];
      if (!mutationFn) {
        console.warn(`No mutation function found for: ${mutation.mutationFn}`);
        continue;
      }

      await mutationFn(mutation.variables);

      // Success - remove from queue
      await removeQueuedMutation(mutation.id!);
      console.log(`Successfully replayed mutation: ${mutation.mutationId}`);
    } catch (error) {
      console.error(`Failed to replay mutation ${mutation.mutationId}:`, error);

      // Increment retry count
      const newRetryCount = mutation.retryCount + 1;
      await updateRetryCount(mutation.id!, newRetryCount, "mutations");

      // Remove if max retries exceeded
      if (newRetryCount >= mutation.maxRetries) {
        await removeQueuedMutation(mutation.id!);
        console.warn(
          `Removed mutation ${mutation.mutationId} after ${mutation.maxRetries} retries`,
        );
      }
    }
  }
}
