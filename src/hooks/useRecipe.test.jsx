import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useRecipe } from './useRecipe.js'

const items = [{ name: 'Baby Spinach 200g' }, { name: 'Free-Range Eggs' }]

beforeEach(() => vi.restoreAllMocks())
afterEach(() => vi.restoreAllMocks())

describe('useRecipe', () => {
  it('falls back to a local recipe when the proxy fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    const { result } = renderHook(() => useRecipe())
    act(() => {
      result.current.generate(items)
    })
    await waitFor(() => expect(result.current.recipe).toBeTruthy(), { timeout: 4000 })
    expect(result.current.usedFallback).toBe(true)
    expect(result.current.recipe.ingredients.some((i) => i.fromPantry)).toBe(true)
    vi.unstubAllGlobals()
  })

  it('uses the proxy result when it succeeds', async () => {
    const apiRecipe = {
      name: 'AI Dish',
      time: '20 mins',
      servings: 2,
      difficulty: 'Easy',
      ingredients: [{ item: 'Eggs', amount: '2', fromPantry: true }],
      steps: ['Cook'],
      sustainabilityTip: 'Waste nothing',
    }
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(apiRecipe) })
    )
    const { result } = renderHook(() => useRecipe())
    act(() => {
      result.current.generate(items)
    })
    await waitFor(() => expect(result.current.recipe).toBeTruthy(), { timeout: 4000 })
    expect(result.current.usedFallback).toBe(false)
    expect(result.current.recipe.name).toBe('AI Dish')
    vi.unstubAllGlobals()
  })
})
