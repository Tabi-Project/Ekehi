/**
 * Probe the database with the cheapest possible round-trip: a HEAD request
 * that asks Postgres for an exact row count without transferring any rows.
 * This proves the Supabase connection, credentials, and Postgres are all live.
 *
 * The client is injectable for testing. When omitted, the real client is
 * required lazily so that importing this module in a test process does not
 * trigger env validation in config/env.js.
 *
 * @param {object} [client] - Supabase client (defaults to the configured one)
 * @returns {Promise<{ ok: boolean, error: string|null }>}
 */
const checkDatabase = async (client) => {
  const supabase = client || require("../config/supabaseClient");

  try {
    const { error } = await supabase
      .from("profiles")
      .select("*", { head: true, count: "exact" })
      .limit(1);

    if (error) return { ok: false, error: error.message };
    return { ok: true, error: null };
  } catch (err) {
    return { ok: false, error: err.message };
  }
};

module.exports = { checkDatabase };
