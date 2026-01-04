import type { Game } from '../types'
import { i18n } from '../lib/i18n'
import { icon, inlineIcon } from '../lib/icons'

export class HistoryView extends HTMLElement {
  game!: Game

  connectedCallback() {
    const locale = i18n.getLocale()

    this.innerHTML = `
      <div class="card mb-6">
        <div class="card-header primary">
          <h2 class="card-title">${inlineIcon('scroll')} ${i18n.t('history.title')}</h2>
          <p class="card-description">${i18n.t('history.description', { gameName: this.game.name })}</p>
        </div>
      </div>

      ${this.game.rounds.length === 0 ? `
        <div class="card">
          <div class="card-content empty-state">
            <div class="empty-state-icon">${icon('clipboard')}</div>
            <h3 class="empty-state-title">${i18n.t('history.noRounds')}</h3>
            <p class="empty-state-description">${i18n.t('history.noRoundsDescription')}</p>
          </div>
        </div>
      ` : `
        ${this.game.rounds.map((round, roundIndex) => {
          // Calculate cumulative scores up to this round for ranking
          const playersWithCumulativeScores = this.game.players.map(player => {
            const scoresUpToNow = player.scores.slice(0, roundIndex + 1)
            const cumulativeScore = scoresUpToNow.reduce((sum, s) => sum + s, 0)

            return {
              ...player,
              roundScore: round.scores[player.id] || 0,
              cumulativeScore
            }
          }).sort((a, b) => a.cumulativeScore - b.cumulativeScore)

          return `
            <div class="card mb-4">
              <div class="card-header">
                <div class="flex justify-between items-center">
                  <div>
                    <h3 class="card-title">${i18n.t('history.round')} ${roundIndex + 1}</h3>
                    <p class="card-description" style="margin-top: 0.25rem;">
                      ${new Date(round.timestamp).toLocaleDateString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div style="text-align: right;">
                    <div style="font-size: 0.75rem; font-weight: 600; color: var(--gray-600); text-transform: uppercase; letter-spacing: 0.05em;">
                      ${i18n.t('history.leader')}
                    </div>
                    <div style="font-size: 1rem; font-weight: 700; color: var(--gray-900); margin-top: 0.125rem;">
                      ${playersWithCumulativeScores[0].name}
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-content">
                ${playersWithCumulativeScores.map((player, index) => {
                  const score = player.roundScore
                  const scoreColor = score < 0 ? 'var(--success)' : score > 0 ? 'var(--error)' : 'var(--gray-600)'

                  return `
                    <div class="leaderboard-item rank-${index < 3 ? index + 1 : 'other'}">
                      <div class="flex items-center gap-4">
                        <div class="medal">
                          ${index === 0 ? icon('medal') : index === 1 ? icon('medal') : index === 2 ? icon('medal') : `#${index + 1}`}
                        </div>
                        <div class="flex-1">
                          <div class="font-bold" style="font-size: 1.125rem; color: var(--gray-900);">
                            ${player.name}
                          </div>
                          <div style="font-size: 0.875rem; color: var(--gray-600); margin-top: 0.125rem;">
                            ${i18n.t('history.total')}: <span class="font-semibold">${player.cumulativeScore} pts</span>
                          </div>
                        </div>
                      </div>
                      <div style="text-align: right;">
                        <div style="font-size: 1.875rem; font-weight: 800; color: ${scoreColor}; line-height: 1;">
                          ${score > 0 ? '+' : ''}${score}
                        </div>
                        <div class="score-label" style="margin-top: 0.375rem;">
                          ${i18n.t('history.thisRound')}
                        </div>
                      </div>
                    </div>
                  `
                }).join('')}
              </div>
            </div>
          `
        }).reverse().join('')}
      `}
    `
  }
}

customElements.define('history-view', HistoryView)
