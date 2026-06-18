import type { Request } from "express";
import type { User } from "@supabase/supabase-js";

/**
 * Request shape after `requireAuth` has run. `user` is the verified Supabase
 * user; `userRole` is populated by `requireRole` when present.
 */
export type AuthenticatedRequest = Request & {
  user: User;
  userRole?: string;
};
