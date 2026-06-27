import { useMutation, useQuery } from '@tanstack/react-query'

import type { ApiError } from '#/lib/api'
import { getAccessToken } from '#/lib/auth/token-store'

import { MetaService, SubmissionsService } from './submissions.service'
import type {
  CreateOpportunityRequest,
  CreateOpportunityResponse,
  MetaResponse,
} from './submissions.types'

export const metaKeys = {
  all: ['meta'] as const,
}

export function useMetaQuery() {
  return useQuery<MetaResponse, ApiError>({
    queryKey: metaKeys.all,
    queryFn: () => MetaService.get().then((response) => response.data),
    enabled: Boolean(getAccessToken()),
  })
}

export function useCreateOpportunityMutation() {
  return useMutation<
    CreateOpportunityResponse,
    ApiError,
    CreateOpportunityRequest
  >({
    mutationFn: (data) =>
      SubmissionsService.create(data).then((response) => response.data),
  })
}
