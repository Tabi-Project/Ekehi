import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '#/lib/api'

import { SignupForm } from './signup-form'

const mockMutateAsync = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('../auth.query', () => ({
  useSignupMutation: () => ({ mutateAsync: mockMutateAsync }),
}))

afterEach(() => {
  vi.clearAllMocks()
})

function fill(fields: {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}) {
  if (fields.firstName !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('First name'), {
      target: { value: fields.firstName },
    })
  }
  if (fields.lastName !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('Last name'), {
      target: { value: fields.lastName },
    })
  }
  if (fields.email !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('Email address'), {
      target: { value: fields.email },
    })
  }
  if (fields.password !== undefined) {
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: fields.password },
    })
  }
}

function submit() {
  const form = screen.getByRole('button', { name: /continue/i }).closest('form')
  if (!form) throw new Error('form not found')
  fireEvent.submit(form)
}

describe('SignupForm', () => {
  it('shows field errors and does not call the mutation on invalid input', async () => {
    render(<SignupForm />)
    fill({ firstName: '', lastName: '', email: 'bad', password: 'short' })
    submit()

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeTruthy()
    })
    expect(mockMutateAsync).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('creates the account and navigates home when a session is returned', async () => {
    mockMutateAsync.mockResolvedValueOnce({
      user: { id: '1', email: 'user@example.com' },
      session: { access_token: 'a', refresh_token: 'r' },
    })
    render(<SignupForm />)
    fill({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'user@example.com',
      password: 'supersecret',
    })
    submit()

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        firstName: 'Ada',
        lastName: 'Lovelace',
        email: 'user@example.com',
        password: 'supersecret',
      })
    })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
    })
  })

  it('routes to login when no session is returned (email confirmation)', async () => {
    mockMutateAsync.mockResolvedValueOnce({
      user: { id: '1', email: 'user@example.com' },
      session: null,
    })
    render(<SignupForm />)
    fill({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'user@example.com',
      password: 'supersecret',
    })
    submit()

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/login' })
    })
  })

  it('surfaces the server error message when the mutation rejects', async () => {
    mockMutateAsync.mockRejectedValueOnce(
      new ApiError('Email already registered', 409),
    )
    render(<SignupForm />)
    fill({
      firstName: 'Ada',
      lastName: 'Lovelace',
      email: 'user@example.com',
      password: 'supersecret',
    })
    submit()

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe(
        'Email already registered',
      )
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
