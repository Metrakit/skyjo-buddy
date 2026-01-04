import { store } from './lib/store'
import { router } from './lib/router'
import './components/app'

// Make router and store global for onclick handlers
declare global {
  interface Window {
    router: typeof router
    store: typeof store
  }
}

window.router = router
window.store = store

// Initialize app
const app = document.querySelector('#app')!
app.appendChild(document.createElement('skyjo-app'))

// Register service worker for PWA support (production only)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope)

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error)
      })
  })
}
