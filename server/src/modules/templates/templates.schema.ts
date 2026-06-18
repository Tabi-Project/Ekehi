import { z } from "zod";

import { limitQuery, pageQuery } from "#/lib/validation";

export const listTemplatesQuery = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: pageQuery,
  limit: limitQuery,
});

// Columns mirror the generated `templates` Insert type: only title is required.
export const createTemplateSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  content: z.string().optional(),
  file_url: z.url().optional(),
});

export const updateTemplateSchema = createTemplateSchema.partial();

export type ListTemplatesQuery = z.infer<typeof listTemplatesQuery>;
export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
