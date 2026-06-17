import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

type LabelProps = ComponentProps<'label'>

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn('text-text-primary text-sm font-medium', className)}
      {...props}
    />
  )
}

export type { LabelProps }
