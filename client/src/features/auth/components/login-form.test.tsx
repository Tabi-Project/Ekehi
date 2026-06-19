import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '#/lib/api'

import { LoginForm } from './login-form'

const mockMutateAsync = vi.fn()
const mockNavigate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => ({ redirect: undefined }),
}))

vi.mock('../auth.query', () => ({
  useLoginMutation: () => ({ mutateAsync: mockMutateAsync }),
}))

afterEach(() => {
  vi.clearAllMocks()
})

function submitWith(email: string, password: string) {
  const form = screen.getByRole('button', { name: /continue/i }).closest('form')
  if (!form) throw new Error('form not found')

  fireEvent.change(screen.getByPlaceholderText('Email address'), {
    target: { value: email },
  })
  fireEvent.change(screen.getByPlaceholderText('Password'), {
    target: { value: password },
  })

  fireEvent.submit(form)
}

describe('LoginForm', () => {
  it('shows field errors and does not call the mutation on invalid input', async () => {
    render(<LoginForm />)
    submitWith('not-an-email', '')

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeTruthy()
    })
    expect(mockMutateAsync).not.toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('calls the login mutation and navigates on valid input', async () => {
    mockMutateAsync.mockResolvedValueOnce(undefined)
    render(<LoginForm />)
    submitWith('user@example.com', 'secret123')

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'secret123',
      })
    })
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: '/' })
    })
  })

  it('surfaces the server error message when the mutation rejects', async () => {
    mockMutateAsync.mockRejectedValueOnce(
      new ApiError('Invalid credentials', 401),
    )
    render(<LoginForm />)
    submitWith('user@example.com', 'wrongpass')

    await waitFor(() => {
      expect(screen.getByRole('alert').textContent).toBe('Invalid credentials')
    })
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
