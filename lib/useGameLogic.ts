"use client";
import { useState, useEffect, useCallback, useRef } from 'react';
import { TileStatus, Row, GameMode } from '@/types/Game';

type BoardState = {
    isComplete: boolean;
    isLocked: boolean;
};

type ValidationResult = {
    boardId: number;
    rowIndex: number;
    valid: boolean;
    feedback: TileStatus[];
};

function getPriority(status: TileStatus): number {
    switch (status) {
        case 'correct': return 3;
        case 'present': return 2;
        case 'absent': return 1;
        default: return 0;
    }
}

export function useGameLogic(mode: GameMode) {
    const wordLength = 5;
    const attemptsByMode = {
        1: 6,
        2: 7,
        4: 9
    };

    const [words, setWords] = useState<string[]>([]);
    const [boards, setBoards] = useState<Row[][]>([]);
    const [boardStates, setBoardStates] = useState<BoardState[]>([]);
    const [gameStatus, setGameStatus] = useState<'playing' | 'finished'>('playing');

    const [keyboardState, setKeyboardState] = useState<{ [letter: string]: TileStatus[] }>({});
    const [validationError, setValidationError] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);

    // Global input state — same word shown on all active boards
    const [activeBoardIndex, setActiveBoardIndex] = useState(0);
    const [globalRow, setGlobalRow] = useState<string[]>(Array(wordLength).fill(''));
    const [selectedColumn, setSelectedColumn] = useState(0);

    useEffect(() => {
        fetch(`/api/game?mode=${mode}`)
            .then(res => res.json())
            .then(data => {
                setWords(data.words);
                setBoards(data.words.map(() => []));
                setBoardStates(data.words.map(() => ({ isComplete: false, isLocked: false })));
                // Initialize keyboardState with absent for each board
                const initialKeyboard: { [letter: string]: TileStatus[] } = {};
                'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
                    initialKeyboard[letter] = data.words.map(() => 'empty' as TileStatus);
                });
                setKeyboardState(initialKeyboard);
                // Initialize global input
                setGlobalRow(Array(wordLength).fill(''));
                setSelectedColumn(0);
            });
    }, [mode]);

    const attempts = attemptsByMode[words.length as 1 | 2 | 4] || 6;

    // Remove currentInput
    // const [currentInput, setCurrentInput] = useState('');

    const lastSubmitRef = useRef(0);

    const submitWord = useCallback(() => {
        // Debounce: prevenir spam de Enter
        if (Date.now() - lastSubmitRef.current < 400) return;
        lastSubmitRef.current = Date.now();

        const currentInput = globalRow.join('');
        if (currentInput.length !== wordLength || words.length === 0 || gameStatus !== 'playing' || isValidating) return;

        // Snapshot do estado ANTES do fetch para evitar race conditions
        const boardsSnapshot = boards;
        const boardStatesSnapshot = boardStates;
        const inputSnapshot = currentInput;

        // Filtrar apenas boards jogáveis (não locked/complete)
        const playableBoards = boardsSnapshot
            .map((rows, idx) => ({ boardId: idx, rowIndex: rows.length }))
            .filter(b => !boardStatesSnapshot[b.boardId].isLocked && !boardStatesSnapshot[b.boardId].isComplete);

        if (playableBoards.length === 0) return;

        setIsValidating(true);
        setValidationError(null);

        fetch('/api/game/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ attempt: inputSnapshot, boards: playableBoards })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.error || 'Erro na validação');
                });
            }
            return res.json();
        })
        .then((data) => {
            if (data.error) {
                setValidationError(data.error);
                setIsValidating(false);
                return;
            }
            const results: ValidationResult[] = data;
            if (results.some(r => !r.valid)) {
                setValidationError('Palavra inválida. Tente outra.');
                setIsValidating(false);
                return;
            }

            // Conjunto de boardIds que participaram
            const participatedBoardIds = new Set(results.map(r => r.boardId));

            // Apply feedback per boardId usando snapshot
            const newBoards = boardsSnapshot.map((boardRows, index) => {
                if (!participatedBoardIds.has(index)) return boardRows;
                const result = results.find(r => r.boardId === index);
                if (!result) return boardRows;
                return [
                    ...boardRows,
                    {
                        letters: inputSnapshot.split(''),
                        status: result.feedback
                    }
                ];
            });

            setBoards(newBoards);

            // Update keyboardState com deep copy dos arrays
            setKeyboardState(prev => {
                const newKeyboard = Object.fromEntries(
                    Object.entries(prev).map(([k, v]) => [k, [...v]])
                );
                inputSnapshot.split('').forEach((letter, pos) => {
                    results.forEach(result => {
                        const status = result.feedback[pos];
                        if (status && getPriority(status) > getPriority(newKeyboard[letter][result.boardId])) {
                            newKeyboard[letter][result.boardId] = status;
                        }
                    });
                });
                return newKeyboard;
            });

            // Update boardStates usando snapshot
            const newBoardStates = boardStatesSnapshot.map((state, index) => {
                if (state.isComplete || state.isLocked) return state;
                const boardRows = newBoards[index];
                if (boardRows.length > boardsSnapshot[index].length) {
                    const status = boardRows[boardRows.length - 1].status;
                    const isComplete = status.every((s: TileStatus) => s === 'correct');
                    const isLocked = isComplete || boardRows.length >= attempts;
                    return { isComplete, isLocked };
                }
                return state;
            });

            setBoardStates(newBoardStates);

            // Check if all boards are complete
            if (newBoardStates.every(s => s.isComplete)) {
                setGameStatus('finished');
            }

            // Limpar input global
            setGlobalRow(Array(wordLength).fill(''));
            setSelectedColumn(0);
            setIsValidating(false);
        })
        .catch((error) => {
            setValidationError(error.message || 'Erro na validação. Tente novamente.');
            setIsValidating(false);
        });
    }, [globalRow, wordLength, attempts, words, boards, boardStates, gameStatus, isValidating]);

    const handleKey = useCallback((key: string) => {
        if (gameStatus !== 'playing' || isValidating) return;
        if (key === 'ENTER') submitWord();
        else if (key === 'BACKSPACE') {
            // Se posição atual está cheia, apaga ali; senão volta uma
            if (globalRow[selectedColumn] !== '') {
                setGlobalRow(prev => {
                    const newRow = [...prev];
                    newRow[selectedColumn] = '';
                    return newRow;
                });
            } else if (selectedColumn > 0) {
                setGlobalRow(prev => {
                    const newRow = [...prev];
                    newRow[selectedColumn - 1] = '';
                    return newRow;
                });
                setSelectedColumn(selectedColumn - 1);
            }
        } else if (/^[A-Z]$/.test(key)) {
            setGlobalRow(prev => {
                const newRow = [...prev];
                newRow[selectedColumn] = key;
                return newRow;
            });
            if (selectedColumn < wordLength - 1) {
                setSelectedColumn(selectedColumn + 1);
            }
        }
    }, [submitWord, wordLength, gameStatus, isValidating, globalRow, selectedColumn]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                handleKey('ENTER');
            } else if (e.key === 'Backspace') {
                handleKey('BACKSPACE');
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                handleKey(e.key.toUpperCase());
            } else {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKey]);

    const selectTile = useCallback((boardIndex: number, rowIndex: number, colIndex: number) => {
        // Only allow selection on the active row of any board
        if (boardStates[boardIndex].isComplete || boardStates[boardIndex].isLocked) return;
        if (rowIndex !== boards[boardIndex].length) return; // Only active row
        setActiveBoardIndex(boardIndex);
        setSelectedColumn(colIndex);
    }, [boardStates, boards]);

    const clearValidationError = useCallback(() => {
        setValidationError(null);
    }, []);

    // Derive per-board activeRows and selectedColumns for GameBoard compatibility
    const activeRows = words.map((_, idx) =>
        boardStates[idx]?.isLocked || boardStates[idx]?.isComplete
            ? Array(wordLength).fill('')
            : globalRow
    );
    const selectedColumns = words.map(() => selectedColumn);

    return {
        activeBoardIndex,
        activeRows,
        selectedColumns,
        selectTile,
        boards,
        handleKey,
        attempts,
        wordLength,
        words,
        boardStates,
        gameStatus,
        keyboardState,
        validationError,
        isValidating,
        clearValidationError
    };
}