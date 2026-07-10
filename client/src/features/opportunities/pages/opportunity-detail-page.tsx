import { Link } from '@tanstack/react-router'
import { Bookmark, BookmarkCheck } from 'lucide-react'

import { SVGS } from '#/assets/svgs'
import { LinkedInIcon, WhatsAppIcon, XIcon } from '#/components/icons/social'
import { Button } from '#/components/ui/button'
import { Modal } from '#/components/ui/modal'
import { useIsAuthenticated } from '#/lib/auth/use-is-authenticated'
import { formatAmount, formatShortDate, humanize } from '#/lib/format'

import {
  useOpportunityDetailQuery,
  useSaveOpportunityMutation,
} from '../opportunities.query'
import type { OpportunityDetail } from '../opportunities.types'

// --- Helpers ---

function eligibilityList(string_: string | null) {
  if (!string_)
    return (
      <p className="text-content-secondary text-base leading-[150%] font-normal">
        —
      </p>
    )
  const items = string_
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <ul className="text-content-secondary list-disc space-y-1 pl-5 text-base leading-[150%] font-normal">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  )
}

// --- Sub components ---

function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: 'default' | 'status' | 'flag'
}) {
  const styles = {
    default: 'bg-purple-100 text-purple-800',
    status: 'bg-orange-100 text-orange-800',
    flag: 'bg-green-100 text-green-800',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${styles[variant]}`}
    >
      {children}
    </span>
  )
}

function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <h2 className="text-base leading-[150%] font-medium text-neutral-900">
        {title}
      </h2>
      {children}
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-base leading-[100%] font-normal text-neutral-500">
        {label}
      </p>
      <div className="text-base leading-[100%] font-normal text-neutral-900">
        {value}
      </div>
    </div>
  )
}

function SaveModal() {
  return (
    <Modal.Content className="max-w-sm text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
          <img src={SVGS.logo2} alt="Ekehi" className="h-12 w-12" />
        </div>
        <div className="space-y-2">
          <Modal.Title>Save this opportunity</Modal.Title>
          <Modal.Description>
            Create a free account to bookmark opportunities and access them
            anytime.
          </Modal.Description>
        </div>
        <div className="w-full space-y-3">
          <Button full asChild>
            <Link to="/signup">Create account</Link>
          </Button>
          <p className="text-content-secondary text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-primary underline">
              Login
            </Link>
          </p>
          <Modal.Close asChild>
            <button className="text-content-secondary hover:text-content w-full text-sm">
              Continue browsing
            </button>
          </Modal.Close>
        </div>
      </div>
    </Modal.Content>
  )
}

function OpportunityAside({
  opp,
  isLoggedIn,
}: {
  opp: OpportunityDetail
  isLoggedIn: boolean
}) {
  const saveMutation = useSaveOpportunityMutation(opp.id)
  const isSaved = opp.is_saved ?? false

  function handleSaveClick() {
    if (!isLoggedIn) return
    saveMutation.mutate(isSaved)
  }

  return (
    <aside className="h-fit space-y-4 self-start rounded-[4px] bg-white p-6">
      {opp.apply_url ? (
        <Button full asChild size="lg">
          <a href={opp.apply_url} target="_blank" rel="noopener noreferrer">
            Apply
          </a>
        </Button>
      ) : (
        <p className="text-content-muted text-center text-sm">
          No application link available.
        </p>
      )}

      {isLoggedIn ? (
        <Button
          full
          variant="outline"
          onClick={handleSaveClick}
          disabled={saveMutation.isPending}
        >
          {isSaved ? (
            <>
              <BookmarkCheck size={16} />
              Saved
            </>
          ) : (
            <>
              <Bookmark size={16} />
              Save
            </>
          )}
        </Button>
      ) : (
        <Modal.Trigger asChild>
          <Button full variant="outline">
            <Bookmark size={16} />
            Save
          </Button>
        </Modal.Trigger>
      )}

      <dl className="space-y-4">
        <MetaItem label="Organiser" value={opp.funder_name || '—'} />
        <MetaItem
          label="Amount"
          value={formatAmount(opp.amount_min, opp.amount_max, opp.currency)}
        />
        <MetaItem
          label="Deadline"
          value={formatShortDate(opp.application_deadline)}
        />
        <MetaItem label="Country/Region" value={opp.country || '—'} />
        {opp.contact_email && (
          <MetaItem
            label="Contact"
            value={
              <a
                href={`mailto:${opp.contact_email}`}
                className="text-primary underline"
              >
                {opp.contact_email}
              </a>
            }
          />
        )}
      </dl>

      <hr className="border-line" />

      <div className="space-y-3">
        <p className="text-content-muted text-center text-sm">
          Share this opportunity
        </p>
        <div className="flex justify-center gap-3">
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on LinkedIn"
          >
            <LinkedInIcon />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
          >
            <XIcon />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <WhatsAppIcon />
          </a>
        </div>
      </div>
    </aside>
  )
}

// --- Main page ---

export function OpportunityDetailPage({ id }: { id: string }) {
  const { data, isLoading, error } = useOpportunityDetailQuery(id)
  const isLoggedIn = useIsAuthenticated()

  if (isLoading) {
    return (
      <div className="text-content-muted container py-16 text-center">
        Loading opportunity...
      </div>
    )
  }

  if (error) {
    const is404 = error.status === 404
    return (
      <div className="container space-y-2 py-16 text-center">
        <h1 className="text-content text-2xl font-semibold">
          {is404 ? 'Opportunity not found' : 'Something went wrong'}
        </h1>
        <p className="text-content-secondary">{error.message}</p>
        <Link to="/opportunities" className="text-primary text-sm underline">
          Back to opportunities
        </Link>
      </div>
    )
  }

  if (!data) return null

  return (
    <Modal>
      <div className="bg-surface-subtle">
        <div className="mx-auto w-full max-w-7xl px-6 py-10">
          {/* Breadcrumb */}
          <nav className="text-content-muted mb-6 flex items-center gap-2 text-sm">
            <Link to="/opportunities" className="text-primary hover:underline">
              Funding opportunities
            </Link>
            <span>›</span>
            <span>{data.opportunity_title}</span>
          </nav>

          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_296px]">
            {/* Left — main content card */}
            <div className="space-y-6">
              <div className="rounded-[4px] bg-white p-6">
                {/* Header */}
                <header className="border-line mb-[30px] space-y-3 border-b pb-6">
                  <h1 className="font-serif text-[28px] leading-[100%] font-medium text-neutral-900">
                    {data.opportunity_title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{humanize(data.opportunity_type)}</Badge>
                    <Badge variant="status">{humanize(data.status)}</Badge>
                    {data.is_women_only && (
                      <Badge variant="flag">Women only</Badge>
                    )}
                    {data.is_equity_free && (
                      <Badge variant="flag">Equity free</Badge>
                    )}
                  </div>
                </header>

                <div className="space-y-[30px]">
                  <DetailSection title="About this opportunity">
                    <p className="text-content-secondary text-base leading-[150%] font-normal">
                      {data.description || '—'}
                    </p>
                  </DetailSection>

                  <DetailSection title="Eligibility criteria">
                    {eligibilityList(data.eligibility_criteria)}
                  </DetailSection>

                  <div className="grid grid-cols-2 gap-6">
                    {data.sectors && data.sectors.length > 0 && (
                      <DetailSection title="Sectors">
                        <div className="flex flex-wrap gap-2">
                          {data.sectors.map((s) => (
                            <Badge key={s}>{humanize(s)}</Badge>
                          ))}
                        </div>
                      </DetailSection>
                    )}
                    {data.stages && data.stages.length > 0 && (
                      <DetailSection title="Stages">
                        <div className="flex flex-wrap gap-2">
                          {data.stages.map((s) => (
                            <Badge key={s}>{humanize(s)}</Badge>
                          ))}
                        </div>
                      </DetailSection>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right — sidebar */}
            <OpportunityAside opp={data} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
      <SaveModal />
    </Modal>
  )
}
