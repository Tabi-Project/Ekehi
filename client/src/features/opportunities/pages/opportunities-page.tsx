import { Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '#/components/ui/button'
import { FilterDropdown } from '#/components/ui/filter-dropdown'
import { Input } from '#/components/ui/input'
import { EKEHI_ENUMS, toOptions } from '#/constants/enums'

import { OpportunityRowCard } from '../components/opportunity-row-card'
import { useOpportunitiesQuery } from '../opportunities.query'
import type { OpportunityListFilters } from '../opportunities.types'

const FILTER_SELECTS = [
  {
    key: 'sector',
    placeholder: 'Sector',
    options: toOptions(EKEHI_ENUMS.sector),
  },
  {
    key: 'status',
    placeholder: 'Status',
    options: toOptions(EKEHI_ENUMS.listingStatus),
  },
  {
    key: 'stage',
    placeholder: 'Business stage',
    options: toOptions(EKEHI_ENUMS.businessStage),
  },
  {
    key: 'country',
    placeholder: 'Region',
    options: toOptions(EKEHI_ENUMS.country),
  },
  {
    key: 'opportunity_type',
    placeholder: 'Type',
    options: toOptions(EKEHI_ENUMS.opportunityType),
  },
] as const

type FilterSelectKey = (typeof FILTER_SELECTS)[number]['key']

export function OpportunitiesPage() {
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<OpportunityListFilters>({})
  const [page, setPage] = useState(1)

  const {
    data: response,
    isPending,
    isError,
    error,
  } = useOpportunitiesQuery({
    ...filters,
    search: search || undefined,
    page,
  })

  const opportunities = response?.data ?? []
  const meta = response?.meta

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new FormData(event.currentTarget).get('search')
    setPage(1)
    setSearch(String(query ?? '').trim())
  }

  function handleFilterChange(key: FilterSelectKey, value: string | null) {
    setPage(1)
    setFilters((current) => ({ ...current, [key]: value ?? undefined }))
  }

  return (
    <div className="content-grid space-y-10 py-6 md:py-12 lg:py-24">
      <header className="space-y-2 text-center">
        <h1 className="font-serif text-2xl font-medium tracking-[-2%] lg:text-[2.75rem]">
          Funding Opportunities
        </h1>
        <p className="leading-[140%] text-neutral-700 max-md:text-sm">
          Explore various funding options available to support your projects and
          initiatives.
        </p>
      </header>

      <section>
        <form className="mb-3 flex gap-2" onSubmit={handleSearch}>
          <Input name="search" placeholder="Search 30+ funding opportunities" />
          <Button type="submit">
            <Search />
            <span>Search</span>
          </Button>
        </form>

        <div className="flex flex-wrap gap-2">
          {FILTER_SELECTS.map(({ key, placeholder, options }) => (
            <FilterDropdown
              key={key}
              name={key}
              label={placeholder}
              options={options}
              value={filters[key] ?? null}
              onChange={(value) => handleFilterChange(key, value)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-medium text-neutral-900 lg:text-xl">
          All opportunities{meta ? ` (${meta.total})` : ''}
        </h2>

        {isPending ? (
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse space-y-2 py-8">
                <div className="h-5 w-2/3 rounded bg-neutral-200" />
                <div className="h-4 w-1/3 rounded bg-neutral-200" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <p className="border-y border-neutral-200 py-8 text-neutral-700">
            Could not load opportunities. {error.message}
          </p>
        ) : opportunities.length === 0 ? (
          <p className="border-y border-neutral-200 py-8 text-neutral-700">
            No opportunities match your search.
          </p>
        ) : (
          <div className="divide-y divide-neutral-200 border-y border-neutral-200">
            {opportunities.map((opportunity) => (
              <OpportunityRowCard
                key={opportunity.id}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasPrevPage}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-neutral-700">
              Page {meta.page} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!meta.hasNextPage}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </section>
    </div>
  )
}
