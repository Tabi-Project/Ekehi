import { Slot } from '@radix-ui/react-slot'
import type { ComponentProps, ReactNode } from 'react'
import { createContext, use, useId } from 'react'

import { cn } from '@/lib/utils'

import { Label } from './label'

type FormFieldContextValue = {
  id: string
  required: boolean
  hasError: boolean
  errorId: string
  descriptionId: string
}

const FormFieldContext = createContext<FormFieldContextValue | null>(null)

function useFormField() {
  const context = use(FormFieldContext)
  if (!context) {
    throw new Error('FormField subcomponents must be used inside <FormField>')
  }
  return context
}

type FormFieldRootProps = ComponentProps<'div'> & {
  name: string
  required?: boolean
  error?: string | null
  children: ReactNode
}

function FormFieldRoot({
  name,
  required = false,
  error,
  className,
  children,
  ...props
}: FormFieldRootProps) {
  const reactId = useId()
  const id = `${name}-${reactId}`
  const value: FormFieldContextValue = {
    id,
    required,
    hasError: Boolean(error),
    errorId: `${id}-error`,
    descriptionId: `${id}-desc`,
  }

  return (
    <FormFieldContext value={value}>
      <div className={cn('flex flex-col gap-1.5', className)} {...props}>
        {children}
        {error ? <FormFieldError>{error}</FormFieldError> : null}
      </div>
    </FormFieldContext>
  )
}

type FormFieldLabelProps = ComponentProps<typeof Label>

function FormFieldLabel({ children, ...props }: FormFieldLabelProps) {
  const { id, required } = useFormField()
  return (
    <Label htmlFor={id} {...props}>
      {children}
      {required ? <span className="text-error ml-0.5">*</span> : null}
    </Label>
  )
}

type FormFieldControlProps = {
  children: ReactNode
}

function FormFieldControl({ children }: FormFieldControlProps) {
  const { id, hasError, errorId, descriptionId } = useFormField()
  return (
    <Slot
      id={id}
      aria-invalid={hasError || undefined}
      aria-describedby={hasError ? errorId : descriptionId}
    >
      {children}
    </Slot>
  )
}

type FormFieldDescriptionProps = ComponentProps<'p'>

function FormFieldDescription({
  className,
  ...props
}: FormFieldDescriptionProps) {
  const { descriptionId } = useFormField()
  return (
    <p
      id={descriptionId}
      className={cn('text-text-muted text-sm', className)}
      {...props}
    />
  )
}

type FormFieldErrorProps = ComponentProps<'p'>

function FormFieldError({ className, ...props }: FormFieldErrorProps) {
  const { errorId } = useFormField()
  return (
    <p
      id={errorId}
      role="alert"
      className={cn('text-error text-sm', className)}
      {...props}
    />
  )
}

export const FormField = Object.assign(FormFieldRoot, {
  Label: FormFieldLabel,
  Control: FormFieldControl,
  Description: FormFieldDescription,
  Error: FormFieldError,
})
