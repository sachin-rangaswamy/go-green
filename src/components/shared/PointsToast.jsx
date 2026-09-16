import { useApp } from '../../context/AppContext.jsx'

// Floating "+5 🌿" game-style rewards, stacked bottom-right above the nav.
export default function PointsToast() {
  const { state } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2">
      {state.toasts.map((t) => (
        <div
          key={t.id}
          className="animate-float-up rounded-full bg-forest px-5 py-2.5 text-center shadow-lg shadow-forest/40"
        >
          <div className="font-mono text-lg font-bold text-white">{t.text}</div>
          {t.sub && <div className="text-[11px] font-medium text-accent">{t.sub}</div>}
        </div>
      ))}
    </div>
  )
}
