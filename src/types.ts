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
}

export interface Game {
  id: string;
  name: string;
  players: Player[];
  rounds: Round[];
  currentRound: number;
  scoreLimit: number;
  isFinished: boolean;
  createdAt: number;
  finishedAt?: number;
}

export interface AppState {
  games: Game[];
  currentGameId: string | null;
}

export type ViewMode = 'home' | 'game' | 'history';
