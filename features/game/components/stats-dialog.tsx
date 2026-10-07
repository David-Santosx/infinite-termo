"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { loadStats } from "@/features/game/client/stats";
import {
  MODE_LABELS,
  PLAY_MODES,
  isPlayMode,
} from "@/features/game/engine/modes";
import type { PlayMode } from "@/features/game/engine/types";
import { StatsSummary } from "./stats-summary";

interface StatsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode: PlayMode;
}

function StatsBody({ initialMode }: { initialMode: PlayMode }) {
  const [mode, setMode] = useState(initialMode);
  const [stats] = useState(loadStats);

  return (
    <>
      <ToggleGroup
        type="single"
        variant="outline"
        value={mode}
        onValueChange={(v) => isPlayMode(v) && setMode(v)}
        aria-label="Modo"
        className="self-center"
      >
        {PLAY_MODES.map((m) => (
          <ToggleGroupItem key={m} value={m}>
            {MODE_LABELS[m]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <StatsSummary stats={stats} mode={mode} />
    </>
  );
}

export function StatsDialog({
  open,
  onOpenChange,
  initialMode,
}: StatsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Estatísticas</DialogTitle>
          <DialogDescription>
            Seu desempenho neste dispositivo.
          </DialogDescription>
        </DialogHeader>
        <StatsBody initialMode={initialMode} />
      </DialogContent>
    </Dialog>
  );
}
