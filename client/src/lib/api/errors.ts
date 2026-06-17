import type { ErrorEnvelope } from './types'

export class ApiError extends Error {
  readonly status: number
  readonly data?: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error
  if (error instanceof Error) return new ApiError(error.message, 0)
  return new ApiError('Unknown error', 0)
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function isErrorEnvelope(body: unknown): body is ErrorEnvelope {
  return (
    typeof body === 'object' &&
    body !== null &&
    'success' in body &&
    body.success === false
  )
}
