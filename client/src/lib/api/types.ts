export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export type FetchInit = Omit<RequestInit, 'body' | 'method'>

export type RequestProps<TRequest = unknown> = {
  data?: TRequest
  requestConfig?: FetchInit
}

export type ApiResponse<TData, TMeta = unknown> = {
  data: TData
  meta?: TMeta
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export type SuccessEnvelope<TData, TMeta = unknown> = {
  success: true
  message: string
  data: TData
  meta?: TMeta
}

export type ErrorEnvelope = {
  success: false
  message: string
  data?: unknown
}
