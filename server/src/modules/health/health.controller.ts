import type { Request, Response } from "express";

import {
  checkDatabase,
  type DatabaseCheck,
} from "#/modules/health/health.service";

/**
 * Pure mapper from a dependency check to the HTTP status + envelope. Kept
 * separate from I/O so the status logic is testable without mocking.
 */
export function buildHealthResponse(db: DatabaseCheck) {
  const healthy = db.ok;
  return {
    status: healthy ? 200 : 503,
    body: {
      success: healthy,
      message: healthy ? "Server is healthy" : "Service unavailable",
      data: {
        status: healthy ? "ok" : "degraded",
        uptime: process.uptime(),
        checks: {
          database: db.ok ? "ok" : "down",
        },
      },
    },
  };
}

/**
 * Deep health check. Returns 200 only when every dependency is reachable, 503
 * otherwise, so load balancers route on the status code rather than trusting an
 * unconditional "ok".
 */
export async function getHealth(_request: Request, response: Response) {
  const db = await checkDatabase();
  const { status, body } = buildHealthResponse(db);
  response.status(status).json(body);
}
