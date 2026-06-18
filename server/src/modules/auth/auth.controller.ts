import type { Request, Response } from "express";

import { HttpError } from "#/lib/http-error";
import { sendSuccess } from "#/lib/response";
import { getValidated } from "#/middleware/validate-request";
import * as authService from "#/modules/auth/auth.service";
import type {
  LoginInput,
  RefreshInput,
  SignupInput,
} from "#/modules/auth/auth.schema";

const BEARER_PREFIX = "Bearer ";

export async function signUp(request: Request, response: Response) {
  const { body } = getValidated<SignupInput>(response);
  const { file } = request;
  const profileImage = file
    ? { buffer: file.buffer, mimetype: file.mimetype }
    : null;

  const data = await authService.signUp({ ...body, profileImage });

  sendSuccess(response, {
    status: 201,
    message:
      "Account created successfully. Please check your email to confirm your account.",
    data: {
      user: data.user ? { id: data.user.id, email: data.user.email } : null,
      session: data.session,
    },
  });
}

export async function signIn(_request: Request, response: Response) {
  const { body } = getValidated<LoginInput>(response);
  const data = await authService.signIn(body);

  if (!data.session) {
    throw new HttpError(401, "Authentication failed");
  }

  sendSuccess(response, {
    status: 200,
    message: "Login successful",
    data: {
      user: { id: data.user.id, email: data.user.email, role: data.role },
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  });
}

export async function signOut(request: Request, response: Response) {
  const header = request.headers.authorization;

  if (!header || !header.startsWith(BEARER_PREFIX)) {
    throw new HttpError(401, "Missing Authorization header");
  }

  const token = header.slice(BEARER_PREFIX.length).trim();
  await authService.signOut(token);

  sendSuccess(response, { status: 200, message: "Logged out successfully" });
}

export async function refresh(_request: Request, response: Response) {
  const { body } = getValidated<RefreshInput>(response);
  const session = await authService.refreshSession(body.refresh_token);

  sendSuccess(response, {
    status: 200,
    message: "Token refreshed successfully",
    data: {
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
    },
  });
}
