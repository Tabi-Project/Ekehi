import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { authKeys } from '#/features/auth/auth.query'
import { AuthService } from '#/features/auth/auth.service'
import type { ProfileResponse } from '#/features/auth/auth.types'
import { getAccessToken } from '#/lib/auth/token-store'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context, location }) => {
    if (!getAccessToken()) {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }

    let profile: ProfileResponse
    try {
      profile = await context.queryClient.fetchQuery({
        queryKey: authKeys.me(),
        queryFn: () => AuthService.me().then((response) => response.data),
      })
    } catch {
      throw redirect({ to: '/login', search: { redirect: location.href } })
    }

    if (profile.role !== 'admin') {
      throw redirect({ to: '/' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}
