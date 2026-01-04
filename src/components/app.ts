import { store } from '../lib/store'
import { router } from '../lib/router'
import { i18n } from '../lib/i18n'
import { inlineIcon } from '../lib/icons'
import '../components/home-page'
import '../components/game-view'
import '../components/history-view'

export class SkyjoApp extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.render()
    store.subscribe(() => this.render())
    router.subscribe(() => this.render())
    i18n.subscribe(() => this.render())
  }

  render() {
    const route = router.getCurrentRoute()
    const currentGame = route.gameId ? store.getGameById(route.gameId) : undefined

    this.innerHTML = `
      <div class="app-header">
        <div class="app-logo">
          <h1 class="app-title">${inlineIcon('target')} ${i18n.t('app.title')}</h1>
          <p class="app-subtitle">${i18n.t('app.subtitle')}</p>
        </div>
      </div>

      <div class="container">
        ${route.view === 'game' ? `
          <div class="back-button">
            <button class="btn btn-secondary" onclick="router.navigate('home')">
              ${inlineIcon('arrowLeft')} ${i18n.t('game.backToHome')}
            </button>
          </div>
        ` : ''}
        ${route.view === 'history' && route.gameId ? `
          <div class="back-button">
            <button class="btn btn-secondary" onclick="router.navigate('game', '${route.gameId}')">
              ${inlineIcon('arrowLeft')} ${i18n.t('game.backToGame')}
            </button>
          </div>
        ` : ''}

        <div id="view-container"></div>
      </div>
    `

    const container = this.querySelector('#view-container')!

    if (route.view === 'home') {
      container.appendChild(document.createElement('home-page'))
    } else if (route.view === 'game' && currentGame) {
      const gameView = document.createElement('game-view') as any
      gameView.game = currentGame
      container.appendChild(gameView)
    } else if (route.view === 'history' && currentGame) {
      const historyView = document.createElement('history-view') as any
      historyView.game = currentGame
      container.appendChild(historyView)
    } else {
      // Game not found, redirect to home
      router.navigate('home')
    }
  }
}

customElements.define('skyjo-app', SkyjoApp)
