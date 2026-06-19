import { Slot } from '@radix-ui/react-slot'
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 active:translate-y-0.5 active:scale-[0.99] rounded-md font-medium transition-[colors,scale,translate] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active',
        secondary: 'bg-surface-subtle text-content hover:bg-surface-muted',
        outline:
          'border border-line bg-transparent text-content hover:bg-surface-subtle',
        ghost: 'bg-transparent text-content hover:bg-surface-subtle',
      },
      size: {
        sm: 'h-10 px-3 text-sm',
        md: 'h-12 px-4 text-base',
        lg: 'h-14 px-6 text-lg',
      },
      full: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

export function Button({
  className,
  variant,
  size,
  full,
  asChild = false,
  type = 'button',
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, full }), className)}
      {...(asChild ? {} : { type })}
      {...props}
    />
  )
}

export { buttonVariants }
export type { ButtonProps }
