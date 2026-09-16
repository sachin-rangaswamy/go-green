import { useState } from 'react'
import { ChevronDown, Package, Cloud, MapPin, Award, Droplets, Check, X, Minus } from 'lucide-react'
import { fmtNumber } from '../../utils/formatters.js'

// good: true = green tick, false = red cross, null = unknown (neutral)
function Row({ icon, title, detail, good }) {
  const badge =
    good === null
      ? { cls: 'bg-black/15 text-white dark:bg-white/20', el: <Minus size={13} /> }
      : good
      ? { cls: 'bg-accent text-white', el: <Check size={13} /> }
      : { cls: 'bg-alert text-white', el: <X size={13} /> }
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-earth">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-forest dark:text-paper">{title}</p>
        <p className="text-xs text-earth dark:text-paper/60">{detail}</p>
      </div>
      <span className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full ${badge.cls}`}>
        {badge.el}
      </span>
    </div>
  )
}

export default function ScoreBreakdown({ product }) {
  const [open, setOpen] = useState(false)
  const p = product

  const certGood = p.certifications.length >= 2

  return (
    <div className="rounded-2xl border border-black/5 dark:border-white/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3"
      >
        <span className="text-sm font-bold text-forest dark:text-paper">Score Breakdown</span>
        <ChevronDown
          size={18}
          className={`text-earth transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid overflow-hidden px-4 transition-all duration-300 ${
          open ? 'grid-rows-[1fr] pb-2' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 divide-y divide-black/5 dark:divide-white/5">
          <Row
            icon={<Package size={17} />}
            title="Packaging"
            detail={
              p.packaging.material +
              (p.packaging.recycledContent != null ? `, ${p.packaging.recycledContent}% recycled content` : '')
            }
            good={p.packaging.recyclable}
          />
          <Row
            icon={<Cloud size={17} />}
            title="Carbon Footprint"
            detail={
              p.carbon.kgCO2 != null
                ? `${p.carbon.kgCO2}kg CO₂ per unit${
                    p.carbon.categoryAvg != null ? ` (category avg ${p.carbon.categoryAvg}kg)` : ''
                  }`
                : 'Not available for this product'
            }
            good={p.carbon.kgCO2 == null ? null : p.carbon.kgCO2 <= (p.carbon.categoryAvg ?? Infinity)}
          />
          <Row
            icon={<MapPin size={17} />}
            title="Origin"
            detail={p.distance.km != null ? `${p.distance.origin}, ~${fmtNumber(p.distance.km)}km` : p.distance.origin}
            good={p.distance.km == null ? null : p.distance.km <= 500}
          />
          <Row
            icon={<Award size={17} />}
            title="Certifications"
            detail={p.certifications.length ? p.certifications.join(' · ') : 'None listed'}
            good={p.certifications.length ? certGood : null}
          />
          <Row
            icon={<Droplets size={17} />}
            title="Water Footprint"
            detail={
              p.waterFootprint.liters != null
                ? `${fmtNumber(p.waterFootprint.liters)}L per unit (category avg ${fmtNumber(
                    p.waterFootprint.categoryAvg
                  )}L)`
                : 'Estimated data unavailable'
            }
            good={p.waterFootprint.liters == null ? null : p.waterFootprint.liters <= p.waterFootprint.categoryAvg}
          />
        </div>
      </div>
    </div>
  )
}
