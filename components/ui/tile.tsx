import { TileStatus } from "./board-grid";

export function Tile({ letter, status, isSelected = false, onClick }: { letter: string; status: TileStatus; isSelected?: boolean; onClick?: () => void }) {

  const statusColor = {
    correct: 'bg-green-600 border-green-700',
    present: 'bg-yellow-500 border-yellow-600',
    absent: 'bg-zinc-700 border-zinc-800',
    empty: 'bg-transparent border-zinc-600'
  };

  return (
    <div
      className={`
        w-full
        aspect-square
        flex items-center justify-center
        border-2
        font-bold
        rounded
        text-sm sm:text-lg md:text-xl lg:text-2xl
        ${statusColor[status]}
        ${isSelected ? 'border-b-blue-100 border-4 scale-105 shadow-lg' : ''}
        ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
      `}
      onClick={onClick}
    >
      {letter}
    </div>
  );
}