import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

import { getAccessToken } from '@/lib/auth/token-store'

export const Route = createFileRoute('/(layout)/(protected)')({
  beforeLoad: ({ location }) => {
    if (!getAccessToken()) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return <Outlet />
}
