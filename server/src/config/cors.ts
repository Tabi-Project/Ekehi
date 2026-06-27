import type { CorsOptions } from "cors";

import { allowedOrigins, env } from "#/config/env";

/**
 * Matches the production Netlify domain and any Netlify deploy preview /
 * branch deploy for the site, e.g.
 *   https://ekehi.netlify.app
 *   https://deploy-preview-161--ekehi.netlify.app
 *   https://some-branch--ekehi.netlify.app
 */
const NETLIFY_ORIGIN = /^https:\/\/([a-z0-9-]+--)?ekehi\.netlify\.app$/;

export function isOriginAllowed(
  origin: string,
  origins: readonly string[],
): boolean {
  return origins.includes(origin) || NETLIFY_ORIGIN.test(origin);
}

/**
 * Allow requests with no origin (curl, Postman) and any origin in development.
 * In production, accept configured ALLOWED_ORIGINS plus Netlify previews.
 */
export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.NODE_ENV === "development") {
      callback(null, true);
      return;
    }

    if (isOriginAllowed(origin, allowedOrigins)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
};
