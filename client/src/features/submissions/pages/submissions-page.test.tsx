import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '#/lib/api'

import { SubmissionsPage } from './submissions-page'

const mockMutateAsync = vi.fn()
let metaState: Record<string, unknown>

vi.mock('../submissions.query', () => ({
  useMetaQuery: () => metaState,
  useCreateOpportunityMutation: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}))

const META = {
  opportunity_types: ['grant_ngo', 'accelerator'],
  listing_statuses: ['open', 'closed'],
  sectors: [{ slug: 'agritech', display_name: 'Agritech' }],
  stages: [{ slug: 'idea', display_name: 'Idea' }],
}

function loadedState() {
  return { data: META, isLoading: false, isError: false, error: null }
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/opportunity name/i), {
    target: { value: 'My Grant' },
  })
  fireEvent.change(screen.getByLabelText(/opportunity type/i), {
    target: { value: 'grant_ngo' },
  })
  fireEvent.change(screen.getByLabelText(/opportunity description/i), {
    target: { value: 'A helpful grant.' },
  })
  fireEvent.change(screen.getByLabelText(/organizer name/i), {
    target: { value: 'Ekehi Foundation' },
  })
}

function submitForm() {
  const form = screen.getByRole('button', { name: /submit/i }).closest('form')
  if (!form) throw new Error('form not found')
  fireEvent.submit(form)
}

beforeEach(() => {
  metaState = loadedState()
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('SubmissionsPage', () => {
  it('renders the loading state while meta is loading', () => {
    metaState = {
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    }
    render(<SubmissionsPage />)
    expect(screen.getByRole('status', { name: /loading form/i })).toBeTruthy()
  })

  it('renders the ApiError message when meta fails to load', () => {
    metaState = {
      data: undefined,
      isLoading: false,
      isError: true,
      error: new ApiError('Meta service is down', 500),
    }
    render(<SubmissionsPage />)
    expect(screen.getByText('Meta service is down')).toBeTruthy()
  })

  it('renders the form with meta-driven options once loaded', () => {
    render(<SubmissionsPage />)
    expect(screen.getByLabelText(/opportunity name/i)).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Grant (NGO)' })).toBeTruthy()
    expect(screen.getByText('Agritech')).toBeTruthy()
    expect(screen.getByRole('button', { name: /submit/i })).toBeTruthy()
  })

  it('blocks submission and shows field errors when required fields are empty', async () => {
    render(<SubmissionsPage />)
    submitForm()

    await waitFor(() => {
      expect(screen.getByText('Opportunity name is required.')).toBeTruthy()
    })
    expect(screen.getByText('Please select an opportunity type.')).toBeTruthy()
    expect(screen.getByText('Organizer name is required.')).toBeTruthy()
    expect(mockMutateAsync).not.toHaveBeenCalled()
  })

  it('submits the built payload and shows the success message', async () => {
    mockMutateAsync.mockResolvedValueOnce({ id: 'opp-1' })
    render(<SubmissionsPage />)
    fillRequiredFields()
    submitForm()

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledTimes(1)
    })
    expect(mockMutateAsync.mock.calls[0][0]).toMatchObject({
      opportunity_title: 'My Grant',
      opportunity_type: 'grant_ngo',
      description: 'A helpful grant.',
      funder_name: 'Ekehi Foundation',
      currency: 'NGN',
    })
    await waitFor(() => {
      expect(screen.getByText(/submitted for review/i)).toBeTruthy()
    })
  })

  it('surfaces the server error message when the mutation rejects', async () => {
    mockMutateAsync.mockRejectedValueOnce(new ApiError('Server boom', 500))
    render(<SubmissionsPage />)
    fillRequiredFields()
    submitForm()

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe('Server boom')
    })
  })
})
