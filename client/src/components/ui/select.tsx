import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

type SelectProps = ComponentProps<'select'> & {
  placeholder?: string
}

export function Select({
  className,
  children,
  placeholder = 'Select…',
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          'border-line bg-surface text-content hover:border-line-strong focus-visible:border-primary focus-visible:ring-primary h-10 w-full appearance-none rounded-md border px-3 pr-9 text-base transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {children}
      </select>
      <ChevronDown
        size={16}
        aria-hidden
        className="text-content-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      />
    </div>
  )
}

export type { SelectProps }
