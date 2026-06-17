import { createFileRoute, Outlet } from '@tanstack/react-router'

import { Footer } from '#/components/layout/footer'
import { Navbar } from '#/components/layout/navbar'

export const Route = createFileRoute('/(layout)')({
  component: SiteLayout,
})

function SiteLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
