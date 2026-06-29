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
