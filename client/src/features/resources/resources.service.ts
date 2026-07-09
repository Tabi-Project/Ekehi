import { ENDPOINTS } from '#/config/endpoints'
import { makeRequest } from '#/lib/api'

import type {
  GuideResponse,
  TemplateResponse,
  Training,
} from './resources.types'

export const GuidesService = {
  list: makeRequest<GuideResponse[], void>(ENDPOINTS.guides.list, 'GET'),
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

export const TemplatesService = {
  byId: (id: string) => {
    const templateRequest = makeRequest<TemplateResponse, void>(
      ENDPOINTS.templates.byId(id),
      'GET',
    )
    return templateRequest()
  },
}
