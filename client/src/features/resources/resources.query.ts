import { useQuery } from '@tanstack/react-query'

import { GuidesService, ResourcesService } from './resources.service'
import type { GuideResponse, Training } from './resources.types'

export function useGuideQuery(id: string) {
  return useQuery<GuideResponse, Error>({
    queryKey: ['guide', id] as const,
    queryFn: async () => {
      const response = await GuidesService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}

export function useTrainingQuery(id: string) {
  return useQuery<Training, Error>({
    queryKey: ['training', id] as const,
    queryFn: async () => {
      const response = await ResourcesService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}
