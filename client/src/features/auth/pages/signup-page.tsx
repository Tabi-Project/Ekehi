import { Link } from '@tanstack/react-router'

import { SignupForm } from '../components/signup-form'

export function SignupPage() {
  return (
    <section
      className="content-grid min-h-svh place-content-center space-y-6 py-6 text-center leading-[150%] text-neutral-700"
      style={{ '--content-max-width': '35rem' } as React.CSSProperties}
    >
      <hgroup>
        <h1 className="mb-0.5 text-2xl font-medium text-neutral-900">
          Create your account
        </h1>
        <h2>Join us today and create your account to begin your journey!</h2>
      </hgroup>
      <SignupForm />
      <p className="[&_a]:text-purple-500 [&_a]:underline [&_a]:underline-offset-2">
        By clicking Continue, you acknowledge that you have read and agree with
        Ekehi&apos;s <Link to="/">Terms</Link> and{' '}
        <Link to="/">Privacy Policy</Link>
      </p>
    </section>
  )
}
