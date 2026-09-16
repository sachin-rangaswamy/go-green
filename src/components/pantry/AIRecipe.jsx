import { useState } from 'react'
import { Sparkles, Clock, Users, Gauge, Bookmark, Share2, Leaf, Check, RefreshCw } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { useRecipe } from '../../hooks/useRecipe.js'

export default function AIRecipe({ expiringItems }) {
  const { dispatch, addPoints, pushToast } = useApp()
  const { recipe, loading, usedFallback, generate } = useRecipe()
  const [saved, setSaved] = useState(false)

  const cook = () => {
    setSaved(false)
    generate(expiringItems)
  }

  const save = () => {
    if (!recipe || saved) return
    dispatch({ type: 'SAVE_RECIPE', recipe })
    dispatch({ type: 'ADVANCE_CHALLENGE', id: 'c3' })
    setSaved(true)
    addPoints(10, 'Recipe saved')
  }

  const share = () => pushToast('Shared! 🌿', 'To community')

  return (
    <div className="rounded-3xl bg-gradient-to-br from-forest to-[#173a21] p-4 shadow-lg">
      <div className="flex items-center gap-2 text-white">
        <Sparkles size={18} className="text-accent" />
        <h3 className="font-display text-lg font-black">AI Recipe Chef</h3>
      </div>
      <p className="mt-0.5 text-xs text-paper/70">
        Turn {expiringItems.length} expiring item{expiringItems.length !== 1 ? 's' : ''} into dinner — zero waste.
      </p>

      {!recipe && !loading && (
        <button
          onClick={cook}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3.5 font-bold text-white shadow-md transition active:scale-95"
        >
          <Sparkles size={17} /> What can I cook tonight?
        </button>
      )}

      {loading && (
        <div className="mt-4 flex flex-col items-center gap-2 py-6">
          <div className="animate-bounce text-4xl">🧑‍🍳</div>
          <p className="animate-pulse font-semibold text-white">Cooking up ideas…</p>
          <p className="text-xs text-paper/60">Matching your expiring ingredients</p>
        </div>
      )}

      {recipe && !loading && (
        <div className="mt-3 animate-fade-in overflow-hidden rounded-2xl bg-white dark:bg-[#12281a]">
          <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-accent/30 via-warn/20 to-earth/30 text-6xl">
            🍽️
            <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-forest">
              {usedFallback ? 'Chef Suggestion' : '✨ AI Generated'}
            </span>
          </div>
          <div className="p-4">
            <h4 className="font-display text-xl font-black text-forest dark:text-paper">{recipe.name}</h4>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="flex items-center gap-1 rounded-full bg-paper px-2 py-1 font-semibold text-earth dark:bg-white/10 dark:text-paper">
                <Clock size={12} /> {recipe.time}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-paper px-2 py-1 font-semibold text-earth dark:bg-white/10 dark:text-paper">
                <Users size={12} /> {recipe.servings} servings
              </span>
              <span className="flex items-center gap-1 rounded-full bg-paper px-2 py-1 font-semibold text-earth dark:bg-white/10 dark:text-paper">
                <Gauge size={12} /> {recipe.difficulty}
              </span>
            </div>

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-earth">Ingredients</p>
            <ul className="mt-1 space-y-1">
              {recipe.ingredients.map((ing, i) => (
                <li
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-2 py-1 text-sm ${
                    ing.fromPantry ? 'bg-accent/12 font-semibold text-forest dark:text-accent' : 'text-earth dark:text-paper/80'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {ing.fromPantry && <Leaf size={12} className="text-accent" />}
                    {ing.item}
                  </span>
                  <span className="font-mono text-xs">{ing.amount}</span>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-xs font-bold uppercase tracking-wide text-earth">Method</p>
            <ol className="mt-1 space-y-2">
              {recipe.steps.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-forest dark:text-paper">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-forest text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            <div className="mt-3 flex items-start gap-2 rounded-xl bg-accent/12 p-2.5">
              <Leaf size={15} className="mt-0.5 shrink-0 text-forest dark:text-accent" />
              <p className="text-xs text-forest dark:text-paper">{recipe.sustainabilityTip}</p>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={save}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2.5 text-sm font-bold transition active:scale-95 ${
                  saved ? 'bg-earth text-white' : 'bg-forest text-white'
                }`}
              >
                {saved ? <Check size={15} /> : <Bookmark size={15} />} {saved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={share}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-accent py-2.5 text-sm font-bold text-white transition active:scale-95"
              >
                <Share2 size={15} /> Share
              </button>
              <button
                onClick={cook}
                className="flex items-center justify-center rounded-full bg-paper px-3 text-earth transition active:scale-95 dark:bg-white/10 dark:text-paper"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
