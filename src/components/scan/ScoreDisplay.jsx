import { useEffect, useState } from 'react'
import { Apple, Globe } from 'lucide-react'
import { scoreColor, scoreTextColor } from '../../utils/scoreColors.js'

function ScoreMeter({ icon, label, grade, numeric, delay, note }) {
  const [w, setW] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setW(numeric), delay + 120)
    return () => clearTimeout(t)
  }, [numeric, delay])

  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-14 w-14 shrink-0 animate-score-pop items-center justify-center rounded-2xl font-display text-3xl font-black shadow"
        style={{ backgroundColor: scoreColor(grade), color: scoreTextColor(grade), animationDelay: `${delay}ms` }}
      >
        {grade}
      </div>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-earth">
          {icon} {label}
          {note && (
            <span className="rounded-full bg-earth/15 px-1.5 py-0.5 text-[9px] font-semibold normal-case text-earth">
              {note}
            </span>
          )}
        </p>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${w}%`, backgroundColor: scoreColor(grade) }}
          />
        </div>
        <p className="mt-1 font-mono text-[11px] font-semibold text-earth">{numeric}/100</p>
      </div>
    </div>
  )
}

export default function ScoreDisplay({ product }) {
  return (
    <div className="space-y-3 rounded-2xl bg-paper/60 p-3 dark:bg-white/5">
      <ScoreMeter
        icon={<Apple size={13} className="text-alert" />}
        label="Health Score"
        grade={product.healthScore}
        numeric={product.healthScoreNumeric}
        delay={0}
      />
      <ScoreMeter
        icon={<Globe size={13} className="text-forest" />}
        label="Eco Score"
        grade={product.ecoScore}
        numeric={product.ecoScoreNumeric}
        delay={200}
        note={product._estimatedEco ? 'estimated' : null}
      />
    </div>
  )
}
