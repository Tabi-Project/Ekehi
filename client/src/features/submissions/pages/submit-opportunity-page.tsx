import { ChevronDown } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useState } from 'react'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import { FormField } from '#/components/ui/form-field'
import { Input } from '#/components/ui/input'
import { Select } from '#/components/ui/select'
import { Skeleton } from '#/components/ui/skeleton'
import { Textarea } from '#/components/ui/textarea'
import { isApiError } from '#/lib/api'
import { cn } from '#/lib/utils'

import {
  COUNTRIES,
  DEFAULT_CURRENCY,
  labelFor,
  LISTING_STATUS_LABELS,
  OPPORTUNITY_TYPE_LABELS,
} from '../submissions.constants'
import {
  useCreateOpportunityMutation,
  useMetaQuery,
} from '../submissions.query'
import type {
  CreateOpportunityRequest,
  MetaResponse,
} from '../submissions.types'
import { createOpportunitySchema } from '../submissions.types'

type FieldErrors = Partial<Record<keyof CreateOpportunityRequest, string>>

const SUCCESS_MESSAGE =
  "Your opportunity has been submitted for review. We'll notify you once it's live."

/** Shared field styling so inputs, selects and textareas match. */
const FIELD_CLASS = 'h-12 rounded-lg bg-surface-subtle/50'

