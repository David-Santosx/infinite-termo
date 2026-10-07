import { z } from "zod";
import type { Campaign } from "@/features/game/engine/campaign";
import { GAME_MODES } from "@/features/game/engine/modes";
import type { Game, GameMode } from "@/features/game/engine/types";

export interface GameState {
  v: 1;
  games: Partial<Record<GameMode, Game>>;
  campaign?: Campaign;
}

export const emptyState = (): GameState => ({ v: 1, games: {} });

const word = z.string().regex(/^[a-z]{5}$/);

const gameSchema = z.object({
  id: z.string().min(1),
  mode: z.enum(GAME_MODES),
  answers: z.array(word).min(1).max(4),
  guesses: z.array(word).max(9),
  status: z.enum(["playing", "won", "lost"]),
});

export const gameStateSchema = z.object({
  v: z.literal(1),
  games: z.object({
    termo: gameSchema.optional(),
    dueto: gameSchema.optional(),
    quarteto: gameSchema.optional(),
  }),
  campaign: z
    .object({
      runId: z.string().min(1),
      stage: z.number().int().min(0).max(2),
      round: z.number().int().min(1),
      score: z.number().int().min(0),
      best: z.number().int().min(0),
      game: gameSchema,
    })
    .optional(),
});
