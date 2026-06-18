import { Router } from "express";

import { asyncHandler } from "#/lib/async-handler";
import { requireAuth } from "#/middleware/authenticate";
import { requireRole } from "#/middleware/require-role";
import { validateRequest } from "#/middleware/validate-request";
import { idParamsSchema } from "#/lib/validation";
import {
  createTemplate,
  getTemplateById,
  getTemplates,
  updateTemplate,
} from "#/modules/templates/templates.controller";
import {
  createTemplateSchema,
  listTemplatesQuery,
  updateTemplateSchema,
} from "#/modules/templates/templates.schema";

const contentGuard = [
  asyncHandler(requireAuth),
  asyncHandler(requireRole("super-admin", "data-manager", "content-editor")),
];

export const templatesRouter = Router();

templatesRouter.get(
  "/",
  validateRequest({ query: listTemplatesQuery }),
  asyncHandler(getTemplates),
);

templatesRouter.post(
  "/",
  ...contentGuard,
  validateRequest({ body: createTemplateSchema }),
  asyncHandler(createTemplate),
);

templatesRouter.get(
  "/:id",
  validateRequest({ params: idParamsSchema }),
  asyncHandler(getTemplateById),
);

templatesRouter.put(
  "/:id",
  ...contentGuard,
  validateRequest({ params: idParamsSchema, body: updateTemplateSchema }),
  asyncHandler(updateTemplate),
);
