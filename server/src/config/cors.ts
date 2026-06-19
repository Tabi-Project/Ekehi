import type { CorsOptions } from "cors";

import { allowedOrigins, env } from "#/config/env";

/**
 * Allow requests with no origin (curl, Postman) and any origin in development.
 * In production, only the configured ALLOWED_ORIGINS are accepted.
 */
export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || env.NODE_ENV === "development") {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
};
