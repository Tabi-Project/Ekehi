import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
