import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import { ChevronDown } from 'lucide-react'
import type { ComponentProps } from 'react'

import { cn } from '#/lib/utils'

const DropdownRoot = DropdownPrimitive.Root
const DropdownPortal = DropdownPrimitive.Portal
const DropdownGroup = DropdownPrimitive.Group
const DropdownSeparator = (
  props: ComponentProps<typeof DropdownPrimitive.Separator>,
) => (
  <DropdownPrimitive.Separator
    {...props}
    className={cn('bg-border my-1 h-px', props.className)}
  />
)

type DropdownTriggerProps = ComponentProps<typeof DropdownPrimitive.Trigger> & {
  showChevron?: boolean
}

function DropdownTrigger({
  className,
  children,
  showChevron = true,
  ...props
}: DropdownTriggerProps) {
  return (
    <DropdownPrimitive.Trigger
      className={cn(
        'border-line bg-surface text-content hover:border-line-strong focus-visible:ring-primary data-[state=open]:border-primary inline-flex h-10 items-center justify-between gap-2 rounded-md border px-3 text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      {showChevron ? (
        <ChevronDown
          size={14}
          aria-hidden
          className="text-content-muted transition-transform data-[state=open]:rotate-180"
        />
      ) : null}
    </DropdownPrimitive.Trigger>
  )
}

function DropdownContent({
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Content>) {
  return (
    <DropdownPortal>
      <DropdownPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'border-line bg-surface z-50 min-w-40 overflow-hidden rounded-md border p-1 shadow-md',
          className,
        )}
        {...props}
      />
    </DropdownPortal>
  )
}

function DropdownItem({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Item>) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        'text-content focus:bg-surface-subtle flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition-colors outline-none select-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

function DropdownLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownPrimitive.Label>) {
  return (
    <DropdownPrimitive.Label
      className={cn(
        'text-content-muted px-3 py-1.5 text-xs font-medium',
        className,
      )}
      {...props}
    />
  )
}

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Label: DropdownLabel,
  Separator: DropdownSeparator,
  Group: DropdownGroup,
})
