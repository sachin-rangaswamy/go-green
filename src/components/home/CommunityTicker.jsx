const items = [
  '🌱 Sarah just saved 2.3kg of food waste!',
  '♻️ Ahmed hit a 40-day plastic-free streak',
  '🍳 Marco cooked a zero-waste stew',
  '🌍 The community saved 1,204kg CO₂ this week',
  '🚲 Tom cycled 12km for Green Commute',
]

// Infinite marquee of social-proof wins.
export default function CommunityTicker() {
  const loop = [...items, ...items]
  return (
    <div className="overflow-hidden rounded-full bg-accent/15 py-2">
      <div className="animate-marquee flex w-max gap-8 whitespace-nowrap">
        {loop.map((t, i) => (
          <span key={i} className="text-xs font-semibold text-forest dark:text-accent">
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}
