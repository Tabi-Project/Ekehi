import { env } from '@/config/env'
import { getAccessToken } from '@/lib/auth/token-store'

import { ApiError, isErrorEnvelope, normalizeError } from './errors'
import { refreshSession } from './refresh'
import type {
  ApiResponse,
  FetchInit,
  HttpMethod,
  RequestProps,
  SuccessEnvelope,
} from './types'

const AUTH_PATH_PREFIX = '/auth/'

export function makeRequest<
  TData = unknown,
  TRequest = unknown,
  TMeta = unknown,
>(route: string, method: HttpMethod = 'POST') {
  return (
    options: RequestProps<TRequest> = {},
  ): Promise<ApiResponse<TData, TMeta>> =>
    executeRequest<TRequest>(route, method, options, false).then((body) =>
      parseResponse<TData, TMeta>(body),
    )
}

async function executeRequest<TRequest>(
  route: string,
  method: HttpMethod,
  options: RequestProps<TRequest>,
  isRetry: boolean,
): Promise<unknown> {
  const { data, requestConfig } = options

  try {
    const response = await fetch(
      buildUrl(route, method, data),
      buildInit(method, data, requestConfig),
    )

    if (
      response.status === 401 &&
      !isRetry &&
      !route.startsWith(AUTH_PATH_PREFIX)
    ) {
      const refreshed = await refreshSession()
      if (refreshed)
        return executeRequest<TRequest>(route, method, options, true)
    }

    const body = await readBody(response)

    if (!response.ok || isErrorEnvelope(body)) {
      const message = isErrorEnvelope(body) ? body.message : response.statusText
      const errorData = isErrorEnvelope(body) ? body.data : undefined
      throw new ApiError(message, response.status, errorData)
    }

    return body
  } catch (raw) {
    throw normalizeError(raw)
  }
}

function buildUrl(route: string, method: HttpMethod, data: unknown): string {
  const url = `${env.VITE_API_BASE_URL}${route}`
  if (method !== 'GET' || !data || typeof data !== 'object') return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (value === undefined || value === null) continue
    params.append(key, String(value))
  }
  const queryString = params.toString()
  return queryString ? `${url}?${queryString}` : url
}

function buildInit(
  method: HttpMethod,
  data: unknown,
  extra: FetchInit | undefined,
): RequestInit {
  const headers: Record<string, string> = {
    ...(extra?.headers as Record<string, string> | undefined),
  }

  const token = getAccessToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  if (method === 'GET' || data === undefined) {
    return { method, ...extra, headers }
  }

  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    return { method, ...extra, headers, body: data }
  }

  headers['Content-Type'] = 'application/json'
  return { method, ...extra, headers, body: JSON.stringify(data) }
}

async function readBody(response: Response): Promise<unknown> {
  if (response.status === 204) return undefined
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) return response.json()
  return response.text()
}

function parseResponse<TData, TMeta>(body: unknown): ApiResponse<TData, TMeta> {
  if (body === undefined) {
    return { data: undefined as TData }
  }
  if (
    body === null ||
    typeof body !== 'object' ||
    !('success' in body) ||
    body.success !== true ||
    !('data' in body)
  ) {
    throw new ApiError('Unexpected response shape from server', 0, body)
  }
  const envelope = body as SuccessEnvelope<TData, TMeta>
  return { data: envelope.data, meta: envelope.meta }
}