export function SubmitOpportunityPage() {
  const { data: meta, isLoading, isError, error } = useMetaQuery()

  return (
    <div className="mx-auto w-full max-w-225 px-6 py-12">
      <header className="mb-10 flex flex-col gap-2 text-center">
        <h1 className="text-content font-serif text-3xl font-medium md:text-4xl">
          Submit an opportunity
        </h1>
        <p className="mx-auto text-base text-balance text-neutral-700">
          Have a great opportunity for women entrepreneurs? Share the details
          below for the Ekehi team to review before it goes live.
        </p>
      </header>

      {isLoading ? (
        <div
          role="status"
          aria-label="Loading form"
          className="flex flex-col gap-4"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError || !meta ? (
        <div className="border-line bg-surface rounded-2xl border p-8 text-center">
          <h2 className="text-content mb-2 text-lg font-semibold">
            Couldn&apos;t load the form
          </h2>
          <p className="text-content-muted text-sm">
            {isApiError(error)
              ? error.message
              : 'Please refresh the page and try again.'}
          </p>
        </div>
      ) : (
        <SubmissionForm meta={meta} />
      )}
    </div>
  )
}

function SubmissionForm({ meta }: { meta: MetaResponse }) {
  const mutation = useCreateOpportunityMutation()
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)
    setSuccessMessage(null)

    const form = event.currentTarget
    const parsed = createOpportunitySchema.safeParse(
      buildPayload(new FormData(form)),
    )

    if (!parsed.success) {
      const { fieldErrors: flattened } = z.flattenError(parsed.error)
      const next: FieldErrors = {}
      for (const key of Object.keys(
        flattened,
      ) as (keyof CreateOpportunityRequest)[]) {
        next[key] = flattened[key]?.[0]
      }
      setFieldErrors(next)
      return
    }

    setFieldErrors({})

    try {
      await mutation.mutateAsync(parsed.data)
      setSuccessMessage(SUCCESS_MESSAGE)
      form.reset()
    } catch (error) {
      setFormError(
        isApiError(error)
          ? error.message
          : 'Something went wrong. Please try again.',
      )
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="border-line bg-surface rounded-2xl border px-6 md:px-8"
    >
      <Section index={1} title="About the opportunity">
        <FormField
          name="opportunity_title"
          required
          error={fieldErrors.opportunity_title}
        >
          <FormField.Label>Opportunity name</FormField.Label>
          <FormField.Control>
            <Input
              name="opportunity_title"
              className={FIELD_CLASS}
              placeholder="e.g. Fisayo Rotibi Grant"
            />
          </FormField.Control>
        </FormField>

        <FormField
          name="opportunity_type"
          required
          error={fieldErrors.opportunity_type}
        >
          <FormField.Label>Opportunity type</FormField.Label>
          <FormField.Control>
            <Select
              name="opportunity_type"
              defaultValue=""
              className={FIELD_CLASS}
              placeholder="-- Select a type --"
            >
              {meta.opportunity_types.map((slug) => (
                <option key={slug} value={slug}>
                  {labelFor(OPPORTUNITY_TYPE_LABELS, slug)}
                </option>
              ))}
            </Select>
          </FormField.Control>
        </FormField>

        <FormField name="description" required error={fieldErrors.description}>
          <FormField.Label>Opportunity description</FormField.Label>
          <FormField.Control>
            <Textarea
              name="description"
              rows={6}
              className="bg-surface-subtle/50 rounded-lg"
              placeholder="Briefly describe the opportunity, eligibility requirements, and what applicants can expect…"
            />
          </FormField.Control>
        </FormField>

        <FormField
          name="eligibility_criteria"
          error={fieldErrors.eligibility_criteria}
        >
          <FormField.Label>Eligibility criteria</FormField.Label>
          <FormField.Control>
            <Textarea
              name="eligibility_criteria"
              rows={3}
              className="bg-surface-subtle/50 rounded-lg"
              placeholder="Who can apply? e.g. Women-owned businesses in Nigeria with 2+ years of operation…"
            />
          </FormField.Control>
        </FormField>

        <div className="flex flex-col gap-2.5">
          <label className="text-content flex items-center gap-2 text-sm">
            <Checkbox name="is_women_only" />
            This opportunity is women-only
          </label>
          <label className="text-content flex items-center gap-2 text-sm">
            <Checkbox name="is_equity_free" />
            This opportunity is equity-free (no equity taken)
          </label>
        </div>
      </Section>

      <Section index={2} title="Programme details">
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField name="amount_min" error={fieldErrors.amount_min}>
            <FormField.Label>Min amount</FormField.Label>
            <FormField.Control>
              <Input
                name="amount_min"
                type="number"
                min={0}
                className={FIELD_CLASS}
                placeholder="e.g. 500000"
              />
            </FormField.Control>
          </FormField>
          <FormField name="amount_max" error={fieldErrors.amount_max}>
            <FormField.Label>Max amount</FormField.Label>
            <FormField.Control>
              <Input
                name="amount_max"
                type="number"
                min={0}
                className={FIELD_CLASS}
                placeholder="e.g. 5000000"
              />
            </FormField.Control>
          </FormField>
          <FormField name="application_deadline">
            <FormField.Label>Deadline</FormField.Label>
            <FormField.Control>
              <Input
                name="application_deadline"
                type="date"
                className={FIELD_CLASS}
              />
            </FormField.Control>
          </FormField>
        </div>
        <p className="text-content-muted text-xs">
          Amounts are recorded in {DEFAULT_CURRENCY}.
        </p>

        <FormField name="status">
          <FormField.Label>Application status</FormField.Label>
          <FormField.Control>
            <Select
              name="status"
              defaultValue=""
              className={FIELD_CLASS}
              placeholder="-- Select status --"
            >
              {meta.listing_statuses.map((slug) => (
                <option key={slug} value={slug}>
                  {labelFor(LISTING_STATUS_LABELS, slug)}
                </option>
              ))}
            </Select>
          </FormField.Control>
        </FormField>

        <CheckboxGroup
          legend="Sectors"
          hint="Select all that apply"
          name="sectors"
          options={meta.sectors}
        />
        <CheckboxGroup
          legend="Business stage"
          hint="Select all that apply"
          name="stages"
          options={meta.stages}
        />
      </Section>

      <Section index={3} title="About the organizer">
        <FormField name="funder_name" required error={fieldErrors.funder_name}>
          <FormField.Label>Organizer name</FormField.Label>
          <FormField.Control>
            <Input
              name="funder_name"
              className={FIELD_CLASS}
              placeholder="e.g. Fisayo Rotibi Foundation"
            />
          </FormField.Control>
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField name="contact_email" error={fieldErrors.contact_email}>
            <FormField.Label>Contact email</FormField.Label>
            <FormField.Control>
              <Input
                name="contact_email"
                type="email"
                className={FIELD_CLASS}
                placeholder="hello@email.com"
              />
            </FormField.Control>
          </FormField>
          <FormField name="apply_url" error={fieldErrors.apply_url}>
            <FormField.Label>Website (optional)</FormField.Label>
            <FormField.Control>
              <Input
                name="apply_url"
                type="url"
                className={FIELD_CLASS}
                placeholder="https://www.abc.xyz"
              />
            </FormField.Control>
          </FormField>
        </div>

        <FormField name="country">
          <FormField.Label>Location / Country</FormField.Label>
          <FormField.Control>
            <Select
              name="country"
              defaultValue=""
              className={FIELD_CLASS}
              placeholder="-- Select country --"
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </Select>
          </FormField.Control>
        </FormField>
      </Section>

      <div className="border-line flex flex-col gap-3 border-t py-6">
        {formError ? (
          <p role="alert" className="text-error text-sm">
            {formError}
          </p>
        ) : null}
        {successMessage ? (
          <p role="status" className="text-sm text-green-700">
            {successMessage}
          </p>
        ) : null}
        <div className="flex justify-end">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting…' : 'Submit'}
          </Button>
        </div>
      </div>
    </form>
  )
}

