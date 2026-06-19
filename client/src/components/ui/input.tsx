import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

const inputVariants = cva(
  'w-full rounded-md text-base font-medium text-content placeholder:text-content-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-purple-50 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'h-12 border border-line bg-surface px-3 hover:border-line-strong focus-visible:border-primary',
        filled: 'h-11 border-0 bg-surface-subtle px-3 focus-visible:ring-2',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type InputProps = Omit<ComponentProps<'input'>, 'size'> &
  VariantProps<typeof inputVariants>

export function Input({
  className,
  variant,
  type = 'text',
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      {...props}
    />
  )
}

export { inputVariants }
export type { InputProps }
