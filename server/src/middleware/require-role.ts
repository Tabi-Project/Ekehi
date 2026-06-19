import type { NextFunction, Request, Response } from "express";

import { HttpError } from "#/lib/http-error";
import { supabase } from "#/lib/supabase";
import type { AuthenticatedRequest } from "#/types/http";

/**
 * Factory returning middleware that checks the authenticated user's profile
 * role against the allowed list. Must run AFTER `requireAuth`.
 *
 *   router.post("/", requireAuth, requireRole("super-admin"), handler)
 */
export function requireRole(...roles: string[]) {
  return async (request: Request, _response: Response, next: NextFunction) => {
    const { user } = request as AuthenticatedRequest;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      throw new HttpError(403, "Could not verify role");
    }

    const role = profile.role as string;

    if (!roles.includes(role)) {
      throw new HttpError(
        403,
        `Access denied. Required role: ${roles.join(" or ")}`,
      );
    }

    (request as AuthenticatedRequest).userRole = role;
    next();
  };
}
