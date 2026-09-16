import { useNavigate } from 'react-router-dom'
import { ChevronRight, Clock } from 'lucide-react'
import Header from '../layout/Header.jsx'
import PageWrapper from '../layout/PageWrapper.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { greeting } from '../../utils/formatters.js'
import ImpactCard from './ImpactCard.jsx'
import QuickActions from './QuickActions.jsx'
import ExpiryAlert from './ExpiryAlert.jsx'
import CommunityTicker from './CommunityTicker.jsx'

const deals = [
  { id: 'd1', store: 'REWE City', emoji: '🛍️', label: 'Surprise Bakery Bag', was: 8.5, now: 2.99, left: 3, tag: '−65%' },
  { id: 'd2', store: 'Alnatura', emoji: '🥗', label: 'Fresh Veg Rescue Box', was: 12.0, now: 4.5, left: 5, tag: '−62%' },
  { id: 'd3', store: 'Backwerk', emoji: '🥐', label: 'End-of-Day Pastries', was: 6.0, now: 1.99, left: 2, tag: '−67%' },
]

function WeeklyChallengeBanner() {
  const { state } = useApp()
  const navigate = useNavigate()
  const c = state.challenges[0]
  const pct = Math.round((c.progress / c.target) * 100)
  return (
    <button
      onClick={() => navigate('/challenges')}
      className="w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF9800] to-[#F57C00] p-4 text-left shadow-md active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-white/80">Weekly Challenge</p>
          <p className="font-display text-lg font-black text-white">
            {c.icon} {c.title}
          </p>
        </div>
        <ChevronRight className="text-white/80" />
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-black/20">
        <div className="h-full rounded-full bg-white transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs font-semibold text-white">
        {c.progress}/{c.target} {c.unit} complete
      </p>
    </button>
  )
}

function NearbyDeals() {
  const navigate = useNavigate()
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="font-bold text-forest dark:text-paper">Nearby Surplus Deals</h3>
        <button onClick={() => navigate('/community')} className="text-xs font-semibold text-accent">
          Map →
        </button>
      </div>
      <div className="no-scrollbar -mx-4 flex snap-x-cards gap-3 overflow-x-auto px-4">
        {deals.map((d) => (
          <div
            key={d.id}
            className="snap-card w-44 shrink-0 rounded-2xl bg-white p-3 shadow-sm dark:bg-white/5"
          >
            <div className="mb-2 flex h-20 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-earth/20 text-4xl">
              {d.emoji}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-earth">{d.store}</p>
              <span className="rounded-full bg-alert px-1.5 py-0.5 text-[10px] font-bold text-white">{d.tag}</span>
            </div>
            <p className="truncate text-sm font-bold text-forest dark:text-paper">{d.label}</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-forest dark:text-accent">£{d.now}</span>
              <span className="text-xs text-earth/60 line-through">£{d.was}</span>
            </div>
            <p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-alert">
              <Clock size={11} /> {d.left} bags left
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { state } = useApp()
  return (
    <>
      <Header />
      <PageWrapper className="space-y-4">
        <div>
          <h1 className="font-display text-2xl font-black text-forest dark:text-paper">
            {greeting()}, {state.user.name} 🌿
          </h1>
          <p className="text-sm text-earth dark:text-paper/60">
            You're on a {state.user.streak}-day green streak. Keep it going!
          </p>
        </div>
        <ImpactCard />
        <QuickActions />
        <ExpiryAlert />
        <WeeklyChallengeBanner />
        <CommunityTicker />
        <NearbyDeals />
      </PageWrapper>
    </>
  )
}
