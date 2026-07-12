import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { ApiError, ApiResponse, PaginationMeta } from '#/lib/api'

import { OpportunitiesService } from './opportunities.service'
import type {
  OpportunityDetail,
  OpportunityListFilters,
  OpportunityListItem,
} from './opportunities.types'

export const opportunityKeys = {
  all: ['opportunities'] as const,
  list: (filters: OpportunityListFilters) =>
    [...opportunityKeys.all, 'list', filters] as const,
  detail: (id: string) => [...opportunityKeys.all, 'detail', id] as const,
}

export function useOpportunitiesQuery(filters: OpportunityListFilters = {}) {
  return useQuery<ApiResponse<OpportunityListItem[], PaginationMeta>, ApiError>(
    {
      queryKey: opportunityKeys.list(filters),
      queryFn: () => OpportunitiesService.list(filters),
      placeholderData: keepPreviousData,
    },
  )
}

export function useOpportunityDetailQuery(id: string) {
  return useQuery<OpportunityDetail, ApiError>({
    queryKey: opportunityKeys.detail(id),
    queryFn: () =>
      OpportunitiesService.detail(id).then((response) => response.data),
    enabled: Boolean(id),
  })
}

export function useSaveOpportunityMutation(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (isSaved: boolean) =>
      isSaved ? OpportunitiesService.unsave(id) : OpportunitiesService.save(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.detail(id) })
    },
  })
}
