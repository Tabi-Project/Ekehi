import { z } from "zod";

import { limitQuery, pageQuery } from "#/lib/validation";
import { CONTENT_TYPES, REVIEW_DECISIONS } from "#/models/enums";

export const contentParamsSchema = z.object({
  contentType: z.enum(CONTENT_TYPES),
  id: z.uuid(),
});

export const reviewBodySchema = z.object({
  decision: z.enum(REVIEW_DECISIONS),
  feedback: z.string().optional(),
});

export const queueQuerySchema = z.object({
  type: z.enum(CONTENT_TYPES).optional(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  page: pageQuery,
  limit: limitQuery.default(20),
});

export type ContentParams = z.infer<typeof contentParamsSchema>;
export type ReviewBody = z.infer<typeof reviewBodySchema>;
export type QueueQuery = z.infer<typeof queueQuerySchema>;
