import type { GameErrorCode } from "./engine/errors";
import type { GameMode, GameStatus, PlayMode, TileStatus } from "./engine/types";

export interface PublicRow {
  letters: string[];
  statuses: TileStatus[];
}

export interface PublicBoard {
  rows: PublicRow[];
  solved: boolean;
  answer?: string;
}

export interface PublicCampaign {
  stage: number;
  round: number;
  score: number;
  best: number;
}

export interface PublicGame {
  id: string;
  mode: PlayMode;
  boardMode: GameMode;
  maxAttempts: number;
  attemptsUsed: number;
  status: GameStatus;
  boards: PublicBoard[];
  campaign?: PublicCampaign;
}

export type ApiErrorCode = GameErrorCode | "BAD_REQUEST" | "INTERNAL";

export interface ApiError {
  error: { code: ApiErrorCode; message: string };
}
