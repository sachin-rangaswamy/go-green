import { ChefHat, Trash2 } from 'lucide-react'
import { expiryColor } from '../../utils/scoreColors.js'

export default function PantryItem({ item, onRecipe, onRemove }) {
  const c = expiryColor(item.daysUntilExpiry)
  const soon = item.daysUntilExpiry <= 3
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-white p-2.5 shadow-sm dark:bg-white/5 ${
        item.daysUntilExpiry <= 0 ? 'ring-2 ring-alert animate-pulse-red' : ''
      }`}
    >
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-lg font-black text-white"
        style={{ background: item.color }}
      >
        {item.initial}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-forest dark:text-paper">{item.name}</p>
        <p className="text-xs text-earth">{item.quantity}</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${c.bg} ${c.text}`}>{c.label}</span>
        <div className="flex gap-1">
          {soon && (
            <button
              onClick={() => onRecipe(item)}
              className="flex items-center gap-1 rounded-full bg-forest px-2 py-1 text-[11px] font-semibold text-white active:scale-95"
            >
              <ChefHat size={11} /> Recipe
            </button>
          )}
          <button
            onClick={() => onRemove(item.id)}
            className="rounded-full bg-paper p-1.5 text-earth active:scale-90 dark:bg-white/10"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
