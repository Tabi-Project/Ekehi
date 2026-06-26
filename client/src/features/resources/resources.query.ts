import { useQuery } from '@tanstack/react-query'

import { GuidesService } from './resources.service'
import type { GuideResponse } from './resources.types'

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
