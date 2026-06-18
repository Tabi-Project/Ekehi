import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { requireAuth } from "#/middleware/authenticate";
import { requireRole } from "#/middleware/require-role";
import { validateRequest } from "#/middleware/validate-request";
import {
  deleteContent,
  getContentItem,
  getMySubmissions,
  getQueue,
  getReviewHistory,
  reviewContent,
} from "#/modules/admin/admin.controller";
import {
  contentParamsSchema,
  queueQuerySchema,
  reviewBodySchema,
} from "#/modules/admin/admin.schema";

const adminGuard = [
  asyncHandler(requireAuth),
  asyncHandler(requireRole("super-admin", "data-manager", "content-editor")),
];

export const adminRouter = Router();

adminRouter.get(
  "/queue",
  ...adminGuard,
  validateRequest({ query: queueQuerySchema }),
  asyncHandler(getQueue),
);

adminRouter.get(
  "/my-submissions",
  ...adminGuard,
  asyncHandler(getMySubmissions),
);

adminRouter.get(
  "/:contentType/:id",
  ...adminGuard,
  validateRequest({ params: contentParamsSchema }),
  asyncHandler(getContentItem),
);

adminRouter.patch(
  "/:contentType/:id/review",
  ...adminGuard,
  validateRequest({ params: contentParamsSchema, body: reviewBodySchema }),
  asyncHandler(reviewContent),
);

adminRouter.get(
  "/:contentType/:id/reviews",
  ...adminGuard,
  validateRequest({ params: contentParamsSchema }),
  asyncHandler(getReviewHistory),
);

adminRouter.delete(
  "/:contentType/:id",
  ...adminGuard,
  validateRequest({ params: contentParamsSchema }),
  asyncHandler(deleteContent),
);
