import { Delete } from "lucide-react";
import type { KeyCommand } from "@/features/game/client/key-commands";
import type { KeyStatuses } from "@/features/game/client/keyboard-state";
import { STATUS_LABEL } from "@/features/game/client/labels";
import type { TileStatus } from "@/features/game/engine/types";
import { cn } from "@/lib/utils";

const ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"] as const;
const REGIONS: Record<number, string[]> = {
  1: ["inset-0"],
  2: ["inset-y-0 left-0 w-1/2", "inset-y-0 right-0 w-1/2"],
  4: ["left-0 top-0 h-1/2 w-1/2", "right-0 top-0 h-1/2 w-1/2", "bottom-0 left-0 h-1/2 w-1/2", "bottom-0 right-0 h-1/2 w-1/2"],
};

interface KeyboardProps {
  statuses: KeyStatuses;
  boards: number;
  onCommand: (command: KeyCommand) => void;
  disabled: boolean;
}

const KEY_CLASS =
  "relative flex h-14 flex-1 items-center justify-center overflow-hidden rounded-md bg-key font-display font-semibold text-key-foreground transition-transform active:scale-95 disabled:pointer-events-none sm:h-[3.75rem]";

function describe(letter: string, keyStatuses: (TileStatus | undefined)[]) {
  const parts = keyStatuses.flatMap((s, i) =>
    s ? [keyStatuses.length > 1 ? `${STATUS_LABEL[s]} no tabuleiro ${i + 1}` : STATUS_LABEL[s]] : [],
  );
  return parts.length ? `${letter}: ${parts.join(", ")}` : letter;
}

export function Keyboard({ statuses, boards, onCommand, disabled }: KeyboardProps) {
  const regions = REGIONS[boards] ?? REGIONS[1];

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-1.5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {ROWS.map((row, rowIndex) => (
        <div key={row} className="flex justify-center gap-1.5">
          {[...row].map((letter) => {
            const keyStatuses = statuses[letter] ?? [];
            const allAbsent = keyStatuses.length > 0 && keyStatuses.every((s) => s === "absent");
            const covered = keyStatuses.length > 0 && keyStatuses.every(Boolean);
            return (
              <button
                key={letter}
                type="button"
                disabled={disabled}
                aria-label={describe(letter, keyStatuses)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onCommand({ type: "letter", letter })}
                className={cn(KEY_CLASS, "max-w-11", covered && "text-tile-text", allAbsent && "opacity-50")}
              >
                {keyStatuses.map(
                  (s, i) =>
                    s && (
                      <span
                        key={i}
                        aria-hidden
                        className={cn("absolute", regions[i])}
                        style={{ backgroundColor: `var(--tile-${s})` }}
                      />
                    ),
                )}
                <span className="relative">{letter}</span>
              </button>
            );
          })}
          {rowIndex === 1 && (
            <button
              type="button"
              disabled={disabled}
              aria-label="Apagar"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onCommand({ type: "backspace" })}
              className={cn(KEY_CLASS, "max-w-16 flex-[1.5]")}
            >
              <Delete className="size-5" aria-hidden />
            </button>
          )}
          {rowIndex === 2 && (
            <button
              type="button"
              disabled={disabled}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onCommand({ type: "enter" })}
              className={cn(KEY_CLASS, "max-w-16 flex-[1.5] text-xs")}
            >
              ENTER
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
