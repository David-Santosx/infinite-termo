import type { PublicCampaign } from "@/features/game/contract";
import { CAMPAIGN_STAGES } from "@/features/game/engine/campaign";
import { MODE_LABELS } from "@/features/game/engine/modes";
import { cn } from "@/lib/utils";

export function CampaignHud({ campaign }: { campaign: PublicCampaign }) {
  return (
    <div className="mx-auto flex h-9 w-full max-w-xl items-center justify-between gap-2 px-3 text-sm text-muted-foreground">
      <span className="font-medium text-foreground">Rodada {campaign.round}</span>
      <ol aria-label="Etapas da campanha" className="flex items-center gap-1.5">
        {CAMPAIGN_STAGES.map((mode, i) => {
          const state = i < campaign.stage ? "concluída" : i === campaign.stage ? "atual" : "pendente";
          return (
            <li
              key={mode}
              aria-label={`${MODE_LABELS[mode]}: ${state}`}
              aria-current={i === campaign.stage ? "step" : undefined}
              className={cn(
                "h-2.5 w-7 rounded-full",
                i < campaign.stage ? "bg-tile-correct" : "bg-muted",
                i === campaign.stage && "ring-2 ring-ring ring-offset-1 ring-offset-background",
              )}
            />
          );
        })}
      </ol>
      <span>
        Pontos <b className="text-foreground">{campaign.score}</b> · Recorde <b className="text-foreground">{campaign.best}</b>
      </span>
    </div>
  );
}
