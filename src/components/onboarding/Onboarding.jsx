import { useState } from 'react'
import { Leaf, ArrowRight, Check, ScanLine, Trophy, Users } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { haptic } from '../../utils/haptics.js'

const DIETARY = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free', 'No preference']
const STORES = ['Tesco', 'REWE', 'Lidl', 'Aldi', "Sainsbury's", 'Other']

export default function Onboarding() {
  const { state, dispatch } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [dietary, setDietary] = useState([])
  const [store, setStore] = useState(null)

  if (state.onboarded) return null

  const next = () => {
    haptic('light')
    setStep((s) => s + 1)
  }

  const finish = () => {
    haptic('celebrate')
    dispatch({
      type: 'COMPLETE_ONBOARDING',
      data: { name, dietary: dietary.filter((d) => d !== 'No preference'), homeStore: store },
    })
  }

  const toggleDiet = (d) => {
    haptic('light')
    setDietary((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]))
  }

  const steps = [
    // 0 — Welcome
    <div key="welcome" className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-accent shadow-lg animate-score-pop">
        <Leaf size={52} className="text-white" />
      </div>
      <h1 className="font-display text-4xl font-black text-white">Go Green</h1>
      <p className="mt-2 text-accent">Shop Smart. Waste Less. Live Green.</p>
      <div className="mt-8 space-y-3 text-left">
        {[
          { Icon: ScanLine, t: 'Scan for real Health + Eco scores' },
          { Icon: Trophy, t: 'Turn green choices into rewards' },
          { Icon: Users, t: 'Join a community of eco-doers' },
        ].map(({ Icon, t }) => (
          <div key={t} className="flex items-center gap-3 text-paper/90">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Icon size={18} className="text-accent" />
            </span>
            <span className="text-sm font-medium">{t}</span>
          </div>
        ))}
      </div>
    </div>,

    // 1 — Name
    <div key="name" className="flex flex-1 flex-col justify-center">
      <h2 className="font-display text-2xl font-black text-white">What should we call you?</h2>
      <p className="mt-1 text-sm text-paper/70">We'll personalise your dashboard.</p>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && name.trim() && next()}
        placeholder="Your name"
        className="mt-5 w-full rounded-2xl bg-white/10 px-4 py-4 text-lg text-white outline-none ring-2 ring-transparent placeholder:text-paper/40 focus:ring-accent"
      />
    </div>,

    // 2 — Dietary
    <div key="diet" className="flex flex-1 flex-col justify-center">
      <h2 className="font-display text-2xl font-black text-white">Any dietary preferences?</h2>
      <p className="mt-1 text-sm text-paper/70">Pick any that apply — we'll tailor suggestions.</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {DIETARY.map((d) => {
          const on = dietary.includes(d)
          return (
            <button
              key={d}
              onClick={() => toggleDiet(d)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-95 ${
                on ? 'bg-accent text-white' : 'bg-white/10 text-paper/80'
              }`}
            >
              {on && <Check size={14} />} {d}
            </button>
          )
        })}
      </div>
    </div>,

    // 3 — Store
    <div key="store" className="flex flex-1 flex-col justify-center">
      <h2 className="font-display text-2xl font-black text-white">Where do you usually shop?</h2>
      <p className="mt-1 text-sm text-paper/70">For loyalty rewards + nearby deals.</p>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {STORES.map((s) => (
          <button
            key={s}
            onClick={() => {
              haptic('light')
              setStore(s)
            }}
            className={`rounded-2xl px-4 py-4 text-sm font-bold transition active:scale-95 ${
              store === s ? 'bg-accent text-white' : 'bg-white/10 text-paper/80'
            }`}
          >
            🏪 {s}
          </button>
        ))}
      </div>
    </div>,
  ]

  const canProceed = [true, name.trim().length > 0, true, store != null][step]
  const isLast = step === steps.length - 1

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-gradient-to-b from-forest to-[#12281a] px-6 pb-8 pt-[max(2rem,env(safe-area-inset-top))]">
      {/* progress dots */}
      <div className="flex justify-center gap-2 pb-4">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === step ? 'w-6 bg-accent' : 'w-1.5 bg-white/25'}`}
          />
        ))}
      </div>

      {steps[step]}

      <div className="mt-6 flex items-center gap-3">
        {step > 0 && !isLast && (
          <button onClick={() => setStep((s) => s - 1)} className="px-4 py-3 text-sm font-semibold text-paper/60">
            Back
          </button>
        )}
        <button
          onClick={isLast ? finish : next}
          disabled={!canProceed}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full py-4 text-base font-bold transition active:scale-95 ${
            canProceed ? 'bg-accent text-white shadow-lg' : 'bg-white/10 text-paper/40'
          }`}
        >
          {isLast ? "Let's go!" : step === 0 ? 'Get started' : 'Continue'}
          {!isLast && <ArrowRight size={18} />}
        </button>
      </div>
      {step > 0 && !isLast && (
        <button
          onClick={next}
          className="mt-2 text-center text-xs font-medium text-paper/40"
        >
          Skip for now
        </button>
      )}
    </div>
  )
}
