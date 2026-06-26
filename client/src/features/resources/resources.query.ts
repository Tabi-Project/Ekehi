import { useQuery } from '@tanstack/react-query'

import { GuidesService, TemplatesService } from './resources.service'
import type { GuideResponse, TemplateResponse } from './resources.types'

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

export function useTemplateQuery(id: string) {
  return useQuery<TemplateResponse, Error>({
    queryKey: ['template', id] as const,
    queryFn: async () => {
      const response = await TemplatesService.byId(id)
      return response.data
    },
    enabled: !!id,
  })
}
