import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { optionalAuth, requireAuth } from "#/middleware/authenticate";
import { requireRole } from "#/middleware/require-role";
import { validateRequest } from "#/middleware/validate-request";
import { idParamsSchema, paginationQuery } from "#/lib/validation";
import {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  getSavedOpportunities,
  saveOpportunity,
  unsaveOpportunity,
  updateOpportunity,
} from "#/modules/opportunities/opportunities.controller";
import {
  createOpportunitySchema,
  listOpportunitiesQuery,
  updateOpportunitySchema,
} from "#/modules/opportunities/opportunities.schema";

const contentGuard = [
  asyncHandler(requireAuth),
  asyncHandler(requireRole("super-admin", "data-manager", "content-editor")),
];

export const opportunitiesRouter = Router();

opportunitiesRouter.get(
  "/",
  validateRequest({ query: listOpportunitiesQuery }),
  asyncHandler(getOpportunities),
);

opportunitiesRouter.get(
  "/saved",
  asyncHandler(requireAuth),
  validateRequest({ query: paginationQuery }),
  asyncHandler(getSavedOpportunities),
);

opportunitiesRouter.post(
  "/",
  asyncHandler(requireAuth),
  validateRequest({ body: createOpportunitySchema }),
  asyncHandler(createOpportunity),
);

opportunitiesRouter.get(
  "/:id",
  asyncHandler(optionalAuth),
  validateRequest({ params: idParamsSchema }),
  asyncHandler(getOpportunityById),
);

opportunitiesRouter.put(
  "/:id",
  ...contentGuard,
  validateRequest({ params: idParamsSchema, body: updateOpportunitySchema }),
  asyncHandler(updateOpportunity),
);

opportunitiesRouter.post(
  "/:id/save",
  asyncHandler(requireAuth),
  validateRequest({ params: idParamsSchema }),
  asyncHandler(saveOpportunity),
);

opportunitiesRouter.delete(
  "/:id/save",
  asyncHandler(requireAuth),
  validateRequest({ params: idParamsSchema }),
  asyncHandler(unsaveOpportunity),
);
