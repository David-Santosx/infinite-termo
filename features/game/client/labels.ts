import type { TileStatus } from "@/features/game/engine/types";

export const STATUS_LABEL: Record<TileStatus, string> = {
  correct: "correta",
  present: "em outra posição",
  absent: "ausente",
};
