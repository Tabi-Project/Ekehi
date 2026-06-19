import { createClient } from "@supabase/supabase-js";

import { env } from "#/config/env";
import type { Database } from "#/types/database";

const authConfig = {
  auth: { autoRefreshToken: false, persistSession: false },
} as const;

/**
 * Service-role client. Bypasses RLS — used for all data reads/writes on
 * public and admin endpoints. Never expose this key to clients.
 */
export const supabase = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  authConfig,
);

/**
 * Anon client for user-facing auth flows (sign-up, sign-in, refresh).
 *
 * Kept separate from the service-role singleton on purpose: signInWithPassword
 * mutates an in-memory session on the client it runs against. Doing that on the
 * service-role singleton would contaminate every subsequent query with the user
 * JWT, making RLS apply and returning empty results on public endpoints.
 */
export const authClient = createClient<Database>(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
  authConfig,
);
