import { ENDPOINTS } from '#/config/endpoints'
import { makeRequest } from '#/lib/api'

import type {
  CreateOpportunityRequest,
  CreateOpportunityResponse,
  MetaResponse,
} from './submissions.types'

export const MetaService = {
  get: () => {
    const metaRequest = makeRequest<MetaResponse, void>(
      ENDPOINTS.meta.get,
      'GET',
    )
    return metaRequest()
  },
}

export const SubmissionsService = {
  create: (data: CreateOpportunityRequest) => {
    const createRequest = makeRequest<
      CreateOpportunityResponse,
      CreateOpportunityRequest
    >(ENDPOINTS.opportunities.create, 'POST')
    return createRequest({ data })
  },
}
