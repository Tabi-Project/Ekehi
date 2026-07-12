import { ENDPOINTS } from '#/config/endpoints'
import type { PaginationMeta } from '#/lib/api'
import { makeRequest } from '#/lib/api'

import type {
  OpportunityDetail,
  OpportunityListFilters,
  OpportunityListItem,
} from './opportunities.types'

export const OpportunitiesService = {
  list: (filters: OpportunityListFilters = {}) =>
    makeRequest<OpportunityListItem[], OpportunityListFilters, PaginationMeta>(
      ENDPOINTS.opportunities.list,
      'GET',
    )({ data: filters }),
  detail: (id: string) =>
    makeRequest<OpportunityDetail>(ENDPOINTS.opportunities.detail(id), 'GET')(),
  save: (id: string) => makeRequest(ENDPOINTS.opportunities.save(id), 'POST')(),
  unsave: (id: string) =>
    makeRequest(ENDPOINTS.opportunities.unsave(id), 'DELETE')(),
}
