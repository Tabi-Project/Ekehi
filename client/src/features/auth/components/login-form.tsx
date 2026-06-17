import { useNavigate, useSearch } from '@tanstack/react-router'
import { useActionState } from 'react'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { PasswordInput } from '#/components/ui/password-input'
import { isApiError } from '#/lib/api'

import { useLoginMutation } from '../auth.query'
import { loginRequestSchema } from '../auth.types'

type LoginFormState = {
  error?: string
  fieldErrors?: { email?: string; password?: string }
  values?: { email: string }
}

export function LoginForm() {
  const navigate = useNavigate()
  const { redirect } = useSearch({ strict: false })
  const loginMutation = useLoginMutation()

  async function loginAction(
    _previousState: LoginFormState,
    formData: FormData,
  ): Promise<LoginFormState> {
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    const parsed = loginRequestSchema.safeParse({ email, password })
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error)
      return {
        values: { email },
        fieldErrors: {
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
      }
    }

    try {
      await loginMutation.mutateAsync(parsed.data)
      await navigate({ to: redirect ?? '/' })
      return {}
    } catch (error) {
      return {
        values: { email },
        error: isApiError(error)
          ? error.message
          : 'Unable to sign in. Please try again.',
      }
    }
  }

  const [state, formAction, pending] = useActionState<LoginFormState, FormData>(
    loginAction,
    {},
  )

  return (
    <form
      action={formAction}
      className="space-y-4 [&_input]:bg-neutral-100 [&_input]:focus-visible:bg-transparent"
    >
      <div className="space-y-1 text-left">
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          defaultValue={state.values?.email}
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email && (
          <p className="text-sm text-red-500">{state.fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-1 text-left">
        <PasswordInput
          name="password"
          autoComplete="current-password"
          placeholder="Password"
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password && (
          <p className="text-sm text-red-500">{state.fieldErrors.password}</p>
        )}
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-red-500">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-4 pt-2">
        <Button type="submit" full disabled={pending}>
          {pending ? 'Signing in…' : 'Continue'}
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => navigate({ to: '/' })}
        >
          Back
        </Button>
      </div>
    </form>
  )
}
