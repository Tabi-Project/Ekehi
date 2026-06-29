import { useQuery } from '@tanstack/react-query'

import type { ApiError } from '#/lib/api'

import {
  GuidesService,
  ResourcesService,
  TemplatesService,
} from './resources.service'
import type {
  GuideResponse,
  TemplateResponse,
  Training,
} from './resources.types'

export const guidesKeys = {
  all: ['guides'] as const,
  list: () => [...guidesKeys.all, 'list'] as const,
  detail: (id: string) => [...guidesKeys.all, 'detail', id] as const,
}

export function useGuidesQuery() {
  return useQuery<GuideResponse[], ApiError>({
    queryKey: guidesKeys.list(),
    queryFn: () => GuidesService.list().then((r) => r.data),
  })
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
    queryKey: ['training', id] as const,
    queryFn: async () => {
      const response = await ResourcesService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useTemplateQuery(id: string) {
  return useQuery<TemplateResponse, ApiError>({
    queryKey: ['template', id] as const,
    queryFn: async () => {
      const response = await TemplatesService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}
