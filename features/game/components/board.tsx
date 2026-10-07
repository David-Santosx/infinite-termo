"use client";
import { useEffect, useRef, useState } from "react";
import type { PublicBoard } from "@/features/game/contract";
import { WORD_LENGTH } from "@/features/game/engine/modes";
import type { GameStatus, TileStatus } from "@/features/game/engine/types";
import type { InputState } from "@/features/game/client/input";
import { cn } from "@/lib/utils";
import { Tile } from "./tile";

const STATUS_LABEL: Record<TileStatus, string> = { correct: "correta", present: "em outra posição", absent: "ausente" };
const BOUNCE_MS = 1300;

interface BoardProps {
  board: PublicBoard;
  maxAttempts: number;
  status: GameStatus;
  input: InputState;
  revealingRow: number | null;
  shakeKey: number;
  onSelect?: (column: number) => void;
  index: number;
  total: number;
}

export function Board({ board, maxAttempts, status, input, revealingRow, shakeKey, onSelect, index, total }: BoardProps) {
  const lastReveal = useRef(revealingRow);
  const [bounce, setBounce] = useState(false);
  const lastRow = board.rows.length - 1;

  useEffect(() => {
    const revealed = lastReveal.current;
    lastReveal.current = revealingRow;
    if (revealed === null || revealingRow !== null || !board.solved || revealed !== lastRow) return;
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), BOUNCE_MS);
    return () => {
      clearTimeout(timer);
      setBounce(false);
    };
  }, [revealingRow, board.solved, lastRow]);

  const playing = status === "playing" && !board.solved;
  const ended = status !== "playing" || board.solved;
  const showAnswer = status === "lost" && !board.solved && board.answer;

  return (
    <div
      role="group"
      aria-label={total > 1 ? `Tabuleiro ${index + 1} de ${total}` : "Tabuleiro"}
      className={cn("flex flex-col items-center", ended && "opacity-90")}
    >
      <div className="grid w-full gap-[var(--tile-gap,5px)]" style={{ gridTemplateRows: `repeat(${maxAttempts}, 1fr)` }}>
        {Array.from({ length: maxAttempts }, (_, r) => {
          const row = board.rows[r];
          const active = playing && r === board.rows.length;
          return (
            <div
              key={active ? `active-${shakeKey}` : r}
              className={cn("grid grid-cols-5 gap-[var(--tile-gap,5px)]", active && shakeKey > 0 && "animate-row-shake")}
            >
              {Array.from({ length: WORD_LENGTH }, (_, c) => {
                if (row) {
                  const tileStatus = row.statuses[c];
                  return (
                    <Tile
                      key={c}
                      letter={row.letters[c]}
                      status={tileStatus}
                      index={c}
                      variant={r === revealingRow ? "revealed" : "static"}
                      bounce={bounce && r === lastRow}
                      label={`${row.letters[c]}, ${STATUS_LABEL[tileStatus]}`}
                    />
                  );
                }
                if (active) {
                  const letter = input.letters[c];
                  return (
                    <Tile
                      key={c}
                      letter={letter}
                      index={c}
                      variant="input"
                      selected={c === input.cursor}
                      onSelect={onSelect && (() => onSelect(c))}
                      label={letter ? `Letra ${c + 1}: ${letter}` : `Letra ${c + 1} vazia`}
                    />
                  );
                }
                return <Tile key={c} letter="" index={c} variant="empty" label={`Linha ${r + 1}, letra ${c + 1} vazia`} />;
              })}
            </div>
          );
        })}
      </div>
      {showAnswer && (
        <p className="mt-1 font-display text-sm uppercase leading-none tracking-wider" aria-label={`Resposta: ${board.answer}`}>
          {board.answer}
        </p>
      )}
    </div>
  );
}
