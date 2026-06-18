import type { Response } from "express";

type SuccessOptions<T> = {
  status?: number;
  message?: string;
  data?: T | null;
  meta?: unknown;
};

type ErrorOptions = {
  status?: number;
  message?: string;
  data?: unknown;
};

/**
 * Standardized success envelope. `meta` is only attached when provided
 * (paginated list responses). Shape is part of the public API contract the
 * client depends on: { success, message, data, meta? }.
 */
export function sendSuccess<T>(
  res: Response,
  {
    status = 200,
    message = "Success",
    data = null,
    meta = null,
  }: SuccessOptions<T> = {},
) {
  const body: Record<string, unknown> = { success: true, message, data };
  if (meta) body.meta = meta;
  return res.status(status).json(body);
}

/**
 * Standardized error envelope: { success: false, message, data }.
 */
export function sendError(
  res: Response,
  {
    status = 500,
    message = "Internal server error",
    data = null,
  }: ErrorOptions = {},
) {
  return res.status(status).json({ success: false, message, data });
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

/**
 * Build pagination metadata for list responses.
 */
export function buildPaginationMeta({
  page,
  limit,
  total,
}: {
  page: number;
  limit: number;
  total: number;
}): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
