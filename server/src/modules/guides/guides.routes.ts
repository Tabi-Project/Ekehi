import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { requireAuth } from "#/middleware/authenticate";
import { requireRole } from "#/middleware/require-role";
import { validateRequest } from "#/middleware/validate-request";
import { idParamsSchema } from "#/lib/validation";
import {
  createGuide,
  getGuideById,
  getGuides,
  updateGuide,
} from "#/modules/guides/guides.controller";
import {
  createGuideSchema,
  guideIdOrSlugParamsSchema,
  listGuidesQuery,
  updateGuideSchema,
} from "#/modules/guides/guides.schema";

const contentGuard = [
  asyncHandler(requireAuth),
  asyncHandler(requireRole("super-admin", "data-manager", "content-editor")),
];

export const guidesRouter = Router();

guidesRouter.get(
  "/",
  validateRequest({ query: listGuidesQuery }),
  asyncHandler(getGuides),
);

guidesRouter.post(
  "/",
  ...contentGuard,
  validateRequest({ body: createGuideSchema }),
  asyncHandler(createGuide),
);

guidesRouter.get(
  "/:id",
  validateRequest({ params: guideIdOrSlugParamsSchema }),
  asyncHandler(getGuideById),
);

guidesRouter.put(
  "/:id",
  ...contentGuard,
  validateRequest({ params: idParamsSchema, body: updateGuideSchema }),
  asyncHandler(updateGuide),
);
