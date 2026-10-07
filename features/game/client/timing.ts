import { WORD_LENGTH } from "@/features/game/engine/modes";

export const FLIP_STAGGER_MS = 250;
export const FLIP_DURATION_MS = 500;
export const REVEAL_DURATION_MS = FLIP_STAGGER_MS * (WORD_LENGTH - 1) + FLIP_DURATION_MS;
