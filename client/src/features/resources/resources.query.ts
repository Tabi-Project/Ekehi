import { queryOptions, useQuery } from '@tanstack/react-query'

import type { ApiError } from '#/lib/api'

import {
  GuidesService,
  TemplatesService,
  TrainingService,
} from './resources.service'
import type {
  GuideListFilters,
  GuideResponse,
  TemplateListFilters,
  TemplateResponse,
  Training,
  TrainingListFilters,
} from './resources.types'

/** The resources overview shows the first row of each list. */
export const OVERVIEW_LIST_FILTERS = { limit: 3 } as const

export const guidesKeys = {
  all: ['guides'] as const,
  list: (filters: GuideListFilters = {}) =>
    [...guidesKeys.all, 'list', filters] as const,
  detail: (id: string) => [...guidesKeys.all, 'detail', id] as const,
}

export const trainingKeys = {
  all: ['training'] as const,
  list: (filters: TrainingListFilters = {}) =>
    [...trainingKeys.all, 'list', filters] as const,
  detail: (id: string) => [...trainingKeys.all, 'detail', id] as const,
}

export const templateKeys = {
  all: ['templates'] as const,
  list: (filters: TemplateListFilters = {}) =>
    [...templateKeys.all, 'list', filters] as const,
  detail: (id: string) => [...templateKeys.all, 'detail', id] as const,
}

// Shared between route loaders (ensureQueryData) and components
// (useQuery/useSuspenseQueries) so both sides hit the same cache entry.

export function guidesListOptions(filters: GuideListFilters = {}) {
  return queryOptions({
    queryKey: guidesKeys.list(filters),
    queryFn: () => GuidesService.list(filters).then((r) => r.data),
  })
}

export function trainingsListOptions(filters: TrainingListFilters = {}) {
  return queryOptions({
    queryKey: trainingKeys.list(filters),
    queryFn: () => TrainingService.list(filters).then((r) => r.data),
  })
}

export function templatesListOptions(filters: TemplateListFilters = {}) {
  return queryOptions({
    queryKey: templateKeys.list(filters),
    queryFn: () => TemplatesService.list(filters).then((r) => r.data),
  })
}

export function useGuidesQuery(filters: GuideListFilters = {}) {
  return useQuery(guidesListOptions(filters))
}

export function useGuideQuery(id: string) {
  return useQuery<GuideResponse, ApiError>({
    queryKey: guidesKeys.detail(id),
    queryFn: async () => {
      const response = await GuidesService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useTrainingQuery(id: string) {
  return useQuery<Training, ApiError>({
    queryKey: trainingKeys.detail(id),
    queryFn: async () => {
      const response = await TrainingService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useTemplateQuery(id: string) {
  return useQuery<TemplateResponse, ApiError>({
    queryKey: templateKeys.detail(id),
    queryFn: async () => {
      const response = await TemplatesService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}
