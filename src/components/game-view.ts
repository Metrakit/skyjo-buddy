import type { Game } from '../types'
import { router } from '../lib/router'
import { i18n } from '../lib/i18n'
import { icon, inlineIcon } from '../lib/icons'
import './modals/add-round-modal'

export class GameView extends HTMLElement {
  game!: Game

  connectedCallback() {
    const sortedPlayers = [...this.game.players].sort((a, b) => a.totalScore - b.totalScore)
    const locale = i18n.getLocale()

    this.innerHTML = `
      <!-- Game Header -->
      <div class="card mb-6">
        <div class="card-header primary">
          <h2 class="card-title">${this.game.name}</h2>
          <p class="card-description">
            ${i18n.t('game.createdOn')} ${new Date(this.game.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div class="card-content">
          <!-- Stats Grid -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">${this.game.players.length}</div>
              <div class="stat-label">${i18n.t('game.players')}</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${this.game.rounds.length}</div>
              <div class="stat-label">${i18n.t('game.rounds')}</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${this.game.scoreLimit}</div>
              <div class="stat-label">${i18n.t('game.scoreLimit')}</div>
            </div>
            ${sortedPlayers.length > 0 ? `
              <div class="stat-card" style="background: var(--gold-light); border-color: var(--gold);">
                <div class="stat-value">${sortedPlayers[0].totalScore}</div>
                <div class="stat-label">${i18n.t('game.bestScore')}</div>
              </div>
            ` : ''}
          </div>

          <!-- Action Buttons -->
          <div class="action-row">
            ${!this.game.isFinished ? `
              <button class="btn btn-primary flex-1" id="add-round-btn">
                ${inlineIcon('plus')} ${i18n.t('game.finishRound')}
              </button>
            ` : ''}
            <button class="btn btn-secondary ${!this.game.isFinished ? 'flex-1' : 'w-full'}" id="history-btn">
              ${inlineIcon('scroll')} ${i18n.t('game.viewHistory')}
            </button>
          </div>
        </div>
      </div>

      ${this.game.isFinished ? `
        <div class="card mb-6">
          <div class="card-header success">
            <div class="text-center">
              <div style="font-size: 4rem; margin-bottom: 0.5rem;">${icon('trophy')}</div>
              <h3 class="card-title">${i18n.t('game.gameFinished')}</h3>
              <p class="card-description">${i18n.t('game.gameFinishedDescription', { limit: this.game.scoreLimit.toString() })}</p>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">${inlineIcon('trophy')} ${i18n.t('game.currentRanking')}</h3>
          <p class="card-description">${i18n.t('game.rankingDescription')}</p>
        </div>
        <div class="card-content">
          ${sortedPlayers.map((player, index) => `
            <div class="leaderboard-item rank-${index < 3 ? index + 1 : 'other'}">
              <div class="flex items-center gap-4">
                <div class="medal">
                  ${index === 0 ? icon('crown') : index === 1 ? icon('medal') : index === 2 ? icon('medal') : `#${index + 1}`}
                </div>
                <div class="flex-1">
                  <div class="font-bold" style="font-size: 1.25rem; color: var(--gray-900);">${player.name}</div>
                  <div style="font-size: 0.875rem; color: var(--gray-600);">
                    ${player.scores.length} ${i18n.plural(player.scores.length, 'game.round', 'game.rounds_plural')} ${i18n.plural(player.scores.length, 'game.played', 'game.played_plural')}
                  </div>
                </div>
              </div>
              <div style="text-align: right;">
                <div class="score-large">${player.totalScore}</div>
                <div class="score-label">${i18n.t('game.points')}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `

    this.querySelector('#add-round-btn')?.addEventListener('click', () => {
      const modal = document.createElement('add-round-modal') as any
      modal.game = this.game
      document.body.appendChild(modal)
    })

    this.querySelector('#history-btn')?.addEventListener('click', () => {
      router.navigate('history', this.game.id)
    })
  }
}

customElements.define('game-view', GameView)
