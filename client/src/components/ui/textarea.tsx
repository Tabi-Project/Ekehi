import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

type TextareaProps = ComponentProps<'textarea'>

export function Textarea({ className, rows = 5, ...props }: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'border-line bg-surface text-content placeholder:text-content-muted hover:border-line-strong focus-visible:border-primary focus-visible:ring-primary w-full rounded-md border px-3 py-2 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

export type { TextareaProps }
