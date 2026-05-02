import type { GameType } from '../types'
import { getGameConfig } from './game-configs'

export interface RoundScores {
  originalScores: { [playerId: string]: number }
  processedScores: { [playerId: string]: number }
  flippedAll?: { [playerId: string]: boolean }
  warnings?: string[]
}

export function processRoundScores(
  gameType: GameType,
  scores: { [playerId: string]: number },
  flippedAll?: { [playerId: string]: boolean }
): RoundScores {
  const config = getGameConfig(gameType)
  const result: RoundScores = {
    originalScores: { ...scores },
    processedScores: { ...scores },
    flippedAll,
    warnings: []
  }

  // Apply game-specific doubling rules (Skyjo)
  if (config.scoringRules.hasDoublingRule && flippedAll) {
    const lowestScore = Math.min(...Object.values(scores))

    Object.keys(flippedAll).forEach(playerId => {
      if (flippedAll[playerId] && scores[playerId] > lowestScore) {
        result.processedScores[playerId] = scores[playerId] * 2
      }
    })
  }

  // Validate round totals for games that need it (Papayoo)
  if (config.scoringRules.expectedRoundTotal !== undefined) {
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
    if (total !== config.scoringRules.expectedRoundTotal) {
      result.warnings = [
        `Round total is ${total}, expected ${config.scoringRules.expectedRoundTotal}`
      ]
    }
  }

  return result
}
