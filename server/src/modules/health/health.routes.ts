import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { getHealth } from "#/modules/health/health.controller";

export const healthRouter = Router();

healthRouter.get("/", asyncHandler(getHealth));
