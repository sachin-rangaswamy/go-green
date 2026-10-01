import { describe, it, expect } from 'vitest'
import { mapOffProduct } from './openFoodFacts.js'

const base = {
  code: '123',
  product_name: 'Test Oat Drink',
  brands: 'Testy, Other',
  nutriscore_grade: 'b',
  labels_tags: [],
  categories_tags: ['en:plant-based-drinks'],
}

describe('mapOffProduct — health score', () => {
  it('uses the real Nutri-Score grade and maps it to a number', () => {
    const p = mapOffProduct({ ...base, nutriscore_grade: 'b' })
    expect(p.healthScore).toBe('B')
    expect(p.healthScoreNumeric).toBe(72)
  })
  it('defaults to C when Nutri-Score is unknown', () => {
    const p = mapOffProduct({ ...base, nutriscore_grade: 'unknown' })
    expect(p.healthScore).toBe('C')
  })
})

describe('mapOffProduct — eco score', () => {
  it('uses a real environmental grade when present and does not flag it estimated', () => {
    const p = mapOffProduct({ ...base, environmental_score_grade: 'a' })
    expect(p.ecoScore).toBe('A')
    expect(p.ecoScoreNumeric).toBe(90)
    expect(p._estimatedEco).toBe(false)
  })
  it('estimates and flags the eco score when OFF has none', () => {
    const p = mapOffProduct(base)
    expect(p._estimatedEco).toBe(true)
    expect(['A', 'B', 'C', 'D', 'E']).toContain(p.ecoScore)
  })
})

describe('mapOffProduct — packaging recyclability', () => {
  it('marks glass/cardboard recyclable', () => {
    const p = mapOffProduct({ ...base, packagings: [{ material: 'en:glass' }] })
    expect(p.packaging.recyclable).toBe(true)
  })
  it('marks plastic non-recyclable', () => {
    const p = mapOffProduct({ ...base, packagings: [{ material: 'en:plastic' }] })
    expect(p.packaging.recyclable).toBe(false)
  })
})

describe('mapOffProduct — certifications & carbon', () => {
  it('translates known label tags to readable certifications', () => {
    const p = mapOffProduct({ ...base, labels_tags: ['en:organic', 'en:fairtrade'] })
    expect(p.certifications).toContain('Organic')
    expect(p.certifications).toContain('Fairtrade')
  })
  it('reads agribalyse carbon when available', () => {
    const p = mapOffProduct({ ...base, ecoscore_data: { agribalyse: { co2_total: 0.83 } } })
    expect(p.carbon.kgCO2).toBe(0.83)
  })
  it('leaves carbon null when unavailable', () => {
    expect(mapOffProduct(base).carbon.kgCO2).toBeNull()
  })
  it('takes the first brand only', () => {
    expect(mapOffProduct(base).brand).toBe('Testy')
  })
})
