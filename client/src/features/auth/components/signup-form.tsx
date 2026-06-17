import { useNavigate } from '@tanstack/react-router'
import { useActionState } from 'react'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { PasswordInput } from '#/components/ui/password-input'
import { isApiError } from '#/lib/api'

import { useSignupMutation } from '../auth.query'
import { signupRequestSchema } from '../auth.types'

type SignupFormState = {
  error?: string
  fieldErrors?: {
    firstName?: string
    lastName?: string
    email?: string
    password?: string
  }
  values?: { firstName: string; lastName: string; email: string }
}

export function SignupForm() {
  const navigate = useNavigate()
  const signupMutation = useSignupMutation()

  async function signupAction(
    _previousState: SignupFormState,
    formData: FormData,
  ): Promise<SignupFormState> {
    const firstName = String(formData.get('firstName') ?? '')
    const lastName = String(formData.get('lastName') ?? '')
    const email = String(formData.get('email') ?? '')
    const password = String(formData.get('password') ?? '')

    const values = { firstName, lastName, email }

    const parsed = signupRequestSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    })
    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error)
      return {
        values,
        fieldErrors: {
          firstName: fieldErrors.firstName?.[0],
          lastName: fieldErrors.lastName?.[0],
          email: fieldErrors.email?.[0],
          password: fieldErrors.password?.[0],
        },
      }
    }

    try {
      const response = await signupMutation.mutateAsync(parsed.data)
      await navigate({ to: response.session ? '/' : '/login' })
      return {}
    } catch (error) {
      return {
        values,
        error: isApiError(error)
          ? error.message
          : 'Unable to create your account. Please try again.',
      }
    }
  }

  const [state, formAction, pending] = useActionState<
    SignupFormState,
    FormData
  >(signupAction, {})

  return (
    <form
      action={formAction}
      className="space-y-4 [&_input]:bg-neutral-100 [&_input]:focus-visible:bg-transparent"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1 text-left">
          <Input
            name="firstName"
            autoComplete="given-name"
            placeholder="First name"
            defaultValue={state.values?.firstName}
            aria-invalid={Boolean(state.fieldErrors?.firstName)}
          />
          {state.fieldErrors?.firstName && (
            <p className="text-sm text-red-500">
              {state.fieldErrors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-1 text-left">
          <Input
            name="lastName"
            autoComplete="family-name"
            placeholder="Last name"
            defaultValue={state.values?.lastName}
            aria-invalid={Boolean(state.fieldErrors?.lastName)}
          />
          {state.fieldErrors?.lastName && (
            <p className="text-sm text-red-500">{state.fieldErrors.lastName}</p>
          )}
        </div>
      </div>

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
          autoComplete="new-password"
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
          {pending ? 'Creating account…' : 'Continue'}
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
