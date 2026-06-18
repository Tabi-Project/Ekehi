import type { Request, Response } from "express";

import { sendError, sendSuccess } from "#/lib/response";
import { getValidated } from "#/middleware/validate-request";
import type { IdParams } from "#/lib/validation";
import type { AuthenticatedRequest } from "#/types/http";
import type {
  CreateTemplateInput,
  ListTemplatesQuery,
  UpdateTemplateInput,
} from "#/modules/templates/templates.schema";
import * as templatesService from "#/modules/templates/templates.service";

export async function getTemplates(_request: Request, response: Response) {
  const { query } = getValidated<unknown, unknown, ListTemplatesQuery>(
    response,
  );
  const { items, meta } = await templatesService.getTemplates(query);

  sendSuccess(response, {
    status: 200,
    message: "Templates retrieved successfully",
    data: items,
    meta,
  });
}

export async function getTemplateById(_request: Request, response: Response) {
  const { params } = getValidated<unknown, IdParams>(response);
  const template = await templatesService.getTemplateById(params.id);

  if (!template) {
    return sendError(response, { status: 404, message: "Template not found" });
  }

  sendSuccess(response, {
    status: 200,
    message: "Template retrieved successfully",
    data: template,
  });
}

export async function createTemplate(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { body } = getValidated<CreateTemplateInput>(response);

  const template = await templatesService.createTemplate(user.id, body);

  sendSuccess(response, {
    status: 201,
    message: "Template submitted for review",
    data: template,
  });
}

export async function updateTemplate(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { params, body } = getValidated<UpdateTemplateInput, IdParams>(
    response,
  );

  const template = await templatesService.updateTemplate(
    params.id,
    user.id,
    body,
  );

  sendSuccess(response, {
    status: 200,
    message: "Template updated and resubmitted for review",
    data: template,
  });
}
