import { z } from 'zod'

/**
 * Subset of `GET /meta` used by the submission form. The endpoint returns more
 * fields than this; zod strips the unused ones.
 */
export const metaOptionSchema = z.object({
  slug: z.string(),
  display_name: z.string(),
})

export const metaResponseSchema = z.object({
  opportunity_types: z.array(z.string()),
  listing_statuses: z.array(z.string()),
  sectors: z.array(metaOptionSchema),
  stages: z.array(metaOptionSchema),
})

export type MetaOption = z.infer<typeof metaOptionSchema>
export type MetaResponse = z.infer<typeof metaResponseSchema>

/**
 * Mirrors the server `createOpportunitySchema`. Selects are validated as
 * required strings (the options come from `/meta`, so only valid slugs can be
 * chosen) and the backend enforces the real enum membership. Required fields
 * match the legacy form's `validate()`.
 */
export const createOpportunitySchema = z.object({
  opportunity_title: z.string().trim().min(1, 'Opportunity name is required.'),
  opportunity_type: z.string().min(1, 'Please select an opportunity type.'),
  description: z.string().trim().min(1, 'Opportunity description is required.'),
  funder_name: z.string().trim().min(1, 'Organizer name is required.'),
  eligibility_criteria: z.string().trim().min(1).optional(),
  is_women_only: z.boolean().optional(),
  is_equity_free: z.boolean().optional(),
  amount_min: z.number().nonnegative('Amount must be 0 or more.').optional(),
  amount_max: z.number().nonnegative('Amount must be 0 or more.').optional(),
  application_deadline: z.string().optional(),
  status: z.string().optional(),
  sectors: z.array(z.string()).optional(),
  stages: z.array(z.string()).optional(),
  contact_email: z.email('Enter a valid email address.').optional(),
  apply_url: z.url('Enter a valid website URL.').optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
})

export type CreateOpportunityRequest = z.infer<typeof createOpportunitySchema>

export const createOpportunityResponseSchema = z.object({
  id: z.string(),
  reference_code: z.string().nullable().optional(),
  opportunity_title: z.string().optional(),
  approval_status: z.string().optional(),
})

export type CreateOpportunityResponse = z.infer<
  typeof createOpportunityResponseSchema
>
