import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { requireAuth } from "#/middleware/authenticate";
import { requireRole } from "#/middleware/require-role";
import { validateRequest } from "#/middleware/validate-request";
import { idParamsSchema } from "#/lib/validation";
import {
  createTraining,
  getTrainingProgrammeById,
  getTrainingProgrammes,
  updateTraining,
} from "#/modules/trainings/trainings.controller";
import {
  createTrainingSchema,
  listTrainingsQuery,
  updateTrainingSchema,
} from "#/modules/trainings/trainings.schema";

const contentGuard = [
  asyncHandler(requireAuth),
  asyncHandler(requireRole("super-admin", "data-manager", "content-editor")),
];

export const trainingsRouter = Router();

trainingsRouter.get(
  "/",
  validateRequest({ query: listTrainingsQuery }),
  asyncHandler(getTrainingProgrammes),
);

trainingsRouter.post(
  "/",
  ...contentGuard,
  validateRequest({ body: createTrainingSchema }),
  asyncHandler(createTraining),
);

trainingsRouter.get(
  "/:id",
  validateRequest({ params: idParamsSchema }),
  asyncHandler(getTrainingProgrammeById),
);

trainingsRouter.put(
  "/:id",
  ...contentGuard,
  validateRequest({ params: idParamsSchema, body: updateTrainingSchema }),
  asyncHandler(updateTraining),
);
