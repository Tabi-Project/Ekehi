import type { Request, Response } from "express";

import { sendSuccess } from "#/lib/response";
import { getValidated } from "#/middleware/validate-request";
import type { AuthenticatedRequest } from "#/types/http";
import type {
  ContentParams,
  QueueQuery,
  ReviewBody,
} from "#/modules/admin/admin.schema";
import * as adminService from "#/modules/admin/admin.service";

export async function getQueue(_request: Request, response: Response) {
  const { query } = getValidated<unknown, unknown, QueueQuery>(response);
  const { items, meta } = await adminService.getQueue(query);

  sendSuccess(response, {
    status: 200,
    message: "Queue retrieved successfully",
    data: items,
    meta,
  });
}

export async function getMySubmissions(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const items = await adminService.getMySubmissions(user.id);

  sendSuccess(response, {
    status: 200,
    message: "Submissions retrieved",
    data: items,
  });
}

export async function getContentItem(_request: Request, response: Response) {
  const { params } = getValidated<unknown, ContentParams>(response);
  const item = await adminService.getContentItem(params.contentType, params.id);

  sendSuccess(response, { status: 200, message: "Item retrieved", data: item });
}

export async function reviewContent(request: Request, response: Response) {
  const { user } = request as AuthenticatedRequest;
  const { params, body } = getValidated<ReviewBody, ContentParams>(response);

  await adminService.reviewContent({
    contentType: params.contentType,
    contentId: params.id,
    reviewerId: user.id,
    decision: body.decision,
    feedback: body.feedback,
  });

  sendSuccess(response, {
    status: 200,
    message: `Content ${body.decision} successfully`,
  });
}

export async function getReviewHistory(_request: Request, response: Response) {
  const { params } = getValidated<unknown, ContentParams>(response);
  const history = await adminService.getReviewHistory(
    params.contentType,
    params.id,
  );

  sendSuccess(response, {
    status: 200,
    message: "Review history retrieved successfully",
    data: history,
  });
}

export async function deleteContent(_request: Request, response: Response) {
  const { params } = getValidated<unknown, ContentParams>(response);
  await adminService.deleteContent(params.contentType, params.id);

  sendSuccess(response, {
    status: 200,
    message: "Content deleted successfully",
  });
}
