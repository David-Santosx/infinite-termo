import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MODES } from "@/features/game/engine/modes";
import { ExampleRow } from "./example-row";

interface HelpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const { dueto, quarteto } = MODES;

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Como jogar</DialogTitle>
          <DialogDescription>
            Descubra a palavra em {MODES.termo.maxAttempts} tentativas. Depois de cada palpite, as cores
            mostram o quão perto você chegou.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-col gap-1.5">
            <ExampleRow word="TURMA" statuses={["correct"]} />
            <p>
              A letra <strong>T</strong> está na palavra e na posição certa.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <ExampleRow word="VIOLA" statuses={[undefined, undefined, "present"]} />
            <p>
              <strong>O</strong> está na palavra, mas em outra posição.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <ExampleRow word="PULGA" statuses={[undefined, undefined, undefined, "absent"]} />
            <p>
              <strong>G</strong> não está na palavra.
            </p>
          </div>
          <p>Acentos e cedilha são preenchidos automaticamente. Palavras podem ter letras repetidas.</p>
          <ul className="flex list-disc flex-col gap-1 pl-5">
            <li>
              <strong>Dueto:</strong> {dueto.boards} palavras, {dueto.maxAttempts} tentativas.
            </li>
            <li>
              <strong>Quarteto:</strong> {quarteto.boards} palavras, {quarteto.maxAttempts} tentativas.
            </li>
            <li>
              <strong>Campanha:</strong> Termo → Dueto → Quarteto em sequência; cada vitória vale 1 ponto;
              errou, a campanha recomeça.
            </li>
          </ul>
          <p className="text-muted-foreground">
            Atalhos: setas, Home e End movem o cursor; clique em uma casa para editá-la.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
