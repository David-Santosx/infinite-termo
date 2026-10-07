import { STATUS_LABEL } from "@/features/game/client/labels";
import type { TileStatus } from "@/features/game/engine/types";
import { Tile } from "./tile";


interface ExampleRowProps {
  word: string;
  statuses: (TileStatus | undefined)[];
}

export function ExampleRow({ word, statuses }: ExampleRowProps) {
  return (
    <div
      className="grid w-full max-w-[16rem] grid-cols-5 gap-1 [--tile-font:1.25rem]"
      role="group"
      aria-label={word}
    >
      {[...word].map((letter, i) => {
        const status = statuses[i];
        return (
          <Tile
            key={i}
            letter={letter}
            status={status ?? "absent"}
            index={i}
            variant={status ? "static" : "empty"}
            label={status ? `${letter}: ${STATUS_LABEL[status]}` : letter}
          />
        );
      })}
    </div>
  );
}
