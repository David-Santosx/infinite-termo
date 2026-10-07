import type { PublicBoard } from "@/features/game/contract";
import { normalize } from "@/features/game/engine/normalize";
import type { TileStatus } from "@/features/game/engine/types";

export type KeyStatuses = Record<string, (TileStatus | undefined)[]>;

const RANK: Record<TileStatus, number> = { absent: 1, present: 2, correct: 3 };

export function keyboardStatuses(boards: PublicBoard[], hideRow?: number): KeyStatuses {
  const result: KeyStatuses = {};
  for (const key of "ABCDEFGHIJKLMNOPQRSTUVWXYZ") result[key] = Array(boards.length).fill(undefined);

  boards.forEach((board, b) => {
    board.rows.forEach((row, r) => {
      if (r === hideRow) return;
      row.letters.forEach((letter, i) => {
        const key = normalize(letter).toUpperCase();
        const current = result[key]?.[b];
        const next = row.statuses[i];
        if (result[key] && (!current || RANK[next] > RANK[current])) result[key][b] = next;
      });
    });
  });
  return result;
}
