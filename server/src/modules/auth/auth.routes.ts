import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { upload } from "#/middleware/upload";
import { validateRequest } from "#/middleware/validate-request";
import {
  refresh,
  signIn,
  signOut,
  signUp,
} from "#/modules/auth/auth.controller";
import {
  loginSchema,
  refreshSchema,
  signupSchema,
} from "#/modules/auth/auth.schema";

export const authRouter = Router();

authRouter.post(
  "/signup",
  upload.single("profileImage"),
  validateRequest({ body: signupSchema }),
  asyncHandler(signUp),
);

authRouter.post(
  "/login",
  validateRequest({ body: loginSchema }),
  asyncHandler(signIn),
);

authRouter.post("/logout", asyncHandler(signOut));

authRouter.post(
  "/refresh",
  validateRequest({ body: refreshSchema }),
  asyncHandler(refresh),
);
