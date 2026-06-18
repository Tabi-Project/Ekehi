import type { NextFunction, Request, Response } from "express";

/**
 * Wraps an async route handler so rejected promises are forwarded to the
 * Express error pipeline instead of crashing the process.
 */
export function asyncHandler(
  handler: (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => Promise<unknown>,
) {
  return (request: Request, response: Response, next: NextFunction) => {
    void handler(request, response, next).catch(next);
  };
}
