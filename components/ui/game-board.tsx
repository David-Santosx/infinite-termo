'use client';

import { BoardGrid } from './board-grid';
import { Row } from '@/types/Game';

type BoardState = {
    isComplete: boolean;
    isLocked: boolean;
};

type Props = {
  words: string[]; // 1 termo | 2 dueto | 4 quarteto
  activeRows: string[][];
  selectedColumns: number[];
  activeBoardIndex: number;
  selectTile: (boardIndex: number, rowIndex: number, colIndex: number) => void;
  boards: Row[][];
  attempts: number;
  wordLength: number;
  boardStates: BoardState[];
};

export function GameBoard({ words, activeRows, selectedColumns, activeBoardIndex, selectTile, boards, attempts, wordLength, boardStates }: Props) {

  const boardCount = words.length;

const gridClass =
  boardCount === 1
    ? 'grid-cols-1'
    : boardCount === 2
    ? 'grid-cols-2'
    : 'grid-cols-2 lg:grid-cols-4';

  const displayBoards = boards.map((boardRows, i) => {
    let rows = boardRows;
    if (boardStates[i].isComplete && rows.length > 0) {
      // Replace the last row's letters with the accented secret word
      const lastIndex = rows.length - 1;
      rows = [...rows];
      rows[lastIndex] = {
        ...rows[lastIndex],
        letters: words[i].split('').map(l => l.toUpperCase())
      };
    }
    if (!boardStates[i].isComplete) {
      const currentRow: Row = {
        letters: activeRows[i],
        status: Array(wordLength).fill('empty')
      };
      rows = [...rows, currentRow];
    }
    return rows;
  });

  return (
    <div className="w-full flex justify-center">
    <div
      className={`
        grid ${gridClass}
        gap-3 sm:gap-4 md:gap-6
        w-full
        max-w-6xl
        px-3 sm:px-6
      `}
    >
      {displayBoards.map((rows, i) => {
        const isLocked = boardStates[i].isComplete || boardStates[i].isLocked;
        return (
          <BoardGrid
            key={i}
            attempts={attempts}
            wordLength={wordLength}
            rows={rows}
            isActiveBoard={i === activeBoardIndex}
            isEditable={!isLocked}
            activeRowIndex={boards[i].length}
            selectedColumn={selectedColumns[i]}
            onTileClick={(rowIndex, colIndex) => selectTile(i, rowIndex, colIndex)}
            isBoardComplete={boardStates[i].isComplete}
          />
        );
      })}
    </div>
  </div>
  );
}
