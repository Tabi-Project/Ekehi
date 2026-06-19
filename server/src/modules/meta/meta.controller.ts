import type { Request, Response } from "express";

import { sendSuccess } from "#/lib/response";
import { getMeta } from "#/modules/meta/meta.service";

export async function getMetaHandler(_request: Request, response: Response) {
  const data = await getMeta();
  sendSuccess(response, {
    status: 200,
    message: "Meta retrieved successfully",
    data,
  });
}
