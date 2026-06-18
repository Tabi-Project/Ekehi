import { z } from "zod";

import { booleanQuery, limitQuery, pageQuery } from "#/lib/validation";
import { LISTING_STATUSES, OPPORTUNITY_TYPES } from "#/models/enums";

export const listOpportunitiesQuery = z.object({
  search: z.string().optional(),
  opportunity_type: z.enum(OPPORTUNITY_TYPES).optional(),
  sector: z.string().optional(),
  stage: z.string().optional(),
  country: z.string().optional(),
  status: z.enum(LISTING_STATUSES).optional(),
  is_women_only: booleanQuery,
  page: pageQuery,
  limit: limitQuery,
});

export const createOpportunitySchema = z.object({
  opportunity_title: z.string().trim().min(1),
  funder_name: z.string().trim().min(1),
  opportunity_type: z.enum(OPPORTUNITY_TYPES),
  amount_min: z.number().nonnegative().optional(),
  amount_max: z.number().nonnegative().optional(),
  currency: z.string().optional(),
  sectors: z.array(z.string()).optional(),
  stages: z.array(z.string()).optional(),
  country: z.string().optional(),
  application_deadline: z.string().optional(),
  status: z.enum(LISTING_STATUSES).optional(),
  eligibility_criteria: z.string().optional(),
  description: z.string().optional(),
  apply_url: z.url().optional(),
  contact_email: z.email().optional(),
  is_women_only: z.boolean().optional(),
  is_equity_free: z.boolean().optional(),
});

export const updateOpportunitySchema = createOpportunitySchema.partial();

export type ListOpportunitiesQuery = z.infer<typeof listOpportunitiesQuery>;
export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
