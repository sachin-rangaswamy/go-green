import { Leaf, Flame } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { fmtPoints } from '../../utils/formatters.js'

// Sticky top bar with brand + live points + streak.
export default function Header({ title }) {
  const { state } = useApp()
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between bg-forest px-4 py-3 text-white shadow-md pt-[max(0.75rem,env(safe-area-inset-top))]">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Leaf size={18} className="text-white" />
        </span>
        <div className="leading-none">
          {title ? (
            <span className="font-display text-lg font-black tracking-wide">{title}</span>
          ) : (
            <>
              <span className="font-display text-lg font-black tracking-wide">Go Green</span>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">
          <Flame size={13} className="text-warn" />
          {state.user.streak}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-mono text-xs font-bold">
          🌿 {fmtPoints(state.user.points)}
        </span>
      </div>
    </header>
  )
}
