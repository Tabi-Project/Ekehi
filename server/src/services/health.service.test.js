const { test } = require("node:test");
const assert = require("node:assert/strict");

const { checkDatabase } = require("./health.service");

/**
 * Build a fake Supabase client whose query chain
 * (from -> select -> limit) resolves to the given result.
 */
const fakeClient = (result) => ({
  from: () => ({
    select: () => ({
      limit: () => Promise.resolve(result),
    }),
  }),
});

test("checkDatabase returns ok when the probe query succeeds", async () => {
  const client = fakeClient({ error: null });
  const result = await checkDatabase(client);
  assert.deepEqual(result, { ok: true, error: null });
});

test("checkDatabase returns not-ok when Supabase returns an error", async () => {
  const client = fakeClient({ error: { message: "relation does not exist" } });
  const result = await checkDatabase(client);
  assert.equal(result.ok, false);
  assert.equal(result.error, "relation does not exist");
});

test("checkDatabase returns not-ok when the query throws (connection down)", async () => {
  const client = {
    from: () => ({
      select: () => ({
        limit: () => Promise.reject(new Error("fetch failed")),
      }),
    }),
  };
  const result = await checkDatabase(client);
  assert.equal(result.ok, false);
  assert.equal(result.error, "fetch failed");
});
