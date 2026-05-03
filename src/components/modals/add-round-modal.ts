import type { Game } from '../../types'
import { store } from '../../lib/store'
import { i18n } from '../../lib/i18n'
import { icon, inlineIcon } from '../../lib/icons'
import { getGameConfig } from '../../lib/game-configs'
import { celebrate } from '../../lib/confetti'

export class AddRoundModal extends HTMLElement {
  private scores: { [playerId: string]: number } = {}
  private flippedAll: { [playerId: string]: boolean } = {}
  private winnerId: string = ''
  private winnerScore: number | null = null
  game!: Game

  connectedCallback() {
    const config = getGameConfig(this.game.gameType)
    const singleWinner = config.scoringRules.singleWinnerPerRound === true

    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" id="close-modal">✕</button>
          <h2 class="modal-title">${i18n.t('modal.addRound.title', { round: (this.game.rounds.length + 1).toString() })}</h2>
          <p class="modal-description">${i18n.t(singleWinner ? 'modal.addRound.singleWinnerDescription' : 'modal.addRound.description')}</p>

          ${config.scoringRules.hasFlippedAllMechanic ? `
            <div class="mb-4">
              <label class="label">${i18n.t('modal.addRound.flippedAllLabel')}</label>
              <select id="flipped-all-select" class="input">
                <option value="" disabled selected>${i18n.t('modal.addRound.selectPlayer')}</option>
                ${this.game.players.map(player => `
                  <option value="${player.id}">${player.name}</option>
                `).join('')}
              </select>
            </div>
          ` : ''}

          ${config.scoringRules.expectedRoundTotal !== undefined ? `
            <div id="validation-warning" class="alert alert-warning mb-4 hidden" role="alert">
              <div class="alert-icon">${icon('alertTriangle')}</div>
              <div class="alert-content">
                <p class="alert-title">${i18n.t('modal.addRound.validationWarningTitle')}</p>
                <p class="alert-message" id="validation-message"></p>
              </div>
            </div>
          ` : ''}

          ${singleWinner ? this.renderSingleWinnerInputs() : this.renderPerPlayerInputs()}

          <button class="btn btn-primary w-full mt-4" id="submit-round-btn" disabled>
            ${inlineIcon('arrowRight')} ${i18n.t('modal.addRound.submitButton')}
          </button>
        </div>
      </div>
    `

    this.querySelector('#close-modal')!.addEventListener('click', () => this.remove())
    this.querySelector('.modal-overlay')!.addEventListener('click', (e) => {
      if (e.target === this.querySelector('.modal-overlay')) this.remove()
    })

    if (singleWinner) {
      this.attachSingleWinnerListeners()
    } else {
      this.attachPerPlayerListeners()
    }

    const flippedSelect = this.querySelector('#flipped-all-select') as HTMLSelectElement | null
    if (flippedSelect) {
      flippedSelect.addEventListener('change', () => {
        this.flippedAll = {}
        const playerId = flippedSelect.value
        if (playerId) {
          this.flippedAll[playerId] = true
        }
        this.updateSubmitButton()
      })
    }

    this.querySelector('#submit-round-btn')!.addEventListener('click', () => {
      const wasFinished = this.game.isFinished
      if (singleWinner) {
        const finalScores: { [playerId: string]: number } = {}
        this.game.players.forEach(p => {
          finalScores[p.id] = p.id === this.winnerId ? (this.winnerScore || 0) : 0
        })
        store.addRound(this.game.id, finalScores)
      } else {
        const hasAnyFlipped = Object.values(this.flippedAll).some(v => v)
        store.addRound(this.game.id, this.scores, hasAnyFlipped ? this.flippedAll : undefined)
      }
      this.remove()
      if (!wasFinished && store.getGameById(this.game.id)?.isFinished) {
        celebrate()
      }
    })
  }

  private renderPerPlayerInputs(): string {
    return `
      <div style="max-height: 400px; overflow-y: auto;">
        ${this.game.players.map((player, index) => `
          <div class="mb-4">
            <label class="label flex items-center gap-2">
              <div class="player-badge" style="width: 1.5rem; height: 1.5rem; font-size: 0.75rem;">
                ${index + 1}
              </div>
              ${player.name}
            </label>
            <input
              type="number"
              class="input score-input"
              data-player-id="${player.id}"
              placeholder="Score..."
            />
          </div>
        `).join('')}
      </div>
    `
  }

  private renderSingleWinnerInputs(): string {
    return `
      <div class="mb-4">
        <label class="label">${i18n.t('modal.addRound.winnerLabel')}</label>
        <select id="winner-select" class="input">
          <option value="" disabled selected>${i18n.t('modal.addRound.selectPlayer')}</option>
          ${this.game.players.map(player => `
            <option value="${player.id}">${player.name}</option>
          `).join('')}
        </select>
      </div>
      <div class="mb-4">
        <label class="label">${i18n.t('modal.addRound.winnerPointsLabel')}</label>
        <input
          type="number"
          class="input"
          id="winner-score-input"
          placeholder="${i18n.t('modal.addRound.winnerPointsPlaceholder')}"
          min="0"
        />
        <p class="text-sm mt-1" style="color: var(--gray-600);">
          ${i18n.t('modal.addRound.winnerPointsHint')}
        </p>
      </div>
    `
  }

  private attachPerPlayerListeners() {
    const inputs = this.querySelectorAll('.score-input') as NodeListOf<HTMLInputElement>
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const playerId = input.dataset.playerId!
        this.scores[playerId] = parseInt(input.value) || 0
        this.updateSubmitButton()
        this.validateRoundTotal()
      })
    })
  }

  private attachSingleWinnerListeners() {
    const winnerSelect = this.querySelector('#winner-select') as HTMLSelectElement
    const scoreInput = this.querySelector('#winner-score-input') as HTMLInputElement

    winnerSelect.addEventListener('change', () => {
      this.winnerId = winnerSelect.value
      this.updateSubmitButton()
    })

    scoreInput.addEventListener('input', () => {
      const parsed = parseInt(scoreInput.value)
      this.winnerScore = isNaN(parsed) ? null : parsed
      this.updateSubmitButton()
    })
  }

  validateRoundTotal() {
    const config = getGameConfig(this.game.gameType)

    if (config.scoringRules.expectedRoundTotal === undefined) {
      return
    }

    const warningDiv = this.querySelector('#validation-warning')
    const messageSpan = this.querySelector('#validation-message')

    if (!warningDiv || !messageSpan) return

    const allFilled = this.game.players.every(p =>
      this.scores[p.id] !== undefined && !isNaN(this.scores[p.id])
    )

    if (!allFilled) {
      warningDiv.classList.add('hidden')
      return
    }

    const total = Object.values(this.scores).reduce((sum, score) => sum + score, 0)
    const expected = config.scoringRules.expectedRoundTotal

    if (total !== expected) {
      warningDiv.classList.remove('hidden')
      messageSpan.textContent = i18n.t('modal.addRound.validationWarning', {
        total: total.toString(),
        expected: expected.toString()
      })
    } else {
      warningDiv.classList.add('hidden')
    }
  }

  updateSubmitButton() {
    const btn = this.querySelector('#submit-round-btn') as HTMLButtonElement
    const config = getGameConfig(this.game.gameType)

    if (config.scoringRules.singleWinnerPerRound) {
      btn.disabled = !this.winnerId || this.winnerScore === null || this.winnerScore < 0
      return
    }

    const allFilled = this.game.players.every(p =>
      this.scores[p.id] !== undefined && !isNaN(this.scores[p.id])
    )

    let playerSelected = true
    if (config.scoringRules.hasFlippedAllMechanic) {
      const flippedSelect = this.querySelector('#flipped-all-select') as HTMLSelectElement | null
      playerSelected = flippedSelect ? flippedSelect.value !== '' : true
    }

    btn.disabled = !allFilled || !playerSelected
  }
}

customElements.define('add-round-modal', AddRoundModal)
