import type { GameType, GameTypeConfig, Game } from '../types'

export const GAME_TYPE_CONFIGS: Record<GameType, GameTypeConfig> = {
  skyjo: {
    type: 'skyjo',
    name: 'Skyjo',
    defaultScoreLimit: 100,
    scoringRules: {
      lowestWins: true,
      hasDoublingRule: true,
      hasFlippedAllMechanic: true,
      expectedRoundTotal: undefined
    },
    i18nKey: 'gameTypes.skyjo'
  },
  papayoo: {
    type: 'papayoo',
    name: 'Papayoo',
    defaultScoreLimit: 500,
    scoringRules: {
      lowestWins: true,
      hasDoublingRule: false,
      hasFlippedAllMechanic: false,
      expectedRoundTotal: 250
    },
    i18nKey: 'gameTypes.papayoo'
  },
  flip7: {
    type: 'flip7',
    name: 'Flip 7',
    defaultScoreLimit: 200,
    scoringRules: {
      lowestWins: false,
      hasDoublingRule: false,
      hasFlippedAllMechanic: false,
      expectedRoundTotal: undefined
    },
    i18nKey: 'gameTypes.flip7'
  },
  uno: {
    type: 'uno',
    name: 'UNO',
    defaultScoreLimit: 500,
    scoringRules: {
      lowestWins: false,
      hasDoublingRule: false,
      hasFlippedAllMechanic: false,
      expectedRoundTotal: undefined,
      singleWinnerPerRound: true
    },
    i18nKey: 'gameTypes.uno'
  }
}

export function getGameConfig(gameType: GameType): GameTypeConfig {
  return GAME_TYPE_CONFIGS[gameType]
}

export function getAvailableGameTypes(): GameType[] {
  return Object.keys(GAME_TYPE_CONFIGS) as GameType[]
}

export function sortPlayersByRank<T extends { totalScore: number }>(
  players: T[],
  gameType: GameType
): T[] {
  const { lowestWins } = getGameConfig(gameType).scoringRules
  return [...players].sort((a, b) =>
    lowestWins ? a.totalScore - b.totalScore : b.totalScore - a.totalScore
  )
}

export function sortByCumulativeScore<T extends { cumulativeScore: number }>(
  entries: T[],
  gameType: GameType
): T[] {
  const { lowestWins } = getGameConfig(gameType).scoringRules
  return [...entries].sort((a, b) =>
    lowestWins ? a.cumulativeScore - b.cumulativeScore : b.cumulativeScore - a.cumulativeScore
  )
}

export interface RankedGameType {
  type: GameType
  playCount: number
  isMostPlayed: boolean
}

export function sortGameTypesByPopularity(games: Game[]): RankedGameType[] {
  const types = getAvailableGameTypes()
  const counts = types.reduce((acc, type) => {
    acc[type] = 0
    return acc
  }, {} as Record<GameType, number>)

  games.forEach(g => {
    if (counts[g.gameType] !== undefined) counts[g.gameType]++
  })

  const max = Math.max(...Object.values(counts))

  return types
    .map<RankedGameType>(type => ({
      type,
      playCount: counts[type],
      isMostPlayed: max > 0 && counts[type] === max
    }))
    .sort((a, b) => {
      if (a.playCount !== b.playCount) return b.playCount - a.playCount
      return getGameConfig(a.type).name.localeCompare(getGameConfig(b.type).name)
    })
}