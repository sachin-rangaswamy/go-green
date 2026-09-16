// Minimal service worker for "Add to Home Screen" + offline shell caching.
const CACHE = 'gogreen-v1'
self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html'])))
})
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  )
  self.clients.claim()
})
self.addEventListener('fetch', (e) => {
  const { request } = e
  if (request.method !== 'GET') return
  // Never cache the Anthropic API calls
  if (request.url.includes('api.anthropic.com')) return
  e.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((res) => {
          if (res && res.status === 200 && request.url.startsWith(self.location.origin)) {
            const copy = res.clone()
            caches.open(CACHE).then((c) => c.put(request, copy))
          }
          return res
        })
        .catch(() => cached)
      return cached || network
    })
  )
})
