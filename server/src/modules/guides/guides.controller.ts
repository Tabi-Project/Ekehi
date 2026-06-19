import type { Request, Response } from "express";

import { sendError, sendSuccess } from "#/lib/response";
import { getValidated } from "#/middleware/validate-request";
import type { IdParams } from "#/lib/validation";
import type { AuthenticatedRequest } from "#/types/http";
import type {
  CreateGuideInput,
  ListGuidesQuery,
  UpdateGuideInput,
} from "#/modules/guides/guides.schema";
import * as guidesService from "#/modules/guides/guides.service";

export async function getGuides(_request: Request, response: Response) {
  const { query } = getValidated<unknown, unknown, ListGuidesQuery>(response);
  const { items, meta } = await guidesService.getGuides(query);

  sendSuccess(response, {
    status: 200,
    message: "Guides retrieved successfully",
    data: items,
    meta,
  });
}

export async function getGuideById(_request: Request, response: Response) {
  const { params } = getValidated<unknown, IdParams>(response);
  const guide = await guidesService.getGuideById(params.id);

  if (!guide) {
    return sendError(response, { status: 404, message: "Guide not found" });
  }

  sendSuccess(response, {
    status: 200,
    message: "Guide retrieved successfully",
    data: guide,
  });
}

export async function createGuide(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { body } = getValidated<CreateGuideInput>(response);

  const guide = await guidesService.createGuide(user.id, body);

  sendSuccess(response, {
    status: 201,
    message: "Guide submitted for review",
    data: guide,
  });
}

export async function updateGuide(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { params, body } = getValidated<UpdateGuideInput, IdParams>(response);

  const guide = await guidesService.updateGuide(params.id, user.id, body);

  sendSuccess(response, {
    status: 200,
    message: "Guide updated and resubmitted for review",
    data: guide,
  });
}
