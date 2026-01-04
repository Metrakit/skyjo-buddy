import type { Game } from '../../types'
import { store } from '../../lib/store'
import { i18n } from '../../lib/i18n'
import { inlineIcon } from '../../lib/icons'

export class AddRoundModal extends HTMLElement {
  private scores: { [playerId: string]: number } = {}
  game!: Game

  connectedCallback() {
    this.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <button class="modal-close" id="close-modal">✕</button>
          <h2 class="modal-title">${i18n.t('modal.addRound.title', { round: (this.game.rounds.length + 1).toString() })}</h2>
          <p class="modal-description">${i18n.t('modal.addRound.description')}</p>

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

    const inputs = this.querySelectorAll('.score-input') as NodeListOf<HTMLInputElement>
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const playerId = input.dataset.playerId!
        this.scores[playerId] = parseInt(input.value) || 0
        this.updateSubmitButton()
      })
    })

    this.querySelector('#submit-round-btn')!.addEventListener('click', () => {
      store.addRound(this.game.id, this.scores)
      this.remove()
    })
  }

  updateSubmitButton() {
    const btn = this.querySelector('#submit-round-btn') as HTMLButtonElement
    const allFilled = this.game.players.every(p =>
      this.scores[p.id] !== undefined && !isNaN(this.scores[p.id])
    )
    btn.disabled = !allFilled
  }
}

customElements.define('add-round-modal', AddRoundModal)
