import { Search } from 'lucide-react'
import type { ComponentProps, FormEvent } from 'react'

import { cn } from '#/lib/utils'

import { Button } from './button'
import { Input } from './input'

type SearchBarProps = Omit<ComponentProps<'form'>, 'onSubmit'> & {
  placeholder?: string
  buttonLabel?: string
  name?: string
  defaultValue?: string
  onSearch: (value: string) => void
}

export function SearchBar({
  placeholder,
  buttonLabel = 'Search',
  name = 'q',
  defaultValue,
  onSearch,
  className,
  ...props
}: SearchBarProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const value = String(data.get(name) ?? '').trim()
    onSearch(value)
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn('flex w-full items-center gap-2', className)}
      {...props}
    >
      <Input
        type="search"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="flex-1"
      />
      <Button type="submit" variant="primary">
        <Search size={16} aria-hidden />
        {buttonLabel}
      </Button>
    </form>
  )
}

export type { SearchBarProps }
