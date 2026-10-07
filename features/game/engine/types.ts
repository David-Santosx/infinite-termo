export type GameMode = "termo" | "dueto" | "quarteto";
export type PlayMode = GameMode | "campaign";
export type TileStatus = "correct" | "present" | "absent";
export type GameStatus = "playing" | "won" | "lost";

export interface Game {
  id: string;
  mode: GameMode;
  answers: string[];
  guesses: string[];
  status: GameStatus;
}

export interface Dictionary {
  has(word: string): boolean;
}
