import { Cloud, Trash2, Sparkles, TreePine } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import AnimatedCounter from '../shared/AnimatedCounter.jsx'
import { treesFromCo2 } from '../../utils/formatters.js'

function Stat({ icon, value, decimals, label, suffix, accent }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/10 px-2 py-3 text-center">
      <div className="mb-1 text-white/90">{icon}</div>
      <div className="font-mono text-xl font-bold text-white">
        <AnimatedCounter value={value} decimals={decimals} />
        {suffix && <span className="text-sm font-semibold">{suffix}</span>}
      </div>
      <div className={`mt-0.5 text-[10px] font-medium leading-tight ${accent || 'text-paper/70'}`}>{label}</div>
    </div>
  )
}

export default function ImpactCard() {
  const { state } = useApp()
  const u = state.user
  const trees = treesFromCo2(u.co2Saved)

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-forest to-[#173a21] p-4 shadow-lg">
      <div className="pointer-events-none absolute -right-6 -top-8 text-8xl opacity-10">🌍</div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-base font-black uppercase tracking-wide text-white">Your Impact</h2>
        <span className="flex items-center gap-1 rounded-full bg-accent/25 px-2 py-0.5 text-[11px] font-semibold text-accent">
          <TreePine size={12} /> = {trees} trees
        </span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        <Stat icon={<Cloud size={20} />} value={u.co2Saved} decimals={1} suffix="kg" label="CO₂ saved" />
        <Stat icon={<Trash2 size={20} />} value={u.foodWastePrevented} decimals={1} suffix="kg" label="Waste cut" />
        <Stat
          icon={<Sparkles size={20} />}
          value={u.pointsThisWeek}
          label="Pts this week"
          accent="text-accent"
        />
        <Stat icon={<TreePine size={20} />} value={u.streak} label="Day streak" accent="text-warn" />
      </div>
    </div>
  )
}
