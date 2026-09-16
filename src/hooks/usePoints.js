import { useApp } from '../context/AppContext.jsx'

// Thin convenience wrapper around the context's point helpers.
export function usePoints() {
  const { state, addPoints } = useApp()
  return { points: state.user.points, addPoints }
}
