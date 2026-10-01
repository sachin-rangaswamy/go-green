import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { AppProvider, useApp } from './AppContext.jsx'

const wrapper = ({ children }) => <AppProvider>{children}</AppProvider>

beforeEach(() => {
  localStorage.clear()
})

describe('AppContext reducer + helpers', () => {
  it('starts not onboarded with seeded points', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    expect(result.current.state.onboarded).toBe(false)
    expect(result.current.state.user.points).toBeGreaterThan(0)
  })

  it('addPoints increases the user total', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    const before = result.current.state.user.points
    act(() => result.current.addPoints(25, 'test'))
    expect(result.current.state.user.points).toBe(before + 25)
  })

  it('COMPLETE_ONBOARDING stores the name and flips the flag', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() =>
      result.current.dispatch({
        type: 'COMPLETE_ONBOARDING',
        data: { name: 'Alex', dietary: ['Vegan'], homeStore: 'REWE' },
      })
    )
    expect(result.current.state.onboarded).toBe(true)
    expect(result.current.state.user.name).toBe('Alex')
  })

  it('removes a pantry item by id', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    const id = result.current.state.pantry[0].id
    const count = result.current.state.pantry.length
    act(() => result.current.dispatch({ type: 'REMOVE_FROM_PANTRY', id }))
    expect(result.current.state.pantry).toHaveLength(count - 1)
    expect(result.current.state.pantry.find((p) => p.id === id)).toBeUndefined()
  })

  it('does not add duplicate shopping-list items', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    act(() => result.current.dispatch({ type: 'ADD_TO_SHOPPING_LIST', name: 'Tofu' }))
    act(() => result.current.dispatch({ type: 'ADD_TO_SHOPPING_LIST', name: 'tofu' }))
    const matches = result.current.state.shoppingList.filter((s) => s.name.toLowerCase() === 'tofu')
    expect(matches).toHaveLength(1)
  })
})
