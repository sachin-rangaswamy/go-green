import { useState, useRef } from 'react'
import { Refrigerator, Archive, Snowflake, LayoutGrid, Plus, Check, ShoppingCart } from 'lucide-react'
import Header from '../layout/Header.jsx'
import PageWrapper from '../layout/PageWrapper.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import PantryItem from './PantryItem.jsx'
import AIRecipe from './AIRecipe.jsx'
import WasteChart from './WasteChart.jsx'
import EmptyState from '../shared/EmptyState.jsx'

const filters = [
  { key: 'all', label: 'All', Icon: LayoutGrid },
  { key: 'fridge', label: 'Fridge', Icon: Refrigerator },
  { key: 'cupboard', label: 'Cupboard', Icon: Archive },
  { key: 'freezer', label: 'Freezer', Icon: Snowflake },
]

function ShoppingList() {
  const { state, dispatch } = useApp()
  const [text, setText] = useState('')
  const add = () => {
    if (!text.trim()) return
    dispatch({ type: 'ADD_TO_SHOPPING_LIST', name: text.trim() })
    setText('')
  }
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
      <h3 className="mb-2 flex items-center gap-1.5 font-bold text-forest dark:text-paper">
        <ShoppingCart size={16} /> Smart Shopping List
      </h3>
      <div className="mb-2 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && add()}
          placeholder="Add an item…"
          className="flex-1 rounded-full bg-paper px-4 py-2 text-sm outline-none placeholder:text-earth/50 dark:bg-white/10 dark:text-paper"
        />
        <button onClick={add} className="rounded-full bg-forest px-3 text-white active:scale-95">
          <Plus size={18} />
        </button>
      </div>
      <ul className="space-y-1">
        {state.shoppingList.map((s) => (
          <li key={s.id}>
            <button
              onClick={() => dispatch({ type: 'TOGGLE_SHOPPING_ITEM', id: s.id })}
              className="flex w-full items-center gap-2 rounded-xl px-2 py-1.5 text-left active:bg-paper dark:active:bg-white/5"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  s.done ? 'border-accent bg-accent text-white' : 'border-earth/40'
                }`}
              >
                {s.done && <Check size={12} />}
              </span>
              <span
                className={`text-sm ${
                  s.done ? 'text-earth/50 line-through' : 'text-forest dark:text-paper'
                }`}
              >
                {s.name}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PantryScreen() {
  const { state, dispatch } = useApp()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const recipeRef = useRef(null)

  const items = state.pantry
    .filter((p) => filter === 'all' || p.location === filter)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

  const expiringItems = state.pantry
    .filter((p) => p.daysUntilExpiry <= 3)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry)

  const scrollToRecipe = () => {
    recipeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <Header title="Pantry" />
      <PageWrapper className="space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {filters.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 text-xs font-semibold transition ${
                filter === key
                  ? 'bg-forest text-white shadow'
                  : 'bg-white text-earth dark:bg-white/5 dark:text-paper/70'
              }`}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>

        {expiringItems.length > 0 && (
          <div className="rounded-2xl bg-alert/10 px-3 py-2 text-xs font-semibold text-alert">
            ⚠️ {expiringItems.length} item{expiringItems.length !== 1 ? 's' : ''} expiring within 3 days — cook them
            before they're wasted!
          </div>
        )}

        <div className="space-y-2">
          {items.map((item) => (
            <PantryItem
              key={item.id}
              item={item}
              onRecipe={scrollToRecipe}
              onRemove={(id) => dispatch({ type: 'REMOVE_FROM_PANTRY', id })}
            />
          ))}
          {!items.length && (
            <EmptyState
              emoji="🧺"
              title={filter === 'all' ? 'Your pantry is empty' : `Nothing in your ${filter}`}
              subtitle="Scan a product and tap “Add to Pantry” to start tracking expiry dates and cutting waste."
              actionLabel="Scan a product"
              onAction={() => navigate('/scan')}
            />
          )}
        </div>

        {state.pantry.length > 0 && (
          <div ref={recipeRef}>
            <AIRecipe expiringItems={expiringItems.length ? expiringItems : state.pantry.slice(0, 3)} />
          </div>
        )}

        <WasteChart />
        <ShoppingList />
      </PageWrapper>
    </>
  )
}
