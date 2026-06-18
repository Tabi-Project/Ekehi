import assert from "node:assert/strict";
import { test } from "node:test";
import type { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

import { validateRequest } from "../src/middleware/validate-request";

function run(
  schemas: Parameters<typeof validateRequest>[0],
  req: Partial<Request>,
) {
  const locals: Record<string, unknown> = {};
  const res = { locals } as unknown as Response;
  let nextArg: unknown = "NOT_CALLED";
  const next: NextFunction = ((err?: unknown) => {
    nextArg = err ?? null;
  }) as NextFunction;

  validateRequest(schemas)(req as Request, res, next);
  return { locals, nextArg };
}

test("stores coerced body/params/query on res.locals.validated", () => {
  const { locals, nextArg } = run(
    {
      body: z.object({ name: z.string() }),
      query: z.object({ page: z.coerce.number() }),
    },
    { body: { name: "ada" }, query: { page: "2" } },
  );

  assert.equal(nextArg, null);
  assert.deepEqual(locals.validated, {
    body: { name: "ada" },
    query: { page: 2 },
  });
});

test("forwards a ZodError to next when body is invalid", () => {
  const { locals, nextArg } = run(
    { body: z.object({ email: z.email() }) },
    { body: { email: "not-an-email" } },
  );

  assert.ok(nextArg instanceof ZodError);
  assert.equal(locals.validated, undefined);
});

test("short-circuits on the first failing segment", () => {
  const { nextArg } = run(
    {
      params: z.object({ id: z.uuid() }),
      body: z.object({ name: z.string() }),
    },
    { params: { id: "bad" }, body: { name: 123 } as unknown as object },
  );

  assert.ok(nextArg instanceof ZodError);
});
