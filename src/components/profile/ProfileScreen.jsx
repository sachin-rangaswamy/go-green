import { Moon, Sun, Bell, Globe2, Leaf, Share2, RotateCcw, Trash2 } from 'lucide-react'
import Header from '../layout/Header.jsx'
import PageWrapper from '../layout/PageWrapper.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { fmtDate, fmtPoints } from '../../utils/formatters.js'
import { shareImpact } from '../../utils/shareCard.js'
import { haptic } from '../../utils/haptics.js'
import ImpactDashboard from './ImpactDashboard.jsx'
import LoyaltySection from './LoyaltySection.jsx'

function Chip({ children, active }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        active ? 'bg-forest text-white' : 'bg-paper/70 text-earth dark:bg-white/10 dark:text-paper/70'
      }`}
    >
      {children}
    </span>
  )
}

export default function ProfileScreen() {
  const { state, dispatch, pushToast, resetProgress } = useApp()
  const u = state.user
  const pct = Math.round((u.points / u.nextLevelPoints) * 100)

  const onShare = async () => {
    haptic('medium')
    const result = await shareImpact(u)
    if (result === 'downloaded') pushToast('Saved! 🖼️', 'Impact card downloaded')
  }

  return (
    <>
      <Header title="Profile" />
      <PageWrapper className="space-y-4">
        {/* User card */}
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-forest to-[#173a21] p-4 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
              {u.avatar}
            </span>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-black">{u.name}</h2>
              <p className="text-sm text-accent">
                {u.title} · Level {u.level}
              </p>
              <p className="text-[11px] text-paper/60">Member since {fmtDate(u.memberSince)}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[11px] font-semibold text-paper/80">
              <span>{fmtPoints(u.points)} 🌿</span>
              <span>Level {u.level + 1} at {fmtPoints(u.nextLevelPoints)}</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-black/25">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button
            onClick={onShare}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-white/15 py-3 text-sm font-bold text-white backdrop-blur active:scale-95"
          >
            <Share2 size={16} /> Share my impact
          </button>
        </div>

        <ImpactDashboard />
        <LoyaltySection />

        {/* Preferences */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
          <h3 className="flex items-center gap-1.5 font-bold text-forest dark:text-paper">
            <Leaf size={16} /> Preferences
          </h3>
          <p className="mt-2 text-xs font-semibold text-earth">Dietary</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free'].map((d) => (
              <Chip key={d} active={u.dietary.includes(d)}>
                {d}
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-earth">Preferred certifications</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {['Fairtrade', 'Organic', 'Rainforest Alliance', 'B Corp'].map((c) => (
              <Chip key={c} active={u.certPrefs.includes(c)}>
                {c}
              </Chip>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-earth">Allergens to avoid</p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {['Nuts', 'Dairy', 'Soy', 'Eggs'].map((a) => (
              <Chip key={a} active={u.allergens.includes(a)}>
                {a}
              </Chip>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
          <h3 className="mb-2 font-bold text-forest dark:text-paper">Settings</h3>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            className="flex w-full items-center justify-between py-2.5"
          >
            <span className="flex items-center gap-2 text-sm text-forest dark:text-paper">
              {state.darkMode ? <Moon size={17} /> : <Sun size={17} />} Dark mode
            </span>
            <span
              className={`relative h-6 w-11 rounded-full transition ${
                state.darkMode ? 'bg-accent' : 'bg-black/15'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                  state.darkMode ? 'left-[22px]' : 'left-0.5'
                }`}
              />
            </span>
          </button>
          <div className="flex items-center justify-between border-t border-black/5 py-2.5 dark:border-white/5">
            <span className="flex items-center gap-2 text-sm text-forest dark:text-paper">
              <Bell size={17} /> Notifications
            </span>
            <span className="text-xs font-semibold text-accent">On</span>
          </div>
          <div className="flex items-center justify-between border-t border-black/5 py-2.5 dark:border-white/5">
            <span className="flex items-center gap-2 text-sm text-forest dark:text-paper">
              <Globe2 size={17} /> Language
            </span>
            <span className="text-xs font-semibold text-earth">English (UK)</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'RESET_ONBOARDING' })}
            className="flex w-full items-center justify-between border-t border-black/5 py-2.5 dark:border-white/5"
          >
            <span className="flex items-center gap-2 text-sm text-forest dark:text-paper">
              <RotateCcw size={17} /> Replay onboarding
            </span>
          </button>
          <button
            onClick={resetProgress}
            className="flex w-full items-center justify-between border-t border-black/5 py-2.5 dark:border-white/5"
          >
            <span className="flex items-center gap-2 text-sm text-alert">
              <Trash2 size={17} /> Reset demo progress
            </span>
          </button>
        </div>

        <p className="pt-1 text-center text-[11px] text-earth/60">
          Go Green · Shop Smart. Waste Less. Live Green. 🌿
        </p>
      </PageWrapper>
    </>
  )
}
