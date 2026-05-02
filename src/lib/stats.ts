import type { Game, GameType } from '../types'
import { sortPlayersByRank } from './game-configs'

export type StatsPeriod = '7d' | '30d' | '3m' | 'all'

export interface PlayerStats {
  name: string
  gamesPlayed: number
  gamesFinished: number
  wins: number
  losses: number
  winRate: number
  totalRounds: number
  favoriteGameType: GameType | null
}

const DAY_MS = 24 * 60 * 60 * 1000

export function getPeriodCutoff(period: StatsPeriod): number {
  const now = Date.now()
  switch (period) {
    case '7d': return now - 7 * DAY_MS
    case '30d': return now - 30 * DAY_MS
    case '3m': return now - 90 * DAY_MS
    case 'all': return 0
  }
}

export function filterGamesByPeriod(games: Game[], period: StatsPeriod): Game[] {
  const cutoff = getPeriodCutoff(period)
  return games.filter(g => g.createdAt >= cutoff)
}

interface PlayerEntry {
  name: string
  totalGames: number
  finishedGames: number
  wins: number
  totalRounds: number
  typeCounts: Map<GameType, number>
}

export function computePlayerStats(games: Game[]): PlayerStats[] {
  const byName = new Map<string, PlayerEntry>()

  for (const game of games) {
    const winnerId = game.isFinished
      ? sortPlayersByRank(game.players, game.gameType)[0]?.id
      : null

    for (const player of game.players) {
      const key = player.name.trim()
      if (!key) continue

      let entry = byName.get(key)
      if (!entry) {
        entry = {
          name: key,
          totalGames: 0,
          finishedGames: 0,
          wins: 0,
          totalRounds: 0,
          typeCounts: new Map()
        }
        byName.set(key, entry)
      }

      entry.totalGames++
      entry.totalRounds += player.scores.length
      entry.typeCounts.set(
        game.gameType,
        (entry.typeCounts.get(game.gameType) ?? 0) + 1
      )

      if (game.isFinished) {
        entry.finishedGames++
        if (player.id === winnerId) entry.wins++
      }
    }
  }

  return Array.from(byName.values())
    .map(entry => {
      let favoriteGameType: GameType | null = null
      let maxCount = 0
      entry.typeCounts.forEach((count, type) => {
        if (count > maxCount) {
          maxCount = count
          favoriteGameType = type
        }
      })

      const losses = entry.finishedGames - entry.wins
      const winRate = entry.finishedGames > 0 ? entry.wins / entry.finishedGames : 0

      return {
        name: entry.name,
        gamesPlayed: entry.totalGames,
        gamesFinished: entry.finishedGames,
        wins: entry.wins,
        losses,
        winRate,
        totalRounds: entry.totalRounds,
        favoriteGameType
      }
    })
    .sort((a, b) =>
      b.wins - a.wins ||
      b.winRate - a.winRate ||
      b.gamesPlayed - a.gamesPlayed ||
      a.name.localeCompare(b.name)
    )
}
