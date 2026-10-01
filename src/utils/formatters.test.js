import { describe, it, expect } from 'vitest'
import { fmtNumber, fmtPoints, treesFromCo2, greeting } from './formatters.js'

describe('fmtNumber', () => {
  it('groups thousands', () => {
    expect(fmtNumber(1234)).toBe('1,234')
  })
  it('respects the requested decimals', () => {
    expect(fmtNumber(1.235, 1)).toBe('1.2')
  })
})

describe('fmtPoints', () => {
  it('formats points with thousands separators', () => {
    expect(fmtPoints(1847)).toBe('1,847')
  })
})

describe('treesFromCo2', () => {
  it('estimates trees from kg CO₂ (~21kg/tree/yr)', () => {
    expect(treesFromCo2(47.3)).toBe(2)
  })
  it('never returns less than one tree', () => {
    expect(treesFromCo2(1)).toBe(1)
    expect(treesFromCo2(0)).toBe(1)
  })
})

describe('greeting', () => {
  it('returns a valid time-of-day greeting', () => {
    expect(['Good morning', 'Good afternoon', 'Good evening']).toContain(greeting())
  })
})
