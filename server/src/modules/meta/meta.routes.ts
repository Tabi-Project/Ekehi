import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { getMetaHandler } from "#/modules/meta/meta.controller";

export const metaRouter = Router();

metaRouter.get("/", asyncHandler(getMetaHandler));
