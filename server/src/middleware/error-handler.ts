import type { ErrorRequestHandler } from "express";
import { MulterError } from "multer";
import { flattenError, ZodError } from "zod";

import { HttpError } from "#/lib/http-error";
import { logger } from "#/lib/logger";
import { sendError } from "#/lib/response";

/**
 * Terminal error handler. Maps known error types onto the standard
 * { success: false, message, data } envelope. Validation issues ride in `data`
 * so the envelope shape never changes for the client.
 */
export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  void _next;

  if (error instanceof ZodError) {
    return sendError(response, {
      status: 400,
      message: "Validation failed",
      data: flattenError(error),
    });
  }

  if (error instanceof HttpError) {
    return sendError(response, {
      status: error.statusCode,
      message: error.message,
    });
  }

  if (error instanceof MulterError) {
    return sendError(response, { status: 400, message: error.message });
  }

  // Back-compat: plain errors carrying an explicit status (e.g. multer
  // fileFilter rejections or thrown { status } objects).
  const status =
    typeof (error as { status?: number; statusCode?: number })?.status ===
    "number"
      ? (error as { status: number }).status
      : typeof (error as { statusCode?: number })?.statusCode === "number"
        ? (error as { statusCode: number }).statusCode
        : undefined;

  if (status) {
    return sendError(response, {
      status,
      message: (error as Error)?.message || "Request failed",
    });
  }

  logger.error("Unhandled server error", error);

  return sendError(response, { status: 500, message: "Internal server error" });
};
