import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function EventCard({ event }) {
  const { state, dispatch, addPoints } = useApp()
  const going = state.joinedEvents.includes(event.id)
  const count = event.attendees + (going ? 1 : 0)

  const toggle = () => {
    dispatch({ type: 'TOGGLE_EVENT', id: event.id })
    if (!going) addPoints(8, "You're going! 🌿")
  }

  return (
    <div className="flex gap-3 rounded-3xl bg-white p-3 shadow-sm dark:bg-white/5">
      <div className="flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-2xl bg-accent/12 text-center">
        <span className="text-2xl">{event.emoji}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold leading-tight text-forest dark:text-paper">{event.title}</h3>
        <div className="mt-1 space-y-0.5 text-[11px] text-earth">
          <p className="flex items-center gap-1">
            <Calendar size={11} /> {event.date} <Clock size={11} className="ml-1" /> {event.time}
          </p>
          <p className="flex items-center gap-1">
            <MapPin size={11} /> {event.location}
          </p>
          <p className="flex items-center gap-1">
            <Users size={11} /> {count}/{event.maxCapacity} going
          </p>
        </div>
        <button
          onClick={toggle}
          className={`mt-2 w-full rounded-full py-2 text-xs font-bold transition active:scale-95 ${
            going ? 'bg-accent text-white' : 'border-2 border-forest text-forest dark:border-accent dark:text-accent'
          }`}
        >
          {going ? (
            <span className="flex items-center justify-center gap-1">
              <Check size={13} /> Going
            </span>
          ) : (
            "I'm Going"
          )}
        </button>
      </div>
    </div>
  )
}
