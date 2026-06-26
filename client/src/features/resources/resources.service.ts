import { ENDPOINTS } from '#/config/endpoints'
import { makeRequest } from '#/lib/api'

import type { GuideResponse, TemplateResponse } from './resources.types'

export const GuidesService = {
  byId: (id: string) => {
    const guideRequest = makeRequest<GuideResponse, void>(
      ENDPOINTS.guides.byId(id),
      'GET',
    )
    return guideRequest()
  },
}

export const TemplatesService = {
  byId: (id: string) => {
    const templateRequest = makeRequest<TemplateResponse, void>(
      ENDPOINTS.templates.byId(id),
      'GET',
    )
    return templateRequest()
  },
}
