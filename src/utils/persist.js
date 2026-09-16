// Local-first persistence so demo progress + onboarding survive reloads.
// Safe to call in sandboxed contexts where localStorage may throw.
const KEY = 'gogreen-state-v1'

// Only these slices are persisted (transient UI like toasts is excluded).
const PERSIST_KEYS = [
  'user',
  'pantry',
  'challenges',
  'completedChallenges',
  'badges',
  'shoppingList',
  'savedRecipes',
  'joinedEvents',
  'joinedGroups',
  'likedPosts',
  'darkMode',
  'onboarded',
]

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    const subset = {}
    for (const k of PERSIST_KEYS) if (k in state) subset[k] = state[k]
    localStorage.setItem(KEY, JSON.stringify(subset))
  } catch {
    /* storage full or blocked — ignore */
  }
}

export function clearState() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
