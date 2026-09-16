import { useState } from 'react'
import community from '../../data/community.json'

const TYPE_COLOR = {
  shop: '#4CAF50',
  market: '#FF9800',
  event: '#26A69A',
  group: '#94755C',
}

// Stylised illustrated map with tappable pins (no real map SDK needed).
export default function MapView() {
  const [active, setActive] = useState(null)

  return (
    <div>
      <div className="relative h-[380px] overflow-hidden rounded-3xl bg-[#dfe8d8] shadow-inner dark:bg-[#16281c]">
        {/* stylised streets / river */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <rect width="100" height="100" fill="#dfe8d8" />
          <path d="M0 60 Q30 50 55 65 T100 58" stroke="#9ec7e8" strokeWidth="6" fill="none" opacity="0.7" />
          <path d="M10 0 L12 100" stroke="#c8d3bf" strokeWidth="3" />
          <path d="M0 30 L100 26" stroke="#c8d3bf" strokeWidth="3" />
          <path d="M45 0 L50 100" stroke="#c8d3bf" strokeWidth="3" />
          <path d="M0 82 L100 80" stroke="#c8d3bf" strokeWidth="3" />
          <circle cx="30" cy="15" r="6" fill="#bcd6a6" opacity="0.7" />
          <circle cx="80" cy="35" r="8" fill="#bcd6a6" opacity="0.7" />
          <circle cx="65" cy="88" r="7" fill="#bcd6a6" opacity="0.7" />
        </svg>

        {community.mapPins.map((pin) => (
          <button
            key={pin.id}
            onClick={() => setActive(pin)}
            className="absolute -translate-x-1/2 -translate-y-full transition active:scale-90"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full rounded-bl-none text-base shadow-lg ring-2 ring-white"
              style={{ background: TYPE_COLOR[pin.type] }}
            >
              {pin.emoji}
            </span>
          </button>
        ))}

        {/* You are here */}
        <span
          className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#1565C0] shadow"
          style={{ left: '48%', top: '52%' }}
        />

        {active && (
          <div className="absolute inset-x-3 bottom-3 animate-fade-in rounded-2xl bg-white p-3 shadow-lg dark:bg-[#12281a]">
            <div className="flex items-center gap-2">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-xl text-lg"
                style={{ background: `${TYPE_COLOR[active.type]}22` }}
              >
                {active.emoji}
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold text-forest dark:text-paper">{active.label}</p>
                <p className="text-[11px] capitalize text-earth">{active.type} · 0.6km away</p>
              </div>
              <button onClick={() => setActive(null)} className="text-xs font-semibold text-accent">
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-3">
        {Object.entries(TYPE_COLOR).map(([type, color]) => (
          <span key={type} className="flex items-center gap-1.5 text-xs font-medium capitalize text-earth dark:text-paper/70">
            <span className="h-3 w-3 rounded-full" style={{ background: color }} /> {type}
          </span>
        ))}
      </div>
    </div>
  )
}
