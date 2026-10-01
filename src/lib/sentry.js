import * as Sentry from '@sentry/react'

// Initialises Sentry only when a DSN is configured, so local/dev and
// un-configured deploys run cleanly with zero error-tracking overhead.
export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) return
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    integrations: [Sentry.browserTracingIntegration()],
    // Sample a fraction of transactions for performance monitoring.
    tracesSampleRate: 0.1,
    // Don't send default PII — this is an EU app (GDPR).
    sendDefaultPii: false,
  })
}

export { Sentry }
