import { Users, Gift, Check, Plus } from 'lucide-react'

export default function ChallengeCard({ challenge, onAdvance }) {
  const c = challenge
  const pct = Math.round((c.progress / c.target) * 100)
  const done = c.progress >= c.target

  return (
    <div className="snap-card w-64 shrink-0 overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-white/5">
      <div className="flex h-24 items-center justify-center text-5xl" style={{ background: `${c.color}22` }}>
        {c.icon}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-display text-lg font-black leading-tight text-forest dark:text-paper">{c.title}</h3>
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-warn/20 px-2 py-0.5 text-[11px] font-bold text-[#B26A00]">
            <Gift size={11} /> {c.reward}
          </span>
        </div>
        <p className="mt-1 h-8 text-xs text-earth dark:text-paper/60">{c.description}</p>

        <div className="mt-2 flex items-center justify-between text-xs font-semibold">
          <span className="text-forest dark:text-paper">
            {c.progress}/{c.target} {c.unit}
          </span>
          <span className="text-earth">{pct}%</span>
        </div>
        <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: c.color }}
          />
        </div>

        <p className="mt-2 flex items-center gap-1 text-[11px] text-earth">
          <Users size={11} /> {c.participants.toLocaleString('en-GB')} taking part
        </p>

        <button
          onClick={() => onAdvance(c)}
          disabled={done}
          className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold transition active:scale-95 ${
            done ? 'bg-accent/20 text-forest dark:text-accent' : 'text-white'
          }`}
          style={done ? undefined : { background: c.color }}
        >
          {done ? (
            <>
              <Check size={15} /> Completed!
            </>
          ) : (
            <>
              <Plus size={15} /> Log progress
            </>
          )}
        </button>
      </div>
    </div>
  )
}
