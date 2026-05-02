export interface Player {
  id: string;
  name: string;
  scores: number[];
  totalScore: number;
}

export interface Round {
  roundNumber: number;
  scores: { [playerId: string]: number };
  timestamp: number;
  flippedAll?: { [playerId: string]: boolean }; // Track who flipped all cards
}

export type GameType = 'skyjo' | 'papayoo' | 'flip7'

export interface GameTypeConfig {
  type: GameType
  name: string
  defaultScoreLimit: number
  scoringRules: {
    lowestWins: boolean
    hasDoublingRule: boolean
    hasFlippedAllMechanic: boolean
    expectedRoundTotal?: number
  }
  i18nKey: string
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  rounds: Round[];
  currentRound: number;
  scoreLimit: number;
  skyjoRule?: boolean; // DEPRECATED - kept for backward compatibility
  gameType: GameType; // NEW - primary field for game type
  isFinished: boolean;
  createdAt: number;
  finishedAt?: number;
}

export interface AppState {
  games: Game[];
  currentGameId: string | null;
}

export type ViewMode = 'home' | 'game' | 'history';
