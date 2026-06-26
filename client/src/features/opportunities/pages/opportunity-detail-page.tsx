import { Bookmark, BookmarkCheck } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Modal } from '#/components/ui/modal'
import { getAccessToken } from '#/lib/auth/token-store'

import {
  useOpportunityDetailQuery,
  useSaveOpportunityMutation,
} from '../opportunities.query'
import type { OpportunityDetail } from '../opportunities.types'

// --- Helpers ---

function formatAmount(
  min: number | null,
  max: number | null,
  currency: string | null,
) {
  const fmt = (n: number) => `${currency ?? ''}${(n / 1_000_000).toFixed(0)}m`
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  if (min) return fmt(min)
  if (max) return fmt(max)
  return '—'
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function humanize(string_: string | null) {
  if (!string_) return '—'
  return string_.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function eligibilityList(string_: string | null) {
  if (!string_) return <p className="text-content-secondary">—</p>
  const items = string_
    .split('.')
    .map((s) => s.trim())
    .filter(Boolean)
  return (
    <ul className="text-content-secondary list-disc space-y-1 pl-5">
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
      <h2 className="text-content text-base font-semibold">{title}</h2>
      {children}
    </div>
  )
}

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-content-muted text-sm">{label}</p>
      <p className="text-content text-sm font-medium">{value}</p>
    </div>
  )
}

function SaveModal() {
  return (
    <Modal.Content className="max-w-sm text-center">
      <div className="flex flex-col items-center gap-4">
        <img
          src="/assets/icons/ekehi-logo2.png"
          alt="Ekehi"
          className="h-12 w-12"
        />
        <div className="space-y-2">
          <Modal.Title>Save this opportunity</Modal.Title>
          <Modal.Description>
            Create a free account to bookmark opportunities and access them
            anytime.
          </Modal.Description>
        </div>
        <div className="w-full space-y-3">
          <Button full asChild>
            <a href="/signup/">Create account</a>
          </Button>
          <p className="text-content-secondary text-sm">
            Already have an account?{' '}
            <a href="/login/" className="text-primary underline">
              Login
            </a>
          </p>
          <Modal.Close asChild>
            <Button variant="ghost" full>
              Continue browsing
            </Button>
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
    <aside className="border-line sticky top-8 space-y-6 rounded-xl border bg-white p-6">
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
          value={formatDate(opp.application_deadline)}
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
            <img
              src="/assets/icons/linkedin.svg"
              alt="LinkedIn"
              className="h-6 w-6"
            />
          </a>
          <a
            href={`https://www.instagram.com/`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on Instagram"
          >
            <img
              src="/assets/icons/instagram.svg"
              alt="Instagram"
              className="h-6 w-6"
            />
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on X"
          >
            <img src="/assets/icons/x.svg" alt="X" className="h-6 w-6" />
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Share on WhatsApp"
          >
            <img
              src="/assets/icons/whatsapp.svg"
              alt="WhatsApp"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
    </aside>
  )
}

// --- Newsletter section (bottom of main card) ---

function NewsletterSection() {
  return (
    <div className="border-line mt-8 border-t pt-8">
      <h2 className="text-content mb-1 text-xl font-semibold">
        Never miss an opportunity
      </h2>
      <p className="text-content-secondary mb-4 text-sm">
        Subscribe to receive important application and funding deadlines
        directly in your inbox
      </p>
      <div className="flex gap-3">
        <input
          type="email"
          placeholder="Enter email address"
          className="border-line text-content placeholder:text-content-muted flex-1 rounded-lg border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-500"
        />
        <Button variant="primary">Subscribe</Button>
      </div>
    </div>
  )
}

// --- Main page ---

export function OpportunityDetailPage({ id }: { id: string }) {
  const { data, isLoading, error } = useOpportunityDetailQuery(id)
  const isLoggedIn = Boolean(getAccessToken())

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
        <a href="/opportunities/" className="text-primary text-sm underline">
          Back to opportunities
        </a>
      </div>
    )
  }

  if (!data) return null

  return (
    <Modal>
      <div className="container py-10">
        {/* Breadcrumb */}
        <nav className="text-content-muted mb-6 flex items-center gap-2 text-sm">
          <a href="/opportunities/" className="text-primary hover:underline">
            Funding opportunities
          </a>
          <span>›</span>
          <span>{data.opportunity_title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Left — main content card */}
          <div className="border-line rounded-xl border bg-white p-8">
            {/* Header */}
            <header className="border-line mb-6 space-y-3 border-b pb-6">
              <h1 className="text-content text-3xl font-semibold">
                {data.opportunity_title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Badge>{humanize(data.opportunity_type)}</Badge>
                <Badge variant="status">{humanize(data.status)}</Badge>
                {data.is_women_only && <Badge variant="flag">Women only</Badge>}
                {data.is_equity_free && (
                  <Badge variant="flag">Equity free</Badge>
                )}
              </div>
            </header>

            {/* Body sections */}
            <div className="space-y-8">
              <DetailSection title="About this opportunity">
                <p className="text-content-secondary">
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

            {/* Newsletter at bottom of card */}
            <NewsletterSection />
          </div>

          {/* Right — sidebar */}
          <OpportunityAside opp={data} isLoggedIn={isLoggedIn} />
        </div>
      </div>

      <SaveModal />
    </Modal>
  )
}
