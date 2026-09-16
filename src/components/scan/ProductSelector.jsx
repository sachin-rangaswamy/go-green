import products from '../../data/products.json'
import ScoreBadge from '../shared/ScoreBadge.jsx'

// Stand-in for a live camera: pick a product to "scan".
export default function ProductSelector({ onPick, onClose }) {
  return (
    <div className="animate-slide-up max-h-[75vh] overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl dark:bg-[#12281a]">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-black/10 dark:bg-white/15" />
      <div className="mb-1 flex items-center justify-between">
        <h2 className="font-bold text-forest dark:text-paper">Pick a product to scan</h2>
        <button onClick={onClose} className="text-xs font-semibold text-accent">
          Cancel
        </button>
      </div>
      <p className="mb-3 text-xs text-earth">Demo mode — tap any item as if you scanned its barcode.</p>
      <div className="space-y-2">
        {products.map((p) => (
          <button
            key={p.id}
            onClick={() => onPick(p)}
            className="flex w-full items-center gap-3 rounded-2xl bg-paper/70 p-2.5 text-left transition active:scale-[0.98] dark:bg-white/5"
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-xl font-black text-white"
              style={{ background: p.color }}
            >
              {p.initial}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-forest dark:text-paper">{p.name}</p>
              <p className="text-xs text-earth">{p.brand}</p>
            </div>
            <div className="flex gap-1">
              <ScoreBadge grade={p.healthScore} size="sm" />
              <ScoreBadge grade={p.ecoScore} size="sm" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
