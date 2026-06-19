import assert from "node:assert/strict";
import { before, test } from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import type * as HealthController from "../src/modules/health/health.controller";
import type * as HealthService from "../src/modules/health/health.service";

// health.service imports the Supabase client, which loads config/env at import.
process.env.SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_ANON_KEY ??= "anon";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "service";
process.env.JWT_SECRET ??= "secret";

let buildHealthResponse: typeof HealthController.buildHealthResponse;
let checkDatabase: typeof HealthService.checkDatabase;

before(async () => {
  ({ buildHealthResponse } =
    await import("../src/modules/health/health.controller"));
  ({ checkDatabase } = await import("../src/modules/health/health.service"));
});

/** Fake Supabase client whose from->select->limit chain resolves to `result`. */
function fakeClient(result: unknown) {
  return {
    from: () => ({
      select: () => ({
        limit: () => Promise.resolve(result),
      }),
    }),
  } as unknown as SupabaseClient;
}

test("buildHealthResponse maps a healthy db to 200 / ok", () => {
  const { status, body } = buildHealthResponse({ ok: true, error: null });
  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.status, "ok");
  assert.equal(body.data.checks.database, "ok");
  assert.equal(typeof body.data.uptime, "number");
});

test("buildHealthResponse maps a down db to 503 / degraded", () => {
  const { status, body } = buildHealthResponse({ ok: false, error: "down" });
  assert.equal(status, 503);
  assert.equal(body.success, false);
  assert.equal(body.data.status, "degraded");
  assert.equal(body.data.checks.database, "down");
});

test("checkDatabase returns ok when the probe succeeds", async () => {
  const result = await checkDatabase(fakeClient({ error: null }));
  assert.deepEqual(result, { ok: true, error: null });
});

test("checkDatabase reports the error when Supabase returns one", async () => {
  const result = await checkDatabase(
    fakeClient({ error: { message: "relation does not exist" } }),
  );
  assert.equal(result.ok, false);
  assert.equal(result.error, "relation does not exist");
});

test("checkDatabase reports failure when the probe throws", async () => {
  const client = {
    from: () => ({
      select: () => ({
        limit: () => Promise.reject(new Error("fetch failed")),
      }),
    }),
  } as unknown as SupabaseClient;

  const result = await checkDatabase(client);
  assert.equal(result.ok, false);
  assert.equal(result.error, "fetch failed");
});
