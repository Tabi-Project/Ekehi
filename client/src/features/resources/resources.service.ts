import { ENDPOINTS } from '#/config/endpoints'
import { makeRequest } from '#/lib/api'

import type { GuideResponse, Training } from './resources.types'

export const GuidesService = {
  byId: (id: string) => {
    const guideRequest = makeRequest<GuideResponse, void>(
      ENDPOINTS.guides.byId(id),
      'GET',
    )
    return guideRequest()
  },
}

export const ResourcesService = {
  byId: (id: string) => {
    const trainingRequest = makeRequest<Training, void>(
      ENDPOINTS.training.byId(id),
      'GET',
    )
    return trainingRequest()
  },
}
