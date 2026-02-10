import { Tile } from './tile';

export type TileStatus =
    | 'correct'
    | 'present'
    | 'absent'
    | 'empty';

type Row = {
    letters: string[];
    status: TileStatus[];
};

type Props = {
    attempts?: number;
    wordLength?: number;
    rows: Row[];
    isActiveBoard?: boolean;
    isEditable?: boolean;
    activeRowIndex?: number;
    selectedColumn?: number;
    onTileClick?: (rowIndex: number, colIndex: number) => void;
    isBoardComplete?: boolean;
};

export function BoardGrid({
    attempts = 6,
    wordLength = 5,
    rows,
    isActiveBoard = false,
    isEditable = false,
    activeRowIndex = -1,
    selectedColumn = -1,
    onTileClick,
    isBoardComplete = false
}: Props) {

    return (
        <div className={`w-full max-w-105 mx-auto rounded-lg p-1 ${isActiveBoard ? 'ring-1 ring-primary/10' : ''}`}>
            <div
                className="grid gap-1 sm:gap-2"
                style={{
                    gridTemplateRows: `repeat(${attempts}, 1fr)`
                }}
            >
                {Array.from({ length: attempts }).map((_, rowIndex) => {

                    const row = rows[rowIndex];

                    return (
                        <div
                            key={rowIndex}
                            className="grid gap-1 sm:gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${wordLength}, 1fr)`
                            }}
                        >
                            {Array.from({ length: wordLength as number }).map((_, colIndex) => {

                                const letter =
                                    row?.letters[colIndex] ?? '';

                                const status =
                                    row?.status[colIndex] ?? 'empty';

                                const isActiveTile = isActiveBoard && rowIndex === activeRowIndex && colIndex === selectedColumn && !isBoardComplete;
                                const canClick = isEditable && rowIndex === activeRowIndex && !isBoardComplete;

                                return (
                                    <Tile
                                        key={colIndex}
                                        letter={letter}
                                        status={status}
                                        isSelected={isActiveTile}
                                        onClick={canClick ? () => onTileClick?.(rowIndex, colIndex) : undefined}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
