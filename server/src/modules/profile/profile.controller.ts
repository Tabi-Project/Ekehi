import type { Request, Response } from "express";

import { HttpError } from "#/lib/http-error";
import { sendSuccess } from "#/lib/response";
import { getValidated } from "#/middleware/validate-request";
import type { AuthenticatedRequest } from "#/types/http";
import type { UpdateProfileInput } from "#/modules/profile/profile.schema";
import * as profileService from "#/modules/profile/profile.service";

export async function getProfile(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const profile = await profileService.getProfile(user.id);

  sendSuccess(response, {
    status: 200,
    message: "Profile retrieved successfully",
    data: profile,
  });
}

export async function updateProfile(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { body } = getValidated<UpdateProfileInput>(response);
  const { file } = request;
  const profileImage = file
    ? { buffer: file.buffer, mimetype: file.mimetype }
    : null;

  if (!body.firstName && !body.lastName && !profileImage) {
    throw new HttpError(
      400,
      "Provide at least one field to update: firstName, lastName, or profile_image",
    );
  }

  const profile = await profileService.updateProfile({
    userId: user.id,
    fields: body,
    profileImage,
  });

  sendSuccess(response, {
    status: 200,
    message: "Profile updated successfully",
    data: profile,
  });
}
