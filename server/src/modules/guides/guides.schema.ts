import { z } from "zod";

import { limitQuery, pageQuery } from "#/lib/validation";

export const listGuidesQuery = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: pageQuery,
  limit: limitQuery,
});

// Columns mirror the generated `guides` Insert type: title and slug are
// required (NOT NULL, no default); the rest are optional.
export const createGuideSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  summary: z.string().optional(),
  category: z.string().optional(),
  content: z.string().optional(),
});

export const updateGuideSchema = createGuideSchema.partial();

export type ListGuidesQuery = z.infer<typeof listGuidesQuery>;
export type CreateGuideInput = z.infer<typeof createGuideSchema>;
export type UpdateGuideInput = z.infer<typeof updateGuideSchema>;
