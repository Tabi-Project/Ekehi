import { LoginForm } from '../components/login-form'

export function LoginPage() {
  return (
    <section
      className="content-grid min-h-svh place-content-center space-y-6 py-6 text-center leading-[150%] text-neutral-700"
      style={{ '--content-max-width': '35rem' } as React.CSSProperties}
    >
      <hgroup>
        <h1 className="mb-0.5 text-2xl font-medium text-neutral-900">
          Sign In
        </h1>
        <h2>Log in to access your account and continue your journey!</h2>
      </hgroup>
      <LoginForm />
    </section>
  )
}
