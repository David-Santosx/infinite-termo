"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useHighContrast } from "@/features/game/client/settings";
import { buildShareText, shareResult } from "@/features/game/client/share";
import { loadStats } from "@/features/game/client/stats";
import type { PublicGame } from "@/features/game/contract";
import { nextActionLabel } from "./next-action";
import { StatsSummary } from "./stats-summary";
import { Tile } from "./tile";

interface ResultDialogProps {
  game: PublicGame;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
}

function titleFor(game: PublicGame) {
  if (game.status === "won") {
    const extra = game.attemptsUsed - game.boards.length;
    if (extra <= 1) return "Genial!";
    return extra <= 3 ? "Mandou bem!" : "Ufa!";
  }
  return game.mode === "campaign" ? "Fim da campanha" : "Não foi dessa vez";
}

function ResultBody({
  game,
  onOpenChange,
  onNext,
}: Omit<ResultDialogProps, "open">) {
  const [stats] = useState(loadStats);
  const [highContrast] = useHighContrast();

  const share = async () => {
    const path = game.mode === "campaign" ? "/" : `/${game.mode}`;
    const text = buildShareText(game, {
      highContrast,
      url: window.location.origin + path,
    });
    const outcome = await shareResult(text);
    if (outcome === "copied") toast("Resultado copiado");
    else if (outcome === "failed") toast("Não foi possível compartilhar");
  };

  const next = () => {
    onOpenChange(false);
    onNext();
  };

  return (
    <>
      <div className="flex flex-col items-center gap-2 [--tile-font:1.25rem]">
        {game.boards.map((board, b) => (
          <div key={b} className="grid w-full max-w-[16rem] grid-cols-5 gap-1">
            {[...(board.answer ?? "")].map((letter, i) => (
              <Tile
                key={i}
                letter={letter}
                status={board.solved ? "correct" : "absent"}
                index={i}
                variant="static"
                label={letter}
              />
            ))}
          </div>
        ))}
      </div>
      {game.campaign && (
        <p className="text-center text-sm">
          Pontuação: {game.campaign.score} · Recorde: {game.campaign.best}
        </p>
      )}
      <StatsSummary stats={stats} mode={game.mode} />
      <div className="grid gap-2 sm:grid-cols-2">
        <Button variant="outline" onClick={share}>
          Compartilhar
        </Button>
        <Button onClick={next}>{nextActionLabel(game)}</Button>
      </div>
    </>
  );
}

export function ResultDialog({
  game,
  open,
  onOpenChange,
  onNext,
}: ResultDialogProps) {
  const plural = game.boards.length > 1;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{titleFor(game)}</DialogTitle>
          <DialogDescription>
            {game.status === "won"
              ? plural ? "Você acertou as palavras." : "Você acertou a palavra."
              : plural ? "As respostas eram:" : "A resposta era:"}
          </DialogDescription>
        </DialogHeader>
        <ResultBody game={game} onOpenChange={onOpenChange} onNext={onNext} />
      </DialogContent>
    </Dialog>
  );
}
