import { Users, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function GroupCard({ group }) {
  const { state, dispatch, addPoints } = useApp()
  const joined = state.joinedGroups.includes(group.id)

  const toggle = () => {
    dispatch({ type: 'TOGGLE_GROUP', id: group.id })
    if (!joined) addPoints(5, `Joined ${group.name}`)
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm dark:bg-white/5">
      <div
        className="flex h-20 items-center justify-center text-4xl"
        style={{ background: `linear-gradient(135deg, ${group.gradient[0]}, ${group.gradient[1]})` }}
      >
        {group.coverEmoji}
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-forest dark:text-paper">{group.name}</h3>
            <p className="flex items-center gap-1 text-[11px] text-earth">
              <Users size={11} /> {group.memberCount.toLocaleString('en-GB')} members
            </p>
          </div>
          <button
            onClick={toggle}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 ${
              joined ? 'bg-accent/15 text-forest dark:text-accent' : 'bg-forest text-white'
            }`}
          >
            {joined ? (
              <span className="flex items-center gap-1">
                <Check size={13} /> Joined
              </span>
            ) : (
              'Join'
            )}
          </button>
        </div>
        <p className="mt-1 text-xs text-earth dark:text-paper/60">{group.description}</p>
        <div className="mt-2 space-y-1">
          {group.latestPosts.map((p, i) => (
            <p key={i} className="truncate rounded-lg bg-paper/60 px-2 py-1 text-[11px] text-earth dark:bg-white/5 dark:text-paper/70">
              💬 {p}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
