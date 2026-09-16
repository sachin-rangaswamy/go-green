import { useState } from 'react'
import { X, Sparkles, PackagePlus, ListPlus, ArrowRight, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import ScoreDisplay from './ScoreDisplay.jsx'
import ScoreBreakdown from './ScoreBreakdown.jsx'

export default function ProductCard({ product, onClose }) {
  const { state, dispatch, addPoints } = useApp()
  const [expiryDays, setExpiryDays] = useState(7)
  const inPantry = state.pantry.some((p) => p.id === `scan-${product.id}`)
  const [added, setAdded] = useState(inPantry)
  const [listed, setListed] = useState(false)

  const showAlt =
    product.betterAlternative && ['B', 'C', 'D', 'E'].includes(product.ecoScore)

  const addToPantry = () => {
    if (added) return
    dispatch({
      type: 'ADD_TO_PANTRY',
      item: {
        id: `scan-${product.id}`,
        name: product.name,
        quantity: '1',
        location: 'fridge',
        initial: product.initial,
        color: product.color,
        addedDate: new Date().toISOString().slice(0, 10),
        expiryDate: '',
        daysUntilExpiry: expiryDays,
      },
    })
    setAdded(true)
    addPoints(3, 'Added to pantry')
  }

  const addToList = () => {
    if (listed) return
    dispatch({ type: 'ADD_TO_SHOPPING_LIST', name: product.name })
    setListed(true)
    addPoints(2, 'On your list')
  }

  return (
    <div className="animate-slide-up rounded-t-3xl bg-white p-4 shadow-2xl dark:bg-[#12281a]">
      <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-black/10 dark:bg-white/15" />
      <div className="mb-3 flex items-start gap-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-16 w-16 shrink-0 rounded-2xl bg-white object-contain shadow ring-1 ring-black/5"
          />
        ) : (
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-3xl font-black text-white shadow"
            style={{ background: product.color }}
          >
            {product.initial}
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-earth">{product.brand}</p>
          <h2 className="text-lg font-bold leading-tight text-forest dark:text-paper">{product.name}</h2>
          <p className="mt-0.5 text-xs text-earth">
            {product.category}
            {product.price != null && (
              <>
                {' · '}
                <span className="font-mono font-semibold">£{product.price.toFixed(2)}</span>
              </>
            )}
          </p>
        </div>
        <button onClick={onClose} className="rounded-full p-1 text-earth active:scale-90">
          <X size={20} />
        </button>
      </div>

      <ScoreDisplay product={product} />

      {showAlt && (
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-accent/12 p-3">
          <Sparkles className="shrink-0 text-forest dark:text-accent" size={20} />
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wide text-forest dark:text-accent">
              Better Alternative
            </p>
            <p className="text-sm font-semibold text-forest dark:text-paper">
              {product.betterAlternative.name}
            </p>
            <p className="text-xs text-earth dark:text-paper/70">{product.betterAlternative.reason}</p>
          </div>
          <ArrowRight size={18} className="text-forest dark:text-accent" />
        </div>
      )}

      <div className="mt-3">
        <ScoreBreakdown product={product} />
      </div>

      {!added && (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-paper/60 px-3 py-2 dark:bg-white/5">
          <span className="text-xs font-semibold text-earth">Expires in</span>
          <div className="flex gap-1.5">
            {[3, 7, 14].map((d) => (
              <button
                key={d}
                onClick={() => setExpiryDays(d)}
                className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                  expiryDays === d ? 'bg-forest text-white' : 'bg-white text-earth dark:bg-white/10 dark:text-paper'
                }`}
              >
                {d}d
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex gap-2">
        <button
          onClick={addToPantry}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-sm font-bold text-white transition active:scale-95 ${
            added ? 'bg-earth' : 'bg-forest'
          }`}
        >
          {added ? <Check size={16} /> : <PackagePlus size={16} />}
          {added ? 'In Pantry' : 'Add to Pantry'}
        </button>
        <button
          onClick={addToList}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-sm font-bold transition active:scale-95 ${
            listed ? 'bg-accent/20 text-forest' : 'bg-accent text-white'
          }`}
        >
          {listed ? <Check size={16} /> : <ListPlus size={16} />}
          {listed ? 'On List' : 'Shopping List'}
        </button>
      </div>
    </div>
  )
}
