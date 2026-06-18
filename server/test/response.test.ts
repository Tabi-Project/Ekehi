import assert from "node:assert/strict";
import { test } from "node:test";
import type { Response } from "express";

import {
  buildPaginationMeta,
  sendError,
  sendSuccess,
} from "../src/lib/response";

/** Minimal Express res double that records status and json payload. */
function fakeRes() {
  const res = {
    statusCode: null as number | null,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
  return res as unknown as Response & {
    statusCode: number | null;
    body: Record<string, unknown> | null;
  };
}

test("sendSuccess defaults to 200 with success envelope and no meta key", () => {
  const res = fakeRes();
  sendSuccess(res, { data: { id: 1 } });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {
    success: true,
    message: "Success",
    data: { id: 1 },
  });
  assert.ok(res.body && !("meta" in res.body));
});

test("sendSuccess attaches meta only when provided", () => {
  const res = fakeRes();
  sendSuccess(res, {
    status: 201,
    message: "Created",
    data: [1, 2],
    meta: { page: 1 },
  });

  assert.equal(res.statusCode, 201);
  assert.deepEqual(res.body, {
    success: true,
    message: "Created",
    data: [1, 2],
    meta: { page: 1 },
  });
});

test("sendError defaults to 500 with null data", () => {
  const res = fakeRes();
  sendError(res);

  assert.equal(res.statusCode, 500);
  assert.deepEqual(res.body, {
    success: false,
    message: "Internal server error",
    data: null,
  });
});

test("sendError honors custom status, message, and data", () => {
  const res = fakeRes();
  sendError(res, { status: 400, message: "Bad", data: { issue: "x" } });

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.body, {
    success: false,
    message: "Bad",
    data: { issue: "x" },
  });
});

test("buildPaginationMeta computes pages and navigation flags", () => {
  assert.deepEqual(buildPaginationMeta({ page: 1, limit: 10, total: 25 }), {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3,
    hasNextPage: true,
    hasPrevPage: false,
  });

  assert.deepEqual(buildPaginationMeta({ page: 3, limit: 10, total: 25 }), {
    page: 3,
    limit: 10,
    total: 25,
    totalPages: 3,
    hasNextPage: false,
    hasPrevPage: true,
  });
});