function Section({
  index,
  title,
  children,
}: {
  index: number
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <section className="border-line border-t py-5 first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="text-content flex w-full items-center justify-between text-left text-lg font-semibold"
      >
        <span>
          {index}. {title}
        </span>
        <ChevronDown
          size={20}
          aria-hidden
          className={cn(
            'text-content-muted transition-transform',
            open ? 'rotate-180' : '',
          )}
        />
      </button>
      {open ? <div className="flex flex-col gap-5 pt-5">{children}</div> : null}
    </section>
  )
}

function CheckboxGroup({
  legend,
  hint,
  name,
  options,
}: {
  legend: string
  hint: string
  name: string
  options: { slug: string; display_name: string }[]
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="text-content mb-1 text-sm font-medium">
        {legend} <span className="text-content-muted font-normal">{hint}</span>
      </legend>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.slug}
            className="text-content flex items-center gap-2 text-sm"
          >
            <Checkbox name={name} value={option.slug} />
            {option.display_name}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

/**
 * Build the request payload from the form. Deterministic: trims text, omits
 * empty optional fields (so the server's `z.email()`/`z.url()` never see ''),
 * coerces amounts to numbers, and collects checkbox groups.
 */
function buildPayload(formData: FormData) {
  const requiredText = (name: string) =>
    formData.get(name)?.toString().trim() ?? ''

  const optionalText = (name: string) => {
    const value = formData.get(name)?.toString().trim()
    return value ? value : undefined
  }

  const optionalNumber = (name: string) => {
    const value = optionalText(name)
    if (value === undefined) return undefined
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  const optionalList = (name: string) => {
    const values = formData.getAll(name).map(String)
    return values.length > 0 ? values : undefined
  }

  return {
    opportunity_title: requiredText('opportunity_title'),
    opportunity_type: formData.get('opportunity_type')?.toString() ?? '',
    description: requiredText('description'),
    funder_name: requiredText('funder_name'),
    eligibility_criteria: optionalText('eligibility_criteria'),
    is_women_only: formData.get('is_women_only') != null,
    is_equity_free: formData.get('is_equity_free') != null,
    amount_min: optionalNumber('amount_min'),
    amount_max: optionalNumber('amount_max'),
    application_deadline: optionalText('application_deadline'),
    status: optionalText('status'),
    sectors: optionalList('sectors'),
    stages: optionalList('stages'),
    contact_email: optionalText('contact_email'),
    apply_url: optionalText('apply_url'),
    country: optionalText('country'),
    currency: DEFAULT_CURRENCY,
  }
}
