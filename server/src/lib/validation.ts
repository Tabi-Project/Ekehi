import { z } from "zod";

/**
 * Query-string boolean: accepts "true"/"false" (or real booleans) and yields a
 * boolean, or undefined when the param is absent.
 */
export const booleanQuery = z
  .enum(["true", "false"])
  .transform((value) => value === "true")
  .optional();

export const pageQuery = z.coerce.number().int().min(1).default(1);

export const limitQuery = z.coerce.number().int().min(1).max(100).default(10);

/**
 * Base pagination query shared by every list endpoint.
 */
export const paginationQuery = z.object({
  page: pageQuery,
  limit: limitQuery,
});

/**
 * `:id` route param validated as a UUID.
 */
export const idParamsSchema = z.object({
  id: z.uuid(),
});

export type IdParams = z.infer<typeof idParamsSchema>;
export type PaginationQuery = z.infer<typeof paginationQuery>;
