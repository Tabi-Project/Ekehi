import { z } from "zod";

import { booleanQuery, limitQuery, pageQuery } from "#/lib/validation";
import {
  COST_TYPES,
  DURATION_RANGES,
  LOCATION_SCOPES,
  PROGRAMME_TYPES,
  TRAINING_FORMATS,
} from "#/models/enums";

export const listTrainingsQuery = z.object({
  search: z.string().optional(),
  programme_type: z.enum(PROGRAMME_TYPES).optional(),
  format: z.enum(TRAINING_FORMATS).optional(),
  cost_type: z.enum(COST_TYPES).optional(),
  duration_range: z.enum(DURATION_RANGES).optional(),
  location_scope: z.enum(LOCATION_SCOPES).optional(),
  is_featured: booleanQuery,
  page: pageQuery,
  limit: limitQuery,
});

// Required fields mirror the generated `training_programmes` Insert type: the
// enum columns (programme_type/format/cost_type/duration_range/location_scope)
// and programme_name are NOT NULL with no default. `cost` is a text column.
export const createTrainingSchema = z.object({
  programme_name: z.string().trim().min(1),
  programme_type: z.enum(PROGRAMME_TYPES),
  format: z.enum(TRAINING_FORMATS),
  cost_type: z.enum(COST_TYPES),
  duration_range: z.enum(DURATION_RANGES),
  location_scope: z.enum(LOCATION_SCOPES),
  provider: z.string().optional(),
  cost: z.string().optional(),
  currency: z.string().optional(),
  certification: z.string().optional(),
  topics_covered: z.string().optional(),
  location: z.string().optional(),
  application_deadline: z.string().optional(),
  apply_url: z.url().optional(),
  is_featured: z.boolean().optional(),
  description: z.string().optional(),
});

export const updateTrainingSchema = createTrainingSchema.partial();

export type ListTrainingsQuery = z.infer<typeof listTrainingsQuery>;
export type CreateTrainingInput = z.infer<typeof createTrainingSchema>;
export type UpdateTrainingInput = z.infer<typeof updateTrainingSchema>;
