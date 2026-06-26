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
