import { Lock } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function BadgeGrid() {
  const { state } = useApp()
  const unlockedCount = state.badges.filter((b) => b.unlocked).length

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-forest dark:text-paper">Badges</h3>
        <span className="text-xs font-semibold text-earth">
          {unlockedCount}/{state.badges.length} unlocked
        </span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {state.badges.map((b) => (
          <div key={b.id} className="flex flex-col items-center gap-1 text-center">
            <div
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition ${
                b.unlocked
                  ? 'bg-accent/15 shadow-sm'
                  : 'bg-black/5 grayscale dark:bg-white/5'
              }`}
            >
              <span className={b.unlocked ? '' : 'opacity-30'}>{b.icon}</span>
              {!b.unlocked && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-earth text-white">
                  <Lock size={10} />
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-semibold leading-tight ${
                b.unlocked ? 'text-forest dark:text-paper' : 'text-earth/60'
              }`}
            >
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
