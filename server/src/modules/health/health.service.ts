import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "#/lib/supabase";
import type { Database } from "#/types/database";

export type DatabaseCheck = { ok: boolean; error: string | null };

/**
 * Probe the database with the cheapest possible round-trip: a HEAD request for
 * an exact row count, transferring no rows. Proves the Supabase connection,
 * credentials, and Postgres are all live. The client is injectable for testing.
 */
export async function checkDatabase(
  client: SupabaseClient<Database> = supabase,
): Promise<DatabaseCheck> {
  try {
    const { error } = await client
      .from("profiles")
      .select("*", { head: true, count: "exact" })
      .limit(1);

    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
