import Header from '../layout/Header.jsx'
import PageWrapper from '../layout/PageWrapper.jsx'
import { useApp } from '../../context/AppContext.jsx'
import ChallengeCard from './ChallengeCard.jsx'
import Leaderboard from './Leaderboard.jsx'
import BadgeGrid from './BadgeGrid.jsx'
import RewardsShop from './RewardsShop.jsx'

// Completing a challenge unlocks its themed badge (if still locked).
const CHALLENGE_BADGE = { c1: 'b3', c2: 'b7', c3: 'b5', c4: 'b5' }

export default function ChallengesScreen() {
  const { state, dispatch, addPoints, unlockBadge } = useApp()

  const advance = (challenge) => {
    if (challenge.progress >= challenge.target) return
    const willComplete = challenge.progress + 1 >= challenge.target
    dispatch({ type: 'ADVANCE_CHALLENGE', id: challenge.id })
    if (willComplete) {
      addPoints(challenge.reward, `${challenge.title} done!`)
      const badgeId = CHALLENGE_BADGE[challenge.id]
      const badge = state.badges.find((b) => b.id === badgeId && !b.unlocked)
      if (badge) setTimeout(() => unlockBadge(badge), 400)
    } else {
      addPoints(15, 'Progress logged')
    }
  }

  return (
    <>
      <Header title="Challenges" />
      <PageWrapper className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-display text-lg font-black text-forest dark:text-paper">Active Challenges</h2>
            <span className="text-xs text-earth">swipe →</span>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x-cards gap-3 overflow-x-auto px-4 pb-1">
            {state.challenges.map((c) => (
              <ChallengeCard key={c.id} challenge={c} onAdvance={advance} />
            ))}
          </div>
        </div>

        <Leaderboard />
        <BadgeGrid />
        <RewardsShop />

        <div className="rounded-3xl bg-white p-4 shadow-sm dark:bg-white/5">
          <h3 className="mb-2 font-bold text-forest dark:text-paper">Recently Completed</h3>
          <div className="flex flex-wrap gap-2">
            {state.completedChallenges.map((c) => (
              <span
                key={c.id}
                className="flex items-center gap-1.5 rounded-full bg-accent/12 px-3 py-1.5 text-xs font-semibold text-forest dark:text-accent"
              >
                {c.icon} {c.title} · +{c.reward}
              </span>
            ))}
          </div>
        </div>
      </PageWrapper>
    </>
  )
}
