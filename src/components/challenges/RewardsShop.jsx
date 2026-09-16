import { useState } from 'react'
import { Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { fmtPoints } from '../../utils/formatters.js'

export default function RewardsShop() {
  const { state, dispatch, pushToast } = useApp()
  const [redeemed, setRedeemed] = useState(null)

  const redeem = (r) => {
    if (state.user.points < r.cost) return
    dispatch({ type: 'REDEEM_REWARD', cost: r.cost })
    setRedeemed(r)
    pushToast('Redeemed! 🎉', r.title)
    setTimeout(() => setRedeemed(null), 2500)
  }

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-forest dark:text-paper">Redeem Points</h3>
        <span className="font-mono text-sm font-bold text-forest dark:text-accent">
          🌿 {fmtPoints(state.user.points)}
        </span>
      </div>
      <div className="space-y-2">
        {state.rewards.map((r) => {
          const afford = state.user.points >= r.cost
          const just = redeemed?.id === r.id
          return (
            <div key={r.id} className="flex items-center gap-3 rounded-2xl bg-paper/60 p-2.5 dark:bg-white/5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl dark:bg-white/10">
                {r.icon}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-forest dark:text-paper">{r.title}</p>
                <p className="text-xs text-earth">via {r.partner}</p>
              </div>
              <button
                onClick={() => redeem(r)}
                disabled={!afford || just}
                className={`shrink-0 rounded-full px-3 py-2 text-xs font-bold transition active:scale-95 ${
                  just
                    ? 'bg-accent text-white'
                    : afford
                    ? 'bg-forest text-white'
                    : 'bg-black/5 text-earth/50 dark:bg-white/10'
                }`}
              >
                {just ? <Check size={14} /> : `${fmtPoints(r.cost)} pts`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
