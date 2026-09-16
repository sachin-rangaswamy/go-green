import { scoreColor, scoreTextColor } from '../../utils/scoreColors.js'

// Compact A–E grade chip. size: 'sm' | 'md' | 'lg'
export default function ScoreBadge({ grade, size = 'md', animate = false }) {
  const sizes = {
    sm: 'w-7 h-7 text-sm rounded-lg',
    md: 'w-10 h-10 text-lg rounded-xl',
    lg: 'w-16 h-16 text-3xl rounded-2xl',
  }
  return (
    <span
      className={`inline-flex items-center justify-center font-display font-black shadow-sm ${sizes[size]} ${
        animate ? 'animate-score-pop' : ''
      }`}
      style={{ backgroundColor: scoreColor(grade), color: scoreTextColor(grade) }}
    >
      {grade}
    </span>
  )
}
