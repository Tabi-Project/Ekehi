import assert from "node:assert/strict";
import { before, test } from "node:test";
import type * as EnvModule from "../src/config/env";

// env.ts parses process.env at import time, so provide valid values first.
// (dotenv does not override already-set vars, so this is safe alongside .env.)
process.env.SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_ANON_KEY ??= "anon";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "service";
process.env.JWT_SECRET ??= "secret";

let EnvSchema: typeof EnvModule.EnvSchema;

const base = {
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
  JWT_SECRET: "secret",
};

before(async () => {
  ({ EnvSchema } = await import("../src/config/env"));
});

test("applies defaults for NODE_ENV and PORT", () => {
  const env = EnvSchema.parse(base);
  assert.equal(env.NODE_ENV, "development");
  assert.equal(env.PORT, 3000);
  assert.deepEqual(env.ALLOWED_ORIGINS, []);
});

test("coerces PORT and splits ALLOWED_ORIGINS, trimming blanks", () => {
  const env = EnvSchema.parse({
    ...base,
    PORT: "8080",
    ALLOWED_ORIGINS: "http://a.com, http://b.com , ",
  });
  assert.equal(env.PORT, 8080);
  assert.deepEqual(env.ALLOWED_ORIGINS, ["http://a.com", "http://b.com"]);
});

test("rejects a missing required variable", () => {
  const { SUPABASE_URL: _omit, ...withoutUrl } = base;
  void _omit;
  const result = EnvSchema.safeParse(withoutUrl);
  assert.equal(result.success, false);
});

test("rejects an invalid SUPABASE_URL", () => {
  const result = EnvSchema.safeParse({ ...base, SUPABASE_URL: "not-a-url" });
  assert.equal(result.success, false);
});
