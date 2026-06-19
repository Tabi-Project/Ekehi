import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { requireAuth } from "#/middleware/authenticate";
import { upload } from "#/middleware/upload";
import { validateRequest } from "#/middleware/validate-request";
import {
  getProfile,
  updateProfile,
} from "#/modules/profile/profile.controller";
import { updateProfileSchema } from "#/modules/profile/profile.schema";

export const profileRouter = Router();

profileRouter.get("/", asyncHandler(requireAuth), asyncHandler(getProfile));

profileRouter.patch(
  "/",
  asyncHandler(requireAuth),
  upload.single("profileImage"),
  validateRequest({ body: updateProfileSchema }),
  asyncHandler(updateProfile),
);
