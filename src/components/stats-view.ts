import { store } from '../lib/store'
import { i18n } from '../lib/i18n'
import { icon, inlineIcon } from '../lib/icons'
import { getGameConfig } from '../lib/game-configs'
import {
  computePlayerStats,
  filterGamesByPeriod,
  type PlayerStats,
  type StatsPeriod
} from '../lib/stats'
import { horizontalBarChart, donutChart, GAME_TYPE_COLORS } from '../lib/charts'
import type { Game, GameType } from '../types'

const PERIOD_OPTIONS: { value: StatsPeriod; labelKey: string }[] = [
  { value: '7d', labelKey: 'stats.period7d' },
  { value: '30d', labelKey: 'stats.period30d' },
  { value: '3m', labelKey: 'stats.period3m' },
  { value: 'all', labelKey: 'stats.periodAll' }
]

export class StatsView extends HTMLElement {
  private period: StatsPeriod = '7d'

  connectedCallback() {
    this.render()
  }

  private render() {
    const allGames = store.getGames()
    const games = filterGamesByPeriod(allGames, this.period)
    const stats = computePlayerStats(games)
    const finishedCount = games.filter(g => g.isFinished).length
    const totalWins = stats.reduce((sum, s) => sum + s.wins, 0)

    this.innerHTML = `
      <div class="mb-6">
        <h2 style="font-size: 1.5rem; font-weight: 600; color: var(--gray-900);">
          ${inlineIcon('barChart')} ${i18n.t('stats.title')}
        </h2>
        <p style="font-size: 0.875rem; color: var(--gray-600); margin-top: 0.25rem;">
          ${i18n.t('stats.description')}
        </p>
      </div>

      <div class="card mb-4">
        <div class="card-content">
          <label class="label">${i18n.t('stats.periodLabel')}</label>
          <div class="period-selector">
            ${PERIOD_OPTIONS.map(opt => `
              <button
                type="button"
                class="period-option ${this.period === opt.value ? 'active' : ''}"
                data-period="${opt.value}"
              >
                ${i18n.t(opt.labelKey)}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="stats-summary mb-4">
        <div class="stats-summary-card">
          <div class="stats-summary-value">${games.length}</div>
          <div class="stats-summary-label">${i18n.t('stats.summaryGames')}</div>
        </div>
        <div class="stats-summary-card">
          <div class="stats-summary-value">${finishedCount}</div>
          <div class="stats-summary-label">${i18n.t('stats.summaryFinished')}</div>
        </div>
        <div class="stats-summary-card">
          <div class="stats-summary-value">${stats.length}</div>
          <div class="stats-summary-label">${i18n.t('stats.summaryPlayers')}</div>
        </div>
      </div>

      ${stats.length === 0 ? this.renderEmpty() : `
        ${this.renderTopCharts(stats, games, totalWins)}
        ${this.renderPlayerList(stats)}
      `}
    `

    this.querySelectorAll('.period-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const period = (btn as HTMLElement).dataset.period as StatsPeriod
        if (period && period !== this.period) {
          this.period = period
          this.render()
        }
      })
    })
  }

  private renderEmpty(): string {
    return `
      <div class="card">
        <div class="card-content empty-state">
          <div class="empty-state-icon">${icon('barChart')}</div>
          <h3 class="empty-state-title">${i18n.t('stats.noData')}</h3>
          <p class="empty-state-description">${i18n.t('stats.noDataDescription')}</p>
        </div>
      </div>
    `
  }

  private renderTopCharts(stats: PlayerStats[], games: Game[], totalWins: number): string {
    const winsChartItems = stats.map((s, i) => ({
      label: s.name,
      value: s.wins,
      color: 'var(--primary-600)',
      highlight: i === 0 && s.wins > 0
    }))

    const typeCounts = new Map<GameType, number>()
    games.forEach(g => typeCounts.set(g.gameType, (typeCounts.get(g.gameType) ?? 0) + 1))
    const typeSegments = Array.from(typeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([type, count]) => ({
        label: getGameConfig(type).name,
        value: count,
        color: GAME_TYPE_COLORS[type],
        type
      }))

    const winsChartHtml = totalWins > 0
      ? horizontalBarChart(winsChartItems, { barHeight: 24, gap: 10, labelWidth: 120 })
      : `<p class="chart-empty">${i18n.t('stats.noWinsYet')}</p>`

    return `
      <div class="stats-charts-grid mb-4">
        <div class="card">
          <div class="card-content">
            <h3 class="stats-card-title">${i18n.t('stats.winsByPlayer')}</h3>
            <div class="chart-wrapper">${winsChartHtml}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <h3 class="stats-card-title">${i18n.t('stats.gamesByType')}</h3>
            <div class="donut-wrapper">
              ${donutChart(typeSegments, {
                size: 160,
                thickness: 22,
                centerText: games.length.toString(),
                centerSubtext: i18n.t('stats.summaryGames').toLowerCase()
              })}
              <ul class="donut-legend">
                ${typeSegments.map(seg => `
                  <li>
                    <span class="donut-legend-swatch" style="background:${seg.color};"></span>
                    <span class="donut-legend-label">${seg.label}</span>
                    <span class="donut-legend-value">${seg.value}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
  }

  private renderPlayerList(stats: PlayerStats[]): string {
    return `
      <div class="stats-player-list">
        ${stats.map((player, index) => this.renderPlayerCard(player, index + 1)).join('')}
      </div>
    `
  }

  private renderPlayerCard(player: PlayerStats, rank: number): string {
    const winRatePct = Math.round(player.winRate * 100)
    const inProgress = player.gamesPlayed - player.gamesFinished
    const favoriteName = player.favoriteGameType
      ? getGameConfig(player.favoriteGameType).name
      : null

    const rankIconMap: Record<number, 'trophy' | 'medal'> = {
      1: 'trophy',
      2: 'medal',
      3: 'medal'
    }
    const rankIcon = rankIconMap[rank]

    const donut = donutChart(
      [
        { label: i18n.t('stats.wins'), value: player.wins, color: 'var(--success)' },
        { label: i18n.t('stats.losses'), value: player.losses, color: 'var(--error)' }
      ],
      {
        size: 120,
        thickness: 16,
        centerText: `${winRatePct}%`,
        centerSubtext: i18n.t('stats.winRate').toLowerCase()
      }
    )

    return `
      <div class="stats-player-card" data-rank="${rank}">
        <div class="stats-player-header">
          <div class="stats-player-rank">
            ${rankIcon ? inlineIcon(rankIcon) : `<span class="stats-rank-number">${rank}</span>`}
          </div>
          <div class="stats-player-name">${player.name}</div>
          ${favoriteName && player.favoriteGameType ? `
            <span class="game-type-badge" data-type="${player.favoriteGameType}">${favoriteName}</span>
          ` : ''}
        </div>

        <div class="stats-player-body">
          <div class="stats-player-donut">${donut}</div>
          <ul class="stats-metrics-list">
            <li>
              <span class="stats-metrics-dot" style="background: var(--success);"></span>
              <span class="stats-metrics-label">${i18n.t('stats.wins')}</span>
              <span class="stats-metrics-value">${player.wins}</span>
            </li>
            <li>
              <span class="stats-metrics-dot" style="background: var(--error);"></span>
              <span class="stats-metrics-label">${i18n.t('stats.losses')}</span>
              <span class="stats-metrics-value">${player.losses}</span>
            </li>
            <li>
              <span class="stats-metrics-dot" style="background: var(--gray-400);"></span>
              <span class="stats-metrics-label">
                ${i18n.t('stats.gamesPlayed')}${inProgress > 0 ? ` <span class="stats-metrics-hint">(${inProgress} ${i18n.t('stats.inProgress')})</span>` : ''}
              </span>
              <span class="stats-metrics-value">${player.gamesPlayed}</span>
            </li>
            <li>
              <span class="stats-metrics-dot" style="background: var(--gray-400);"></span>
              <span class="stats-metrics-label">${i18n.t('stats.totalRounds')}</span>
              <span class="stats-metrics-value">${player.totalRounds}</span>
            </li>
          </ul>
        </div>
      </div>
    `
  }
}

customElements.define('stats-view', StatsView)
