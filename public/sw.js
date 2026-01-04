const CACHE_NAME = 'skyjo-buddy-v1'
const RUNTIME_CACHE = 'skyjo-runtime-v1'

// Install event - activate immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker')
  event.waitUntil(self.skipWaiting())
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        console.log('[SW] Deleting old cache:', cacheToDelete)
        return caches.delete(cacheToDelete)
      }))
    }).then(() => self.clients.claim())
  )
})

// Fetch event - Cache-first with network fallback
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests and non-GET requests
  if (!event.request.url.startsWith(self.location.origin) || event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If we have a cached version, return it and update in background
        if (cachedResponse) {
          // Update cache in the background
          fetch(event.request)
            .then((response) => {
              if (response && response.status === 200) {
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(event.request, response)
                })
              }
            })
            .catch(() => {
              // Silently fail - we already have cached version
            })
          return cachedResponse
        }

        // Not in cache, fetch from network and cache it
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not a successful response
            if (!response || response.status !== 200) {
              return response
            }

            // Clone the response before caching
            const responseToCache = response.clone()

            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache)
            })

            return response
          })
          .catch(() => {
            // Network failed, try to return index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html')
            }
            throw new Error('Network failed and no cache available')
          })
      })
  )
})

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
