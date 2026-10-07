import type { GameMode, PlayMode } from "./types";

export const WORD_LENGTH = 5;

export const GAME_MODES = ["termo", "dueto", "quarteto"] as const satisfies readonly GameMode[];
export const PLAY_MODES = ["campaign", ...GAME_MODES] as const satisfies readonly PlayMode[];

export const MODES: Record<GameMode, { boards: number; maxAttempts: number }> = {
  termo: { boards: 1, maxAttempts: 6 },
  dueto: { boards: 2, maxAttempts: 7 },
  quarteto: { boards: 4, maxAttempts: 9 },
};

export const MODE_LABELS: Record<PlayMode, string> = {
  campaign: "Campanha",
  termo: "Termo",
  dueto: "Dueto",
  quarteto: "Quarteto",
};

export const isGameMode = (value: unknown): value is GameMode =>
  typeof value === "string" && (GAME_MODES as readonly string[]).includes(value);

export const isPlayMode = (value: unknown): value is PlayMode =>
  typeof value === "string" && (PLAY_MODES as readonly string[]).includes(value);
