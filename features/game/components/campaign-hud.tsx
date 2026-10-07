import type { PublicCampaign } from "@/features/game/contract";
import { CAMPAIGN_STAGES } from "@/features/game/engine/campaign";
import { MODE_LABELS } from "@/features/game/engine/modes";
import { cn } from "@/lib/utils";

export function CampaignHud({ campaign }: { campaign: PublicCampaign }) {
  return (
    <div className="mx-auto flex h-9 w-full max-w-xl items-center justify-between gap-2 px-3 text-[11px] text-muted-foreground sm:text-sm">
      <ol aria-label="Etapas da campanha" className="flex items-center gap-1">
        {CAMPAIGN_STAGES.map((mode, i) => {
          const done = i < campaign.stage;
          const current = i === campaign.stage;
          return (
            <li
              key={mode}
              aria-current={current ? "step" : undefined}
              className={cn(
                "rounded-full px-2 py-0.5 font-medium",
                done ? "bg-tile-correct text-tile-text" : "bg-muted",
                current && "text-foreground ring-2 ring-ring",
              )}
            >
              {MODE_LABELS[mode]}
              <span className="sr-only">{done ? " (concluída)" : current ? " (atual)" : " (pendente)"}</span>
            </li>
          );
        })}
      </ol>
      <span className="whitespace-nowrap">
        Rodada {campaign.round} · Pontos <b className="text-foreground">{campaign.score}</b> · Recorde{" "}
        <b className="text-foreground">{campaign.best}</b>
      </span>
    </div>
  );
}
