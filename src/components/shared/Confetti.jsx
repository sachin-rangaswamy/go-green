const COLORS = ['#4CAF50', '#1B5E20', '#FFC107', '#FF9800', '#8BE28E', '#BE9F87']

// Pure-CSS confetti burst. Renders ~40 falling pieces.
export default function Confetti({ count = 44 }) {
  const pieces = Array.from({ length: count })
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.6
        const dur = 2 + Math.random() * 1.2
        const size = 6 + Math.random() * 8
        const color = COLORS[i % COLORS.length]
        const round = i % 3 === 0
        return (
          <span
            key={i}
            className="absolute animate-confetti-fall"
            style={{
              left: `${left}%`,
              top: '-5%',
              width: size,
              height: round ? size : size * 0.5,
              background: color,
              borderRadius: round ? '9999px' : '2px',
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          />
        )
      })}
    </div>
  )
}
