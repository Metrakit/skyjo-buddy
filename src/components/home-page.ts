import { store } from '../lib/store'
import { router } from '../lib/router'
import { i18n } from '../lib/i18n'
import { icon, inlineIcon } from '../lib/icons'
import './modals/create-game-modal'
import './modals/settings-modal'

export class HomePage extends HTMLElement {
  connectedCallback() {
    const games = store.getGames()
    const locale = i18n.getLocale()

    this.innerHTML = `
      <div class="flex justify-between items-center mb-6">
        <h2 style="font-size: 1.5rem; font-weight: 600; color: var(--gray-900);">${i18n.t('home.title')}</h2>
        <button class="btn btn-secondary" id="settings-btn">
          ${inlineIcon('settings')} ${i18n.t('home.settings')}
        </button>
      </div>

      <button class="btn btn-primary btn-lg w-full mb-6" id="new-game-btn">
        ${inlineIcon('plus')} ${i18n.t('home.newGame')}
      </button>

      ${games.length === 0 ? `
        <div class="card">
          <div class="card-content empty-state">
            <div class="empty-state-icon">${icon('gamepad')}</div>
            <h3 class="empty-state-title">${i18n.t('home.noGames')}</h3>
            <p class="empty-state-description">${i18n.t('home.noGamesDescription')}</p>
          </div>
        </div>
      ` : `
        <div class="grid grid-cols-2">
          ${games.map(game => {
            const leader = [...game.players].sort((a, b) => a.totalScore - b.totalScore)[0]
            return `
              <div class="game-card ${game.isFinished ? 'finished' : ''}" data-game-id="${game.id}">
                <div class="game-card-header">
                  <div class="flex items-center justify-between mb-2">
                    <h3 style="font-size: 1.125rem; font-weight: 600; color: var(--gray-900);">${game.name}</h3>
                    ${game.isFinished ? `<span style="display: inline-block; width: 1.5rem; height: 1.5rem;">${icon('trophy')}</span>` : ''}
                  </div>
                  <p style="font-size: 0.8125rem; color: var(--gray-600);">
                    ${new Date(game.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div class="game-card-body">
                  <div class="game-meta">
                    <span class="game-meta-label">${inlineIcon('users')} ${i18n.t('home.players')}</span>
                    <span class="game-meta-value">${game.players.length}</span>
                  </div>
                  <div class="game-meta">
                    <span class="game-meta-label">${inlineIcon('dice')} ${i18n.t('home.rounds')}</span>
                    <span class="game-meta-value">${game.rounds.length}</span>
                  </div>
                  <div class="game-meta">
                    <span class="game-meta-label">${inlineIcon('target')} ${i18n.t('home.scoreLimit')}</span>
                    <span class="game-meta-value">${game.scoreLimit} pts</span>
                  </div>
                  ${game.rounds.length > 0 ? `
                    <div class="game-meta">
                      <span class="game-meta-label">${inlineIcon('crown')} ${i18n.t('home.leader')}</span>
                      <span class="game-meta-value">${leader.name} (${leader.totalScore})</span>
                    </div>
                  ` : ''}
                  ${game.isFinished ? `
                    <div style="margin-top: 1rem; padding: 0.75rem; background: var(--success-light); border-radius: 0.5rem; text-align: center;">
                      <p style="color: var(--success); font-weight: 600; font-size: 0.875rem;">✓ ${i18n.t('home.finished')}</p>
                    </div>
                  ` : ''}
                  <div style="margin-top: 1.25rem;">
                    <button class="btn btn-danger btn-sm w-full delete-game-btn" data-game-id="${game.id}">
                      ${inlineIcon('trash')} ${i18n.t('home.delete')}
                    </button>
                  </div>
                </div>
              </div>
            `
          }).join('')}
        </div>
      `}
    `

    // Event listeners
    this.querySelector('#new-game-btn')?.addEventListener('click', () => {
      document.body.appendChild(document.createElement('create-game-modal'))
    })

    this.querySelector('#settings-btn')?.addEventListener('click', () => {
      document.body.appendChild(document.createElement('settings-modal'))
    })

    this.querySelectorAll('.game-card[data-game-id]').forEach(card => {
      card.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('.delete-game-btn')) return
        const gameId = (card as HTMLElement).dataset.gameId!
        router.navigate('game', gameId)
      })
    })

    this.querySelectorAll('.delete-game-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation()
        const gameId = (btn as HTMLElement).dataset.gameId!
        if (confirm('Supprimer cette partie ?')) {
          store.deleteGame(gameId)
        }
      })
    })
  }
}

customElements.define('home-page', HomePage)
