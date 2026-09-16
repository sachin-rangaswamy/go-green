import { NavLink } from 'react-router-dom'
import { Home, ScanLine, Trophy, Users, User } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', Icon: Home, end: true },
  { to: '/scan', label: 'Scan', Icon: ScanLine },
  { to: '/challenges', label: 'Play', Icon: Trophy },
  { to: '/community', label: 'Community', Icon: Users },
  { to: '/profile', label: 'Profile', Icon: User },
]

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-50 border-t border-black/5 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg dark:border-white/10 dark:bg-[#12281a]/95">
      <div className="mx-auto flex max-w-[430px] items-stretch justify-around px-1">
        {tabs.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="group relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-9 w-full max-w-[64px] items-center justify-center rounded-full transition-all ${
                    isActive ? 'bg-accent/15 text-forest dark:text-accent' : 'text-earth/70 dark:text-paper/50'
                  }`}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.6 : 2} />
                </span>
                <span
                  className={`text-[10px] font-semibold transition-colors ${
                    isActive ? 'text-forest dark:text-accent' : 'text-earth/60 dark:text-paper/40'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
