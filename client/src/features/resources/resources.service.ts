import { ENDPOINTS } from '#/config/endpoints'
import { makeRequest } from '#/lib/api'

import type { GuideResponse } from './resources.types'

export const GuidesService = {
  byId: (id: string) => {
    const guideRequest = makeRequest<GuideResponse, void>(
      ENDPOINTS.guides.byId(id),
      'GET',
    )
    return guideRequest()
  },
}
