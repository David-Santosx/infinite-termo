export type GameMode = 'termo' | 'dueto' | 'quarteto';

export interface GameSession {
  currentLevel: GameMode;
  completedLevels: GameMode[];
  totalGames: number;
  wins: number;
  losses: number;
  currentGameWordIndexes?: number[]; // Índices das palavras em vez das palavras em si
  currentGameWords?: string[]; // Adicionado dinamicamente pelo getSession
}