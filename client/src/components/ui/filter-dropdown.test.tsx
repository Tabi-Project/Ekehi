import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { FilterDropdown } from './filter-dropdown'

const OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
]

// Radix DropdownMenu opens on pointerdown, not click — same pattern as
// navbar.test.tsx.
const openDropdown = async (name: RegExp) => {
  fireEvent.pointerDown(screen.getByRole('button', { name }), {
    button: 0,
    ctrlKey: false,
  })
  await screen.findByRole('menu')
}

describe('FilterDropdown', () => {
  it('shows the label when nothing is selected', () => {
    render(
      <FilterDropdown
        label="Status"
        options={OPTIONS}
        value={null}
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /status/i })).toBeTruthy()
  })

  it('opens the panel with all options', async () => {
    render(
      <FilterDropdown
        label="Status"
        options={OPTIONS}
        value={null}
        onChange={vi.fn()}
      />,
    )

    await openDropdown(/status/i)

    expect(screen.getByText('Open')).toBeTruthy()
    expect(screen.getByText('Closed')).toBeTruthy()
  })

  it('calls onChange with the value when an option is picked', async () => {
    const onChange = vi.fn()

    render(
      <FilterDropdown
        label="Status"
        options={OPTIONS}
        value={null}
        onChange={onChange}
      />,
    )

    await openDropdown(/status/i)

    fireEvent.click(screen.getByText('Open'))

    expect(onChange).toHaveBeenCalledWith('open')
  })

  it('shows the selected label on the trigger', () => {
    render(
      <FilterDropdown
        label="Status"
        options={OPTIONS}
        value="closed"
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /closed/i })).toBeTruthy()
  })

  it('deselects when the selected option is picked again', async () => {
    const onChange = vi.fn()

    render(
      <FilterDropdown
        label="Status"
        options={OPTIONS}
        value="open"
        onChange={onChange}
      />,
    )

    await openDropdown(/open/i)

    fireEvent.click(screen.getByRole('menuitem', { name: 'Open' }))

    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('closes the panel after picking an option', async () => {
    render(
      <FilterDropdown
        label="Status"
        options={OPTIONS}
        value={null}
        onChange={vi.fn()}
      />,
    )

    await openDropdown(/status/i)

    fireEvent.click(screen.getByText('Open'))

    await waitFor(() => {
      expect(screen.queryByRole('menu')).toBeNull()
    })
  })
})
