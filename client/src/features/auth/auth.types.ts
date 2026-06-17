import { z } from 'zod'

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})
export type LoginRequest = z.infer<typeof loginRequestSchema>

export const sessionUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: z.string().optional(),
})
export type SessionUser = z.infer<typeof sessionUserSchema>

export const loginResponseSchema = z.object({
  user: sessionUserSchema,
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number().optional(),
})
export type LoginResponse = z.infer<typeof loginResponseSchema>

export const signupRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  profileImage: z.instanceof(File).optional(),
})
export type SignupRequest = z.infer<typeof signupRequestSchema>

export const signupResponseSchema = z.object({
  user: z
    .object({
      id: z.string(),
      email: z.email(),
    })
    .nullable(),
  session: z
    .object({
      access_token: z.string(),
      refresh_token: z.string(),
      expires_at: z.number().optional(),
    })
    .nullable()
    .optional(),
})
export type SignupResponse = z.infer<typeof signupResponseSchema>

export const refreshResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number().optional(),
})
export type RefreshResponse = z.infer<typeof refreshResponseSchema>

export const profileResponseSchema = z.object({
  id: z.string(),
  email: z.email(),
  first_name: z.string().nullable(),
  last_name: z.string().nullable(),
  profile_image_path: z.string().nullable(),
  profile_image_url: z.string().nullable().optional(),
  role: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
})
export type ProfileResponse = z.infer<typeof profileResponseSchema>
