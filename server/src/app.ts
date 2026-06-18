import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { corsOptions } from "#/config/cors";
import { env } from "#/config/env";
import { errorHandler } from "#/middleware/error-handler";
import { sendError } from "#/lib/response";
import { routes } from "#/routes";

export function createApp() {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS
  app.use(cors(corsOptions));

  // Request logging
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  // Body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes (includes health + rate limiters)
  app.use(routes);

  // 404 handler
  app.use((request, response) => {
    sendError(response, {
      status: 404,
      message: `Route ${request.method} ${request.originalUrl} not found`,
    });
  });

  // Global error handler (must be last)
  app.use(errorHandler);

  return app;
}
