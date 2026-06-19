import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

export type ValidatedRequest<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
> = {
  body: TBody;
  params: TParams;
  query: TQuery;
};

/**
 * Parse request body/params/query against zod schemas. Parsed (and coerced)
 * values are stored on `res.locals.validated` so controllers consume typed,
 * sanitized input without mutating the raw request. ZodErrors are forwarded to
 * the error handler, which renders them as a 400 in the standard envelope.
 */
export function validateRequest(schemas: RequestSchemas) {
  return (request: Request, response: Response, next: NextFunction) => {
    const validated: Record<string, unknown> = {};

    if (schemas.body) {
      const result = schemas.body.safeParse(request.body);
      if (!result.success) return next(result.error);
      validated.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(request.params);
      if (!result.success) return next(result.error);
      validated.params = result.data;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(request.query);
      if (!result.success) return next(result.error);
      validated.query = result.data;
    }

    response.locals.validated = validated;
    next();
  };
}

/**
 * Typed accessor for the parsed request data attached by `validateRequest`.
 */
export function getValidated<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
>(response: Response): ValidatedRequest<TBody, TParams, TQuery> {
  return response.locals.validated as ValidatedRequest<TBody, TParams, TQuery>;
}
