import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import userData from '../data/user.json'
import pantryData from '../data/pantry.json'
import challengesData from '../data/challenges.json'
import { loadState, saveState, clearState } from '../utils/persist.js'
import { haptic } from '../utils/haptics.js'

const AppContext = createContext(null)

let toastSeq = 0

const initialState = {
  user: { ...userData },
  pantry: [...pantryData],
  challenges: challengesData.active.map((c) => ({ ...c })),
  completedChallenges: [...challengesData.completed],
  badges: challengesData.badges.map((b) => ({ ...b })),
  rewards: challengesData.rewards,
  shoppingList: [
    { id: 's1', name: 'Oat milk', done: false },
    { id: 's2', name: 'Seasonal veg box', done: false },
    { id: 's3', name: 'Chickpeas (tin)', done: true },
  ],
  savedRecipes: [],
  joinedEvents: [],
  joinedGroups: [],
  likedPosts: [],
  toasts: [],
  badgeUnlock: null,
  darkMode: false,
  onboarded: false,
}

// Merge persisted slices over defaults on first load.
function hydrate() {
  const saved = loadState()
  if (!saved) return initialState
  return { ...initialState, ...saved, toasts: [], badgeUnlock: null }
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_POINTS': {
      const points = state.user.points + action.amount
      return { ...state, user: { ...state.user, points } }
    }
    case 'PUSH_TOAST':
      return { ...state, toasts: [...state.toasts, action.toast] }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }
    case 'ADD_TO_PANTRY':
      if (state.pantry.some((p) => p.id === action.item.id)) return state
      return { ...state, pantry: [action.item, ...state.pantry] }
    case 'REMOVE_FROM_PANTRY':
      return { ...state, pantry: state.pantry.filter((p) => p.id !== action.id) }
    case 'ADD_TO_SHOPPING_LIST':
      if (state.shoppingList.some((s) => s.name.toLowerCase() === action.name.toLowerCase())) return state
      return {
        ...state,
        shoppingList: [...state.shoppingList, { id: `s${Date.now()}`, name: action.name, done: false }],
      }
    case 'TOGGLE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingList: state.shoppingList.map((s) => (s.id === action.id ? { ...s, done: !s.done } : s)),
      }
    case 'ADVANCE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map((c) =>
          c.id === action.id ? { ...c, progress: Math.min(c.target, c.progress + 1) } : c
        ),
      }
    case 'UNLOCK_BADGE':
      return {
        ...state,
        badges: state.badges.map((b) => (b.id === action.id ? { ...b, unlocked: true } : b)),
        user: state.user.badges.includes(action.id)
          ? state.user
          : { ...state.user, badges: [...state.user.badges, action.id] },
      }
    case 'SHOW_BADGE_UNLOCK':
      return { ...state, badgeUnlock: action.badge }
    case 'CLEAR_BADGE_UNLOCK':
      return { ...state, badgeUnlock: null }
    case 'SAVE_RECIPE':
      if (state.savedRecipes.some((r) => r.name === action.recipe.name)) return state
      return { ...state, savedRecipes: [action.recipe, ...state.savedRecipes] }
    case 'TOGGLE_EVENT': {
      const joined = state.joinedEvents.includes(action.id)
      return {
        ...state,
        joinedEvents: joined
          ? state.joinedEvents.filter((e) => e !== action.id)
          : [...state.joinedEvents, action.id],
      }
    }
    case 'TOGGLE_GROUP': {
      const joined = state.joinedGroups.includes(action.id)
      return {
        ...state,
        joinedGroups: joined
          ? state.joinedGroups.filter((g) => g !== action.id)
          : [...state.joinedGroups, action.id],
      }
    }
    case 'TOGGLE_LIKE': {
      const liked = state.likedPosts.includes(action.id)
      return {
        ...state,
        likedPosts: liked ? state.likedPosts.filter((p) => p !== action.id) : [...state.likedPosts, action.id],
      }
    }
    case 'REDEEM_REWARD':
      return { ...state, user: { ...state.user, points: state.user.points - action.cost } }
    case 'TOGGLE_DARK':
      return { ...state, darkMode: !state.darkMode }
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        onboarded: true,
        user: {
          ...state.user,
          name: action.data.name?.trim() || state.user.name,
          dietary: action.data.dietary?.length ? action.data.dietary : state.user.dietary,
          homeStore: action.data.homeStore || null,
        },
      }
    case 'RESET_ONBOARDING':
      return { ...state, onboarded: false }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate)

  useEffect(() => {
    const root = document.documentElement
    if (state.darkMode) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [state.darkMode])

  // Persist a curated subset whenever it changes.
  useEffect(() => {
    saveState(state)
  }, [state])

  const pushToast = useCallback((text, sub) => {
    const id = ++toastSeq
    dispatch({ type: 'PUSH_TOAST', toast: { id, text, sub } })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 1600)
  }, [])

  const addPoints = useCallback(
    (amount, label) => {
      dispatch({ type: 'ADD_POINTS', amount })
      pushToast(`+${amount} 🌿`, label)
      haptic('light')
    },
    [pushToast]
  )

  const unlockBadge = useCallback((badge) => {
    dispatch({ type: 'UNLOCK_BADGE', id: badge.id })
    dispatch({ type: 'SHOW_BADGE_UNLOCK', badge })
    haptic('celebrate')
  }, [])

  const resetProgress = useCallback(() => {
    clearState()
    window.location.reload()
  }, [])

  const value = {
    state,
    dispatch,
    pushToast,
    addPoints,
    unlockBadge,
    resetProgress,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
