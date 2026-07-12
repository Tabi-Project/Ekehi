import { describe, expect, it } from 'vitest'

import {
  guideListItemSchema,
  templateListItemSchema,
  trainingListItemSchema,
} from './resources.types'

// Samples mirror the columns each server list endpoint selects — contract
// checks against the `{ success, message, data, meta }` envelope's data rows.

const sampleTraining = {
  id: '7f3b2a10-91c4-4d6a-b1e2-5a8c9d0e1f23',
  reference_code: 'TRN-004',
  programme_name: 'Women in Business Accelerator',
  provider: 'Rise Academy',
  programme_type: 'accelerator',
  format: 'online',
  duration_range: '1_3_months',
  cost: '50000',
  currency: 'NGN',
  cost_type: 'paid',
  certification: 'Certificate of completion',
  topics_covered: 'Finance, marketing, operations',
  location: 'Lagos',
  location_scope: 'nigeria',
  application_deadline: '2026-04-01',
  apply_url: 'https://riseacademy.com/apply',
  is_featured: true,
  description: 'A 12-week accelerator for women-led businesses.',
  created_at: '2026-03-28T18:28:37.974461+00:00',
}

const sampleGuide = {
  id: 'a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d',
  title: 'Guide to understanding business credit scores',
  slug: 'business-credit-scores',
  summary: 'Improve your credit score with expert tips.',
  category: 'finance',
  created_at: '2026-03-28T18:28:37.974461+00:00',
}

const sampleTemplate = {
  id: 'b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e',
  title: 'Basic financial management template',
  description: 'A template for small and medium enterprises.',
  category: 'finance',
  file_url: 'https://example.com/template.xlsx',
  created_at: '2026-03-28T18:28:37.974461+00:00',
}

describe('trainingListItemSchema', () => {
  it('parses a row shaped like GET /trainings', () => {
    expect(trainingListItemSchema.parse(sampleTraining)).toEqual(sampleTraining)
  })

  it('accepts nulls on optional columns', () => {
    const result = trainingListItemSchema.parse({
      ...sampleTraining,
      provider: null,
      cost: null,
      currency: null,
      certification: null,
      topics_covered: null,
      location: null,
      application_deadline: null,
      apply_url: null,
      is_featured: null,
      description: null,
    })
    expect(result.provider).toBeNull()
    expect(result.application_deadline).toBeNull()
  })

  it('rejects a row missing programme_name', () => {
    const invalid: Record<string, unknown> = { ...sampleTraining }
    delete invalid.programme_name
    expect(() => trainingListItemSchema.parse(invalid)).toThrow()
  })
})

describe('guideListItemSchema', () => {
  it('parses a row shaped like GET /guides', () => {
    expect(guideListItemSchema.parse(sampleGuide)).toEqual(sampleGuide)
  })

  it('accepts null summary and category', () => {
    const result = guideListItemSchema.parse({
      ...sampleGuide,
      summary: null,
      category: null,
    })
    expect(result.summary).toBeNull()
    expect(result.category).toBeNull()
  })

  it('rejects a row missing slug (detail links need it)', () => {
    const invalid: Record<string, unknown> = { ...sampleGuide }
    delete invalid.slug
    expect(() => guideListItemSchema.parse(invalid)).toThrow()
  })
})

describe('templateListItemSchema', () => {
  it('parses a row shaped like GET /templates', () => {
    expect(templateListItemSchema.parse(sampleTemplate)).toEqual(sampleTemplate)
  })

  it('accepts nulls on optional columns', () => {
    const result = templateListItemSchema.parse({
      ...sampleTemplate,
      description: null,
      category: null,
      file_url: null,
    })
    expect(result.description).toBeNull()
    expect(result.file_url).toBeNull()
  })

  it('rejects a row missing id (detail links need it)', () => {
    const invalid: Record<string, unknown> = { ...sampleTemplate }
    delete invalid.id
    expect(() => templateListItemSchema.parse(invalid)).toThrow()
  })
})
