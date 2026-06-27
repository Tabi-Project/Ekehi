import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { IMAGES } from '#/assets/images'

import { ContributorsPage } from './contributors-page'

describe('ContributorsPage', () => {
  it('sets a resolved background image on every contributor card', () => {
    const { container } = render(<ContributorsPage />)

    const figures = container.querySelectorAll<HTMLElement>('figure')

    expect(figures.length).toBeGreaterThan(0)

    const resolvedBackgrounds = Object.values(IMAGES.cardBackgrounds)

    figures.forEach((figure) => {
      const backgroundImage = figure.style.backgroundImage

      // Must reference a real bundled asset, never an empty/unresolved url().
      expect(backgroundImage).toMatch(/^url\(.+\)$/)
      expect(
        resolvedBackgrounds.some((asset) => backgroundImage.includes(asset)),
      ).toBe(true)
    })
  })

  it('cycles through every card-background variant', () => {
    const { container } = render(<ContributorsPage />)

    const figures = container.querySelectorAll<HTMLElement>('figure')
    const usedBackgrounds = new Set(
      Array.from(figures, (figure) => figure.style.backgroundImage),
    )

    // All five palette variants should appear across the grid.
    expect(usedBackgrounds.size).toBe(
      Object.keys(IMAGES.cardBackgrounds).length,
    )
  })
})
