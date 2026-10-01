import { Component } from 'react'
import { Sentry } from '../../lib/sentry.js'

// Catches render crashes so a single bad screen never white-screens the app.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Go Green caught an error:', error, info)
    // No-op unless Sentry was initialised with a DSN.
    Sentry.captureException(error, { extra: { componentStack: info?.componentStack } })
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3 px-8 text-center">
          <div className="text-5xl">🌥️</div>
          <h2 className="font-display text-xl font-black text-forest dark:text-paper">Something went wrong</h2>
          <p className="max-w-xs text-sm text-earth dark:text-paper/60">
            An unexpected error occurred. Reloading usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-white active:scale-95"
          >
            Reload app
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
