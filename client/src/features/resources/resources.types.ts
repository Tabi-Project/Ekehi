import { z } from 'zod'

export const guideResponseSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  summary: z.string().optional(),
  category: z.string().optional(),
  content: z.string().optional(),
  submitted_by: z.string().optional(),
  approval_status: z.enum(['pending', 'approved', 'rejected']).optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type GuideResponse = z.infer<typeof guideResponseSchema>

export interface Training {
  id: string
  programme_name: string
  programme_type: string
  description: string
  provider: string
  format: 'online' | 'in_person' | 'hybrid'
  application_deadline: string | null
  apply_url?: string
  location_scope?: string
}

export const templateResponseSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  description: z.string().nullable(),
  category: z.string().nullable(),
  content: z.string().nullable(),
  file_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type TemplateResponse = z.infer<typeof templateResponseSchema>

export const listGuidesResponseSchema = z.array(guideResponseSchema)
export type ListGuidesResponse = z.infer<typeof listGuidesResponseSchema>

// List item schemas mirror the columns each server list endpoint selects —
// narrower than the detail responses above.

export const trainingListItemSchema = z.object({
  id: z.string(),
  reference_code: z.string().nullable(),
  programme_name: z.string(),
  provider: z.string().nullable(),
  programme_type: z.string(),
  format: z.string(),
  duration_range: z.string(),
  cost: z.string().nullable(),
  currency: z.string().nullable(),
  cost_type: z.string(),
  certification: z.string().nullable(),
  topics_covered: z.string().nullable(),
  location: z.string().nullable(),
  location_scope: z.string(),
  application_deadline: z.string().nullable(),
  apply_url: z.string().nullable(),
  is_featured: z.boolean().nullable(),
  description: z.string().nullable(),
  created_at: z.string(),
})

export type TrainingListItem = z.infer<typeof trainingListItemSchema>

export const guideListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string().nullish(),
  category: z.string().nullish(),
  created_at: z.string(),
})

export type GuideListItem = z.infer<typeof guideListItemSchema>

export const templateListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  category: z.string().nullable(),
  file_url: z.string().nullable(),
  created_at: z.string(),
})

export type TemplateListItem = z.infer<typeof templateListItemSchema>

export type TrainingListFilters = {
  search?: string
  programme_type?: string
  format?: string
  cost_type?: string
  duration_range?: string
  location_scope?: string
  is_featured?: boolean
  page?: number
  limit?: number
}

export type GuideListFilters = {
  search?: string
  category?: string
  page?: number
  limit?: number
}

export type TemplateListFilters = GuideListFilters
