import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import BottomNav from './components/layout/BottomNav.jsx'
import PointsToast from './components/shared/PointsToast.jsx'
import BadgeUnlock from './components/shared/BadgeUnlock.jsx'
import ErrorBoundary from './components/shared/ErrorBoundary.jsx'
import InstallPrompt from './components/shared/InstallPrompt.jsx'
import Onboarding from './components/onboarding/Onboarding.jsx'
import Dashboard from './components/home/Dashboard.jsx'
import ScanScreen from './components/scan/ScanScreen.jsx'

// Split the chart-heavy / secondary screens into their own chunks.
const PantryScreen = lazy(() => import('./components/pantry/PantryScreen.jsx'))
const ChallengesScreen = lazy(() => import('./components/challenges/ChallengesScreen.jsx'))
const CommunityScreen = lazy(() => import('./components/community/CommunityScreen.jsx'))
const ProfileScreen = lazy(() => import('./components/profile/ProfileScreen.jsx'))

function RouteFallback() {
  return (
    <div className="flex flex-1 items-center justify-center bg-paper dark:bg-[#0f1f14]">
      <Loader2 size={36} className="animate-spin text-accent" />
    </div>
  )
}

export default function App() {
  return (
    <div className="app-shell flex flex-col bg-paper text-[#1A1A1A] dark:bg-[#0f1f14] dark:text-paper">
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scan" element={<ScanScreen />} />
            <Route path="/pantry" element={<PantryScreen />} />
            <Route path="/challenges" element={<ChallengesScreen />} />
            <Route path="/community" element={<CommunityScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <BottomNav />
      <PointsToast />
      <BadgeUnlock />
      <InstallPrompt />
      <Onboarding />
    </div>
  )
}
