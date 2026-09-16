import { useNavigate } from 'react-router-dom'
import { ScanLine, Refrigerator, Trophy, MapPin } from 'lucide-react'

const actions = [
  { label: 'Scan', Icon: ScanLine, to: '/scan', bg: 'bg-accent' },
  { label: 'Pantry', Icon: Refrigerator, to: '/pantry', bg: 'bg-earth' },
  { label: 'Challenge', Icon: Trophy, to: '/challenges', bg: 'bg-[#FF9800]' },
  { label: 'Deals', Icon: MapPin, to: '/community', bg: 'bg-[#26A69A]' },
]

export default function QuickActions() {
  const navigate = useNavigate()
  return (
    <div className="grid grid-cols-4 gap-2">
      {actions.map(({ label, Icon, to, bg }) => (
        <button
          key={label}
          onClick={() => navigate(to)}
          className="flex flex-col items-center gap-1.5 rounded-2xl bg-white p-2.5 shadow-sm transition active:scale-95 dark:bg-white/5"
        >
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg} text-white shadow-sm`}>
            <Icon size={20} />
          </span>
          <span className="text-[11px] font-semibold text-forest dark:text-paper">{label}</span>
        </button>
      ))}
    </div>
  )
}
