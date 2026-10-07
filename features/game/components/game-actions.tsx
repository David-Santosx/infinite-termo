import { Button } from "@/components/ui/button";
import type { PublicGame } from "@/features/game/contract";
import { nextActionLabel } from "./next-action";

interface GameActionsProps {
  game: PublicGame;
  onNext: () => void;
  onShowResult?: () => void;
}

export function GameActions({ game, onNext, onShowResult }: GameActionsProps) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <Button size="lg" onClick={onNext} autoFocus>
        {nextActionLabel(game)}
      </Button>
      {onShowResult && (
        <Button size="lg" variant="outline" onClick={onShowResult}>
          Ver resultado
        </Button>
      )}
    </div>
  );
}
