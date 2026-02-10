"use client";
import { GameBoard } from "@/components/ui/game-board";
import { Keyboard } from "@/components/ui/keyboard";
import { useGameLogic } from "@/lib/useGameLogic";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
    const { activeBoardIndex, activeRows, selectedColumns, selectTile, boards, handleKey, attempts, wordLength, words, boardStates, keyboardState, validationError, clearValidationError } = useGameLogic('dueto');

    return (
        <>
            <GameBoard
                words={words}
                activeRows={activeRows}
                selectedColumns={selectedColumns}
                activeBoardIndex={activeBoardIndex}
                selectTile={selectTile}
                boards={boards}
                attempts={attempts}
                wordLength={wordLength}
                boardStates={boardStates}
            />
            <Keyboard onKey={handleKey} keyboardState={keyboardState} boardCount={words.length} />
            <Dialog open={!!validationError} onOpenChange={() => clearValidationError()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Palavra inválida</DialogTitle>
                        <DialogDescription>
                            {validationError}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}