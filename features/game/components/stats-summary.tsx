import type { Stats } from "@/features/game/client/stats";
import { winRate } from "@/features/game/client/stats";
import type { PlayMode } from "@/features/game/engine/types";

function Figure({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-display text-3xl">{value}</span>
      <span className="text-center text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

export function StatsSummary({
  stats,
  mode,
}: {
  stats: Stats;
  mode: PlayMode;
}) {
  if (mode === "campaign") {
    const { runs, best, lastScore } = stats.campaign;
    return (
      <div className="grid grid-cols-3 gap-2">
        <Figure value={runs} label="Campanhas" />
        <Figure value={best} label="Recorde" />
        <Figure value={lastScore} label="Última pontuação" />
      </div>
    );
  }

  const s = stats.modes[mode];
  const max = Math.max(...s.distribution);
  const description = s.distribution
    .map((n, i) => `${i + 1} tentativa${i ? "s" : ""}: ${n}`)
    .join(", ");

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-2">
        <Figure value={s.played} label="Jogos" />
        <Figure value={`${winRate(s)}%`} label="% Vitórias" />
        <Figure value={s.currentStreak} label="Sequência" />
        <Figure value={s.maxStreak} label="Melhor sequência" />
      </div>
      <div
        role="img"
        aria-label={`Distribuição de tentativas. ${description}`}
        className="flex flex-col gap-1"
      >
        {s.distribution.map((n, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" aria-hidden>
            <span className="w-3 text-right text-muted-foreground">
              {i + 1}
            </span>
            <div
              className={`rounded-sm px-2 py-0.5 text-right font-medium ${n > 0 && n === max ? "bg-tile-correct text-tile-text" : "bg-muted"}`}
              style={{ width: `${max ? Math.max(8, (n / max) * 100) : 8}%` }}
            >
              {n}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
