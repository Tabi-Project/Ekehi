import { z } from 'zod'

export const opportunityDetailSchema = z.object({
  id: z.string(),
  opportunity_title: z.string(),
  funder_name: z.string(),
  opportunity_type: z.string(),
  status: z.string(),
  amount_min: z.number().nullable(),
  amount_max: z.number().nullable(),
  currency: z.string().nullable(),
  application_deadline: z.string().nullable(),
  sector: z.string().nullable(),
  stage: z.string().nullable(),
  country: z.string().nullable(),
  description: z.string().nullable(),
  eligibility_criteria: z.string().nullable(),
  apply_url: z.string().nullable(),
  contact_email: z.string().nullable(),
  reference_code: z.string().nullable(),
  sectors: z.array(z.string()).nullable(),
  stages: z.array(z.string()).nullable(),
  is_saved: z.boolean().nullable(),
  is_women_only: z.boolean().nullable(),
  is_equity_free: z.boolean().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type OpportunityDetail = z.infer<typeof opportunityDetailSchema>
