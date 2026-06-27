import { ENDPOINTS } from '#/config/endpoints'
import { makeRequest } from '#/lib/api'

import type { OpportunityDetail } from './opportunities.types'

export const OpportunitiesService = {
  detail: (id: string) =>
    makeRequest<OpportunityDetail>(ENDPOINTS.opportunities.detail(id), 'GET')(),
  save: (id: string) => makeRequest(ENDPOINTS.opportunities.save(id), 'POST')(),
  unsave: (id: string) =>
    makeRequest(ENDPOINTS.opportunities.unsave(id), 'DELETE')(),
}
