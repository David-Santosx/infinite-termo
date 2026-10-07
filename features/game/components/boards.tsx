"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { PublicBoard } from "@/features/game/contract";
import { WORD_LENGTH } from "@/features/game/engine/modes";
import type { GameStatus } from "@/features/game/engine/types";
import type { InputState } from "@/features/game/client/input";
import { Board } from "./board";

const MAX_TILE = 64;
const MIN_TILE = 8;
const ANSWER_ROOM = 22;
const GAP_X = 16;
const GAP_Y = 12;
const PADDING_X = 24;

interface BoardsProps {
  boards: PublicBoard[];
  maxAttempts: number;
  status: GameStatus;
  input: InputState;
  revealingRow: number | null;
  shakeKey: number;
  onSelect?: (column: number) => void;
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

function fit(width: number, height: number, count: number, columns: number, maxAttempts: number, reserveAnswer: boolean) {
  const rows = Math.ceil(count / columns);
  const gap = count === 1 ? 5 : count === 2 ? 4 : 3;
  const boardWidth = (width - PADDING_X - (columns - 1) * GAP_X) / columns;
  const boardHeight = (height - (rows - 1) * GAP_Y) / rows - (reserveAnswer ? ANSWER_ROOM : 0);
  const byWidth = (boardWidth - (WORD_LENGTH - 1) * gap) / WORD_LENGTH;
  const byHeight = (boardHeight - (maxAttempts - 1) * gap) / maxAttempts;
  const tile = Math.floor(Math.min(byWidth, byHeight, MAX_TILE));
  return { columns, gap, tile: Math.max(tile, MIN_TILE) };
}

function computeTile(width: number, height: number, count: number, maxAttempts: number, reserveAnswer: boolean) {
  const options = count === 4 ? [2, 4] : [Math.min(count, 2)];
  return options
    .map((columns) => fit(width, height, count, columns, maxAttempts, reserveAnswer))
    .reduce((best, o) => (o.tile > best.tile ? o : best));
}

export function Boards({ boards, maxAttempts, status, input, revealingRow, shakeKey, onSelect }: BoardsProps) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const { columns, gap, tile } = computeTile(width, height, boards.length, maxAttempts, status === "lost");
  const measured = width > 0 && height > 0;

  const style = {
    "--tile-gap": `${gap}px`,
    "--tile-font": `${Math.round(tile * 0.55)}px`,
    columnGap: GAP_X,
    rowGap: GAP_Y,
    gridTemplateColumns: `repeat(${columns}, ${tile * WORD_LENGTH + gap * (WORD_LENGTH - 1)}px)`,
    visibility: measured ? "visible" : "hidden",
  } as CSSProperties;

  return (
    <div ref={ref} className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 items-center justify-center overflow-hidden px-3">
      <div className="grid justify-center" style={style}>
        {boards.map((board, i) => (
          <Board
            key={i}
            board={board}
            maxAttempts={maxAttempts}
            status={status}
            input={input}
            revealingRow={revealingRow}
            shakeKey={shakeKey}
            onSelect={onSelect}
            index={i}
            total={boards.length}
          />
        ))}
      </div>
    </div>
  );
}
