"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import type { PublicBoard } from "@/features/game/contract";
import { MODES } from "@/features/game/engine/modes";
import type { PlayMode } from "@/features/game/engine/types";
import { keyboardStatuses } from "@/features/game/client/keyboard-state";
import { useGame } from "@/features/game/client/use-game";
import { useKeyCommands } from "@/features/game/client/use-key-commands";
import { Boards } from "./boards";
import { CampaignHud } from "./campaign-hud";
import { GameActions } from "./game-actions";
import { Keyboard } from "./keyboard";

const EMPTY_BOARD: PublicBoard = { rows: [], solved: false };
const BOTTOM_ROOM = "min-h-[11.75rem] sm:min-h-[12.5rem]";

export function GameView({ mode }: { mode: PlayMode }) {
  const { game, loadError, input, pending, revealingRow, shakeKey, announcement, finished, press, selectColumn, startNext, reload } =
    useGame(mode);
  useKeyCommands(press, !!game && !finished);

  const fallbackMode = MODES[mode === "campaign" ? "termo" : mode];
  const skeleton = useMemo(() => Array.from({ length: fallbackMode.boards }, () => EMPTY_BOARD), [fallbackMode.boards]);
  const boards = game?.boards ?? skeleton;
  const statuses = useMemo(() => keyboardStatuses(boards, revealingRow ?? undefined), [boards, revealingRow]);

  if (loadError && !game) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p role="alert">{loadError}</p>
        <Button onClick={reload}>Tentar de novo</Button>
      </div>
    );
  }

  return (
    <>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
      {mode === "campaign" &&
        (game?.campaign ? <CampaignHud campaign={game.campaign} /> : <div className="h-9" aria-hidden />)}
      <Boards
        boards={boards}
        maxAttempts={game?.maxAttempts ?? fallbackMode.maxAttempts}
        status={game?.status ?? "playing"}
        input={input}
        revealingRow={revealingRow}
        shakeKey={shakeKey}
        onSelect={game && !finished ? selectColumn : undefined}
      />
      <div className={`flex flex-col justify-end ${BOTTOM_ROOM}`}>
        {finished && game ? (
          <GameActions game={game} onNext={startNext} />
        ) : (
          <Keyboard statuses={statuses} boards={boards.length} onCommand={press} disabled={!game || pending} />
        )}
      </div>
    </>
  );
}
