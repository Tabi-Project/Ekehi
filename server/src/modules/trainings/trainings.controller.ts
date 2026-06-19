import type { Request, Response } from "express";

import { sendError, sendSuccess } from "#/lib/response";
import { getValidated } from "#/middleware/validate-request";
import type { IdParams } from "#/lib/validation";
import type { AuthenticatedRequest } from "#/types/http";
import type {
  CreateTrainingInput,
  ListTrainingsQuery,
  UpdateTrainingInput,
} from "#/modules/trainings/trainings.schema";
import * as trainingsService from "#/modules/trainings/trainings.service";

export async function getTrainingProgrammes(
  _request: Request,
  response: Response,
) {
  const { query } = getValidated<unknown, unknown, ListTrainingsQuery>(
    response,
  );
  const { items, meta } = await trainingsService.getTrainingProgrammes(query);

  sendSuccess(response, {
    status: 200,
    message: "Training programmes retrieved successfully",
    data: items,
    meta,
  });
}

export async function getTrainingProgrammeById(
  _request: Request,
  response: Response,
) {
  const { params } = getValidated<unknown, IdParams>(response);
  const programme = await trainingsService.getTrainingProgrammeById(params.id);

  if (!programme) {
    return sendError(response, {
      status: 404,
      message: "Training programme not found",
    });
  }

  sendSuccess(response, {
    status: 200,
    message: "Training programme retrieved successfully",
    data: programme,
  });
}

export async function createTraining(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { body } = getValidated<CreateTrainingInput>(response);

  const training = await trainingsService.createTraining(user.id, body);

  sendSuccess(response, {
    status: 201,
    message: "Training submitted for review",
    data: training,
  });
}

export async function updateTraining(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { params, body } = getValidated<UpdateTrainingInput, IdParams>(
    response,
  );

  const training = await trainingsService.updateTraining(
    params.id,
    user.id,
    body,
  );

  sendSuccess(response, {
    status: 200,
    message: "Training updated and resubmitted for review",
    data: training,
  });
}
