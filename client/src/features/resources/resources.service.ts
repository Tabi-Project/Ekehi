import { ENDPOINTS } from '#/config/endpoints'
import type { PaginationMeta } from '#/lib/api'
import { makeRequest } from '#/lib/api'

import type {
  GuideListFilters,
  GuideListItem,
  GuideResponse,
  TemplateListFilters,
  TemplateListItem,
  TemplateResponse,
  Training,
  TrainingListFilters,
  TrainingListItem,
} from './resources.types'

export const GuidesService = {
  list: (filters: GuideListFilters = {}) =>
    makeRequest<GuideListItem[], GuideListFilters, PaginationMeta>(
      ENDPOINTS.guides.list,
      'GET',
    )({ data: filters }),
  byId: (id: string) => {
    const guideRequest = makeRequest<GuideResponse, void>(
      ENDPOINTS.guides.byId(id),
      'GET',
    )
    return guideRequest()
  },
}

export const TrainingService = {
  list: (filters: TrainingListFilters = {}) =>
    makeRequest<TrainingListItem[], TrainingListFilters, PaginationMeta>(
      ENDPOINTS.training.list,
      'GET',
    )({ data: filters }),
  byId: (id: string) => {
    const trainingRequest = makeRequest<Training, void>(
      ENDPOINTS.training.byId(id),
      'GET',
    )
    return trainingRequest()
  },
}

export const TemplatesService = {
  list: (filters: TemplateListFilters = {}) =>
    makeRequest<TemplateListItem[], TemplateListFilters, PaginationMeta>(
      ENDPOINTS.templates.list,
      'GET',
    )({ data: filters }),
  byId: (id: string) => {
    const templateRequest = makeRequest<TemplateResponse, void>(
      ENDPOINTS.templates.byId(id),
      'GET',
    )
    return templateRequest()
  },
}
