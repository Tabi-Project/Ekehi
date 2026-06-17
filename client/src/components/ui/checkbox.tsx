import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'>

export function Checkbox({ className, ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        'border-border text-primary focus-visible:ring-primary h-4 w-4 cursor-pointer rounded focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export type { CheckboxProps }
