export type View = 'home' | 'game' | 'history'

export interface Route {
  view: View
  gameId?: string
}

export class Router {
  private listeners: Set<() => void> = new Set()

  constructor() {
    // Listen to browser back/forward buttons
    window.addEventListener('popstate', () => {
      this.notify()
    })
  }

  navigate(view: View, gameId?: string) {
    let path = '/'

    if (view === 'game' && gameId) {
      path = `/game/${gameId}`
    } else if (view === 'history' && gameId) {
      path = `/game/${gameId}/history`
    }

    // Update URL without page reload
    window.history.pushState({ view, gameId }, '', path)
    this.notify()
  }

  getCurrentRoute(): Route {
    const path = window.location.pathname

    // Match /game/:id/history
    const historyMatch = path.match(/^\/game\/([^/]+)\/history$/)
    if (historyMatch) {
      return { view: 'history', gameId: historyMatch[1] }
    }

    // Match /game/:id
    const gameMatch = path.match(/^\/game\/([^/]+)$/)
    if (gameMatch) {
      return { view: 'game', gameId: gameMatch[1] }
    }

    // Default to home
    return { view: 'home' }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify() {
    this.listeners.forEach(listener => listener())
  }
}

export const router = new Router()
