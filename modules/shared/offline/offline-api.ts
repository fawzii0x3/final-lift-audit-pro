import { supabase } from "../supabase";
import { enqueueRequest } from "./queue";
import { isOnline } from "./network";

interface OfflineApiOptions {
  table: string;
  queryKey: string[];
  maxRetries?: number;
}

export class OfflineApi {
  private table: string;
  private maxRetries: number;

  constructor(options: OfflineApiOptions) {
    this.table = options.table;
    this.maxRetries = options.maxRetries || 3;
  }

  async create(
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> & { _isOffline?: boolean }> {
    if (isOnline()) {
      try {
        const { data: result, error } = await supabase
          .from(this.table as never)
          .insert(data as never)
          .select()
          .single();

        if (error) throw error;
        return result as Record<string, unknown>;
      } catch (error) {
        // Queue the request if network fails
        await this.queueRequest("POST", data);
        throw error;
      }
    } else {
      // Queue the request for later
      await this.queueRequest("POST", data);

      // Return optimistic result
      return {
        ...data,
        id: `temp-${Date.now()}`,
        _isOffline: true,
      };
    }
  }

  async update(
    id: string,
    data: Record<string, unknown>,
  ): Promise<Record<string, unknown> & { _isOffline?: boolean }> {
    if (isOnline()) {
      try {
        const { data: result, error } = await supabase
          .from(this.table as never)
          .update(data as never)
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        return result as Record<string, unknown>;
      } catch (error) {
        await this.queueRequest("PATCH", { id, ...data });
        throw error;
      }
    } else {
      await this.queueRequest("PATCH", { id, ...data });

      return {
        ...data,
        id,
        _isOffline: true,
      };
    }
  }

  async delete(id: string): Promise<{ id: string; _isOffline?: boolean }> {
    if (isOnline()) {
      try {
        const { error } = await supabase
          .from(this.table as never)
          .delete()
          .eq("id", id);

        if (error) throw error;
        return { id };
      } catch (error) {
        await this.queueRequest("DELETE", { id });
        throw error;
      }
    } else {
      await this.queueRequest("DELETE", { id });

      return {
        id,
        _isOffline: true,
      };
    }
  }

  private async queueRequest(method: string, data: Record<string, unknown>) {
    // Get Supabase URL and key from environment or config
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

    const url = `${supabaseUrl}/rest/v1/${this.table}`;
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
      apikey: supabaseKey,
    };

    await enqueueRequest({
      url,
      method,
      body: data,
      headers,
      maxRetries: this.maxRetries,
    });
  }
}

// Factory function to create offline API instances
export function createOfflineApi(
  table: string,
  queryKey: string[],
  maxRetries = 3,
): OfflineApi {
  return new OfflineApi({ table, queryKey, maxRetries });
}
