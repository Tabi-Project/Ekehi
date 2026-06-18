import type { Request, Response } from "express";

import { sendError, sendSuccess } from "#/lib/response";
import { getValidated } from "#/middleware/validate-request";
import type { IdParams, PaginationQuery } from "#/lib/validation";
import type { AuthenticatedRequest } from "#/types/http";
import type {
  CreateOpportunityInput,
  ListOpportunitiesQuery,
  UpdateOpportunityInput,
} from "#/modules/opportunities/opportunities.schema";
import * as opportunitiesService from "#/modules/opportunities/opportunities.service";

export async function getOpportunities(_request: Request, response: Response) {
  const { query } = getValidated<unknown, unknown, ListOpportunitiesQuery>(
    response,
  );
  const { items, meta } = await opportunitiesService.getOpportunities(query);

  sendSuccess(response, {
    status: 200,
    message: "Opportunities retrieved successfully",
    data: items,
    meta,
  });
}

export async function getOpportunityById(request: Request, response: Response) {
  const { params } = getValidated<unknown, IdParams>(response);
  const { user } = request as Partial<AuthenticatedRequest>;

  const opportunity = await opportunitiesService.getOpportunityById(
    params.id,
    user?.id,
  );

  if (!opportunity) {
    return sendError(response, {
      status: 404,
      message: "Opportunity not found",
    });
  }

  sendSuccess(response, {
    status: 200,
    message: "Opportunity retrieved successfully",
    data: opportunity,
  });
}

export async function createOpportunity(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { body } = getValidated<CreateOpportunityInput>(response);

  const opportunity = await opportunitiesService.createOpportunity(
    user.id,
    body,
  );

  sendSuccess(response, {
    status: 201,
    message: "Opportunity submitted for review",
    data: opportunity,
  });
}

export async function updateOpportunity(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { params, body } = getValidated<UpdateOpportunityInput, IdParams>(
    response,
  );

  const opportunity = await opportunitiesService.updateOpportunity(
    params.id,
    user.id,
    body,
  );

  sendSuccess(response, {
    status: 200,
    message: "Opportunity updated and resubmitted for review",
    data: opportunity,
  });
}

export async function saveOpportunity(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { params } = getValidated<unknown, IdParams>(response);

  await opportunitiesService.saveOpportunity(user.id, params.id);

  sendSuccess(response, { status: 200, message: "Opportunity saved" });
}

export async function unsaveOpportunity(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { params } = getValidated<unknown, IdParams>(response);

  await opportunitiesService.unsaveOpportunity(user.id, params.id);

  sendSuccess(response, {
    status: 200,
    message: "Opportunity removed from saved",
  });
}

export async function getSavedOpportunities(
  request: Request,
  response: Response,
) {
  const { user } = request as AuthenticatedRequest;
  const { query } = getValidated<unknown, unknown, PaginationQuery>(response);

  const { items, meta } = await opportunitiesService.getSavedOpportunities(
    user.id,
    query,
  );

  sendSuccess(response, {
    status: 200,
    message: "Saved opportunities retrieved successfully",
    data: items,
    meta,
  });
}
