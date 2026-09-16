import { useApp } from '../../context/AppContext.jsx'
import Confetti from './Confetti.jsx'

// Full-screen celebration overlay shown when a badge is unlocked.
export default function BadgeUnlock() {
  const { state, dispatch } = useApp()
  const badge = state.badgeUnlock
  if (!badge) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-forest/95 px-8 text-center backdrop-blur-sm"
      onClick={() => dispatch({ type: 'CLEAR_BADGE_UNLOCK' })}
    >
      <Confetti />
      <p className="mb-2 font-display text-lg uppercase tracking-widest text-accent animate-fade-in">
        Badge Unlocked!
      </p>
      <div className="my-4 flex h-40 w-40 animate-badge-glow items-center justify-center rounded-full bg-white text-7xl animate-score-pop">
        {badge.icon}
      </div>
      <h2 className="font-display text-4xl font-black text-white animate-fade-in">{badge.name}</h2>
      <p className="mt-2 max-w-xs text-sm text-paper/80 animate-fade-in">{badge.desc}</p>
      <button className="mt-8 rounded-full bg-accent px-8 py-3 font-semibold text-white shadow-lg active:scale-95">
        Awesome! 🎉
      </button>
      <p className="mt-3 text-xs text-paper/50">tap anywhere to close</p>
    </div>
  )
}
