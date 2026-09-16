import { useNavigate } from 'react-router-dom'
import { AlertTriangle, ChefHat } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { expiryColor } from '../../utils/scoreColors.js'

export default function ExpiryAlert() {
  const { state } = useApp()
  const navigate = useNavigate()
  const expiring = state.pantry
    .filter((p) => p.daysUntilExpiry <= 3)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)
    .slice(0, 3)

  if (!expiring.length) return null

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-bold text-forest dark:text-paper">
          <AlertTriangle size={16} className="text-alert" /> Expiring Soon
        </h3>
        <button onClick={() => navigate('/pantry')} className="text-xs font-semibold text-accent">
          View pantry →
        </button>
      </div>
      <div className="space-y-2">
        {expiring.map((item) => {
          const c = expiryColor(item.daysUntilExpiry)
          const phrase =
            item.daysUntilExpiry <= 0
              ? 'Expires today'
              : item.daysUntilExpiry === 1
              ? 'Expires tomorrow'
              : `Expires in ${c.label}`
          return (
            <div
              key={item.id}
              className={`flex items-center gap-3 rounded-2xl p-2 ${c.bg} ${
                item.daysUntilExpiry <= 0 ? 'animate-pulse-red' : ''
              }`}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display font-black text-white"
                style={{ background: item.color }}
              >
                {item.initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-forest dark:text-paper">{item.name}</p>
                <p className={`text-xs font-bold ${c.text}`}>{phrase}</p>
              </div>
              <button
                onClick={() => navigate('/pantry')}
                className="flex items-center gap-1 rounded-full bg-forest px-3 py-1.5 text-xs font-semibold text-white active:scale-95"
              >
                <ChefHat size={13} /> Recipe
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
