import type { NextFunction, Request, Response } from "express";

import { HttpError } from "#/lib/http-error";
import { supabase } from "#/lib/supabase";
import type { AuthenticatedRequest } from "#/types/http";

const BEARER_PREFIX = "Bearer ";

function extractBearerToken(request: Request): string | null {
  const header = request.headers.authorization;
  if (!header || !header.startsWith(BEARER_PREFIX)) return null;
  const token = header.slice(BEARER_PREFIX.length).trim();
  return token || null;
}

/**
 * Requires a valid Supabase access token. Attaches the verified user to
 * `req.user`. Throws 401 when the token is missing or invalid.
 */
export async function requireAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const token = extractBearerToken(request);

  if (!token) {
    throw new HttpError(401, "Missing or invalid Authorization header");
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    throw new HttpError(401, "Invalid or expired token");
  }

  (request as AuthenticatedRequest).user = data.user;
  next();
}

/**
 * Attaches `req.user` when a valid token is present, otherwise continues
 * unauthenticated. Used by endpoints whose response varies for signed-in users.
 */
export async function optionalAuth(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const token = extractBearerToken(request);
  if (!token) return next();

  const { data } = await supabase.auth.getUser(token);
  if (data?.user) {
    (request as AuthenticatedRequest).user = data.user;
  }

  next();
}
