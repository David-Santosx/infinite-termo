"use client";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { toast } from "sonner";
import type { PublicGame } from "@/features/game/contract";
import { WORD_LENGTH } from "@/features/game/engine/modes";
import type { PlayMode } from "@/features/game/engine/types";
import { fetchGame, postGuess, postNewGame } from "./api";
import { emptyInput, inputReducer, inputWord } from "./input";
import type { KeyCommand } from "./key-commands";
import { loadStats, recordGame, saveStats } from "./stats";
import { REVEAL_DURATION_MS } from "./timing";

const STATUS_LABEL = { correct: "correta", present: "em outra posição", absent: "ausente" } as const;

function describeLastGuess(game: PublicGame): string {
  return game.boards
    .map((b, i) => ({ b, i }))
    .filter(({ b }) => b.rows.length === game.attemptsUsed)
    .map(({ b, i }) => {
      const row = b.rows[b.rows.length - 1];
      const letters = row.letters.map((l, j) => `${l} ${STATUS_LABEL[row.statuses[j]]}`).join(", ");
      return game.boards.length > 1 ? `Tabuleiro ${i + 1}: ${letters}` : letters;
    })
    .join(". ");
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useGame(mode: PlayMode) {
  const [game, setGame] = useState<PublicGame | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [input, dispatch] = useReducer(inputReducer, undefined, emptyInput);
  const [pending, setPending] = useState(false);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const starting = useRef(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchGame(mode).then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setGame(result.game);
        setLoadError(null);
      } else {
        setLoadError(result.message);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mode, attempt]);

  useEffect(() => {
    if (revealingRow === null) return;
    const timer = setTimeout(() => setRevealingRow(null), prefersReducedMotion() ? 0 : REVEAL_DURATION_MS);
    return () => clearTimeout(timer);
  }, [revealingRow]);

  const finished = !!game && game.status !== "playing" && revealingRow === null;

  useEffect(() => {
    if (finished && game) saveStats(recordGame(loadStats(), game));
  }, [finished, game]);

  const reject = useCallback((message: string) => {
    toast(message);
    setShakeKey((k) => k + 1);
  }, []);

  const submit = useCallback(async () => {
    if (!game || pending || game.status !== "playing" || revealingRow !== null) return;
    const word = inputWord(input);
    if (word.length < WORD_LENGTH) return reject("Só palavras com 5 letras");

    setPending(true);
    const result = await postGuess(mode, word);
    setPending(false);
    if (!result.ok) return reject(result.message);

    setGame(result.game);
    dispatch({ type: "clear" });
    setRevealingRow(result.game.attemptsUsed - 1);
    const text = describeLastGuess(result.game);
    setAnnouncement((prev) => (prev === text ? `${text}\u200b` : text));
  }, [game, pending, revealingRow, input, mode, reject]);

  const press = useCallback(
    (command: KeyCommand) => {
      if (!game || game.status !== "playing" || revealingRow !== null) return;
      if (command.type === "enter") void submit();
      else dispatch(command);
    },
    [game, revealingRow, submit],
  );

  const selectColumn = useCallback((cursor: number) => dispatch({ type: "select", cursor }), []);

  const startNext = useCallback(async () => {
    if (starting.current) return;
    starting.current = true;
    let result;
    try {
      result = await postNewGame(mode);
    } finally {
      starting.current = false;
    }
    if (!result.ok) return void toast(result.message);
    dispatch({ type: "clear" });
    setAnnouncement("");
    setGame(result.game);
  }, [mode]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { game, loadError, input, pending, revealingRow, shakeKey, announcement, finished, press, selectColumn, startNext, reload };
}
