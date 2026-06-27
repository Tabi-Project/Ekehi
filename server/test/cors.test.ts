import assert from "node:assert/strict";
import { before, test } from "node:test";
import type * as CorsModule from "../src/config/cors";

// cors.ts imports env.ts, which parses process.env at import time.
process.env.SUPABASE_URL ??= "https://example.supabase.co";
process.env.SUPABASE_ANON_KEY ??= "anon";
process.env.SUPABASE_SERVICE_ROLE_KEY ??= "service";
process.env.JWT_SECRET ??= "secret";

let isOriginAllowed: typeof CorsModule.isOriginAllowed;

const allowed = ["https://ekehi.netlify.app", "http://localhost:3000"];

before(async () => {
  ({ isOriginAllowed } = await import("../src/config/cors"));
});

test("allows the production netlify domain", () => {
  assert.equal(isOriginAllowed("https://ekehi.netlify.app", allowed), true);
});

test("allows deploy previews", () => {
  assert.equal(
    isOriginAllowed("https://deploy-preview-161--ekehi.netlify.app", allowed),
    true,
  );
});

test("allows branch deploys", () => {
  assert.equal(
    isOriginAllowed("https://my-feature--ekehi.netlify.app", allowed),
    true,
  );
});

test("allows exact entries from the configured list", () => {
  assert.equal(isOriginAllowed("http://localhost:3000", allowed), true);
});

test("rejects look-alike domains", () => {
  assert.equal(
    isOriginAllowed("https://ekehi.netlify.app.evil.com", allowed),
    false,
  );
  assert.equal(isOriginAllowed("https://notekehi.netlify.app", allowed), false);
});

test("rejects non-https netlify origins", () => {
  assert.equal(isOriginAllowed("http://ekehi.netlify.app", allowed), false);
});
