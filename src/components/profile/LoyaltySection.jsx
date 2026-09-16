import { useState } from 'react'
import { Check, Link2, CreditCard } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function LoyaltySection() {
  const { state, pushToast } = useApp()
  const [connected, setConnected] = useState(state.user.connectedLoyalty)

  const connect = (name) => {
    setConnected((c) => [...c, name])
    pushToast('Connected! 🔗', name)
  }

  const all = [...connected, ...state.user.availableLoyalty.filter((a) => !connected.includes(a))]

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <h3 className="flex items-center gap-1.5 font-bold text-forest dark:text-paper">
        <CreditCard size={16} /> Loyalty Integration
      </h3>
      <p className="mt-0.5 text-xs text-earth dark:text-paper/60">
        Convert green points into supermarket rewards. <span className="font-semibold">100 🌿 = 50 loyalty pts</span>
      </p>
      <div className="mt-3 space-y-2">
        {all.map((name) => {
          const isConnected = connected.includes(name)
          return (
            <div key={name} className="flex items-center gap-3 rounded-2xl bg-paper/60 p-2.5 dark:bg-white/5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-lg dark:bg-white/10">
                🏪
              </span>
              <span className="flex-1 text-sm font-semibold text-forest dark:text-paper">{name}</span>
              {isConnected ? (
                <span className="flex items-center gap-1 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-forest dark:text-accent">
                  <Check size={13} /> Connected
                </span>
              ) : (
                <button
                  onClick={() => connect(name)}
                  className="flex items-center gap-1 rounded-full bg-forest px-3 py-1.5 text-xs font-bold text-white active:scale-95"
                >
                  <Link2 size={12} /> Connect
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
