import { Dropdown } from '#/components/ui/dropdown'
import { cn } from '#/lib/utils'

type FilterOption = {
  value: string
  label: string
}

type FilterDropdownProps = {
  label: string
  options: ReadonlyArray<FilterOption>
  value: string | null
  onChange: (value: string | null) => void
  name?: string
  className?: string
}

export function FilterDropdown({
  label,
  options,
  value,
  onChange,
  name,
  className,
}: FilterDropdownProps) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <Dropdown modal={false}>
      <Dropdown.Trigger
        name={name}
        data-selected={selectedOption ? '' : undefined}
        className={cn(
          'data-[state=open]:ring-primary-subtle data-selected:text-primary h-auto gap-4 border-[1.5px] px-4 py-3 text-base whitespace-nowrap data-selected:font-semibold data-[state=open]:ring-[3px]',
          className,
        )}
      >
        {selectedOption?.label ?? label}
      </Dropdown.Trigger>
      <Dropdown.Content
        align="start"
        sideOffset={8}
        className="min-w-[var(--radix-dropdown-menu-trigger-width)] border-[1.5px] p-0 py-2 shadow-lg"
      >
        {options.map((option) => (
          <Dropdown.Item
            key={option.value}
            onSelect={() =>
              onChange(option.value === value ? null : option.value)
            }
            className={cn(
              'rounded-none px-6 py-3 text-base whitespace-nowrap',
              option.value === value && 'text-primary font-semibold',
            )}
          >
            {option.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Content>
    </Dropdown>
  )
}
