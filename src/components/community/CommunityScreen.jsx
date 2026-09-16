import { useState, useRef, useEffect } from 'react'
import Header from '../layout/Header.jsx'
import PageWrapper from '../layout/PageWrapper.jsx'
import community from '../../data/community.json'
import FeedPost from './FeedPost.jsx'
import GroupCard from './GroupCard.jsx'
import EventCard from './EventCard.jsx'
import MapView from './MapView.jsx'
import { FeedPostSkeleton } from '../shared/Skeleton.jsx'

const tabs = [
  { key: 'feed', label: 'Feed' },
  { key: 'groups', label: 'Groups' },
  { key: 'events', label: 'Green Dates' },
  { key: 'map', label: 'Map' },
]

function PullToRefreshFeed() {
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pull, setPull] = useState(0)
  const startY = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [])

  const onStart = (e) => {
    if (e.currentTarget.scrollTop <= 0) startY.current = e.touches[0].clientY
  }
  const onMove = (e) => {
    if (startY.current === null) return
    const d = e.touches[0].clientY - startY.current
    if (d > 0) setPull(Math.min(80, d))
  }
  const onEnd = () => {
    if (pull > 55) {
      setRefreshing(true)
      setTimeout(() => setRefreshing(false), 900)
    }
    setPull(0)
    startY.current = null
  }

  return (
    <div onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}>
      <div
        className="flex items-center justify-center overflow-hidden text-xs font-semibold text-earth transition-all"
        style={{ height: refreshing ? 32 : pull }}
      >
        {refreshing ? '🔄 Refreshing…' : pull > 55 ? '↑ Release to refresh' : pull > 0 ? '↓ Pull to refresh' : ''}
      </div>
      <div className="space-y-4">
        {loading
          ? [0, 1].map((i) => <FeedPostSkeleton key={i} />)
          : community.posts.map((p) => <FeedPost key={p.id} post={p} />)}
      </div>
    </div>
  )
}

export default function CommunityScreen() {
  const [tab, setTab] = useState('feed')

  return (
    <>
      <Header title="Community" />
      <PageWrapper className="space-y-4">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.key
                  ? 'bg-forest text-white shadow'
                  : 'bg-white text-earth dark:bg-white/5 dark:text-paper/70'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'feed' && <PullToRefreshFeed />}

        {tab === 'groups' && (
          <div className="space-y-3">
            {community.groups.map((g) => (
              <GroupCard key={g.id} group={g} />
            ))}
          </div>
        )}

        {tab === 'events' && (
          <div className="space-y-3">
            <div className="rounded-2xl bg-accent/12 px-3 py-2 text-xs font-medium text-forest dark:text-accent">
              🌿 <span className="font-bold">Green Dates</span> — meet like-minded eco folks at local meetups.
            </div>
            {community.events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}

        {tab === 'map' && <MapView />}
      </PageWrapper>
    </>
  )
}
