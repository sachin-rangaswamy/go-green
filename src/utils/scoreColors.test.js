import { describe, it, expect } from 'vitest'
import { scoreColor, scoreTextColor, expiryColor } from './scoreColors.js'

describe('scoreColor', () => {
  it('maps each grade to its brand colour', () => {
    expect(scoreColor('A')).toBe('#1B5E20')
    expect(scoreColor('E')).toBe('#E53935')
  })
  it('falls back to grey for unknown grades', () => {
    expect(scoreColor('Z')).toBe('#9E9E9E')
    expect(scoreColor(undefined)).toBe('#9E9E9E')
  })
})

describe('scoreTextColor', () => {
  it('uses dark text only on the yellow C grade', () => {
    expect(scoreTextColor('C')).toBe('#1A1A1A')
    expect(scoreTextColor('A')).toBe('#FFFFFF')
  })
})

describe('expiryColor', () => {
  it('flags same-day / tomorrow as urgent (red)', () => {
    expect(expiryColor(0).label).toBe('Today')
    expect(expiryColor(1).label).toBe('1 day')
    expect(expiryColor(0).text).toBe('text-alert')
  })
  it('treats 2–5 days as a warning', () => {
    const c = expiryColor(3)
    expect(c.label).toBe('3 days')
    expect(c.ring).toBe('ring-warn')
  })
  it('treats >5 days as healthy (green)', () => {
    const c = expiryColor(9)
    expect(c.text).toBe('text-forest')
    expect(c.label).toBe('9 days')
  })
})
