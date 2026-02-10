import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";
import { TileStatus } from "@/types/Game";

type Props = {
    onKey: (key: string) => void;
    keyboardState: { [letter: string]: TileStatus[] };
    boardCount: number;
};

export function Keyboard({ onKey, keyboardState, boardCount }: Props) {
    const rows = [
        "QWERTYUIOP",
        "ASDFGHJKL",
        "ZXCVBNM"
    ];

    return (
        <div className="w-full max-w-[min(92vw,34rem)] mx-auto pb-2">
            <div className="flex flex-col gap-[clamp(0.25rem,1vw,0.5rem)] w-full select-none p-1">
                {/* Row 1 */}
                <div className="flex gap-[clamp(0.2rem,0.8vw,0.4rem)] w-full justify-center">
                    {rows[0].split('').map((letter) => (
                        <KeyButton key={letter} letter={letter} onKey={onKey} states={keyboardState[letter] || []} boardCount={boardCount} />
                    ))}
                </div>

                {/* Row 2 */}
                <div className="flex gap-[clamp(0.2rem,0.8vw,0.4rem)] w-full justify-center px-[clamp(0.5rem,3vw,1.5rem)]">
                    {rows[1].split('').map((letter) => (
                        <KeyButton key={letter} letter={letter} onKey={onKey} states={keyboardState[letter] || []} boardCount={boardCount} />
                    ))}
                </div>

                {/* Row 3 - Includes Enter and Backspace */}
                <div className="flex gap-[clamp(0.2rem,0.8vw,0.4rem)] w-full justify-center">
                    <Button
                        className="flex-[1.5] h-[clamp(2.25rem,6vw,3.5rem)] p-0 text-[clamp(0.6rem,1.8vw,0.9rem)] font-bold uppercase rounded-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => onKey('ENTER')}
                    >
                        Enter
                    </Button>
                    
                    {rows[2].split('').map((letter) => (
                        <KeyButton key={letter} letter={letter} onKey={onKey} states={keyboardState[letter] || []} boardCount={boardCount} />
                    ))}

                    <Button
                        variant="destructive"
                        className="flex-[1.5] h-[clamp(2.25rem,6vw,3.5rem)] p-0 rounded-md touch-manipulation focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        onClick={() => onKey('BACKSPACE')}
                    >
                        <Delete className="w-[clamp(0.9rem,3vw,1.3rem)] h-[clamp(0.9rem,3vw,1.3rem)]" />
                        <span className="sr-only">Backspace</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}

function KeyButton({ letter, onKey, states, boardCount }: { letter: string, onKey: (k: string) => void, states: TileStatus[], boardCount: number }) {
    const getColor = (status: TileStatus) => {
        switch (status) {
            case 'correct': return 'rgb(34 197 94)'; // green-500
            case 'present': return 'rgb(234 179 8)'; // yellow-500
            case 'absent': return 'rgb(107 114 128)'; // gray-500
            default: return 'hsl(var(--secondary))';
        }
    };

    const colors = states.map(status => getColor(status || 'empty'));

    if (boardCount === 1) {
        return (
            <Button
                variant="secondary"
                className={cn(
                    "flex-1 h-[clamp(2.25rem,6vw,3.5rem)] p-0",
                    "text-[clamp(0.85rem,2.4vw,1.4rem)] font-bold rounded-md shadow-sm touch-manipulation",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                )}
                style={{ backgroundColor: colors[0] }}
                onClick={() => onKey(letter)}
            >
                {letter}
            </Button>
        );
    }

    return (
        <div className="flex-1 h-[clamp(2.25rem,6vw,3.5rem)] relative rounded-md overflow-hidden">
            {boardCount === 2 && (
                <>
                    <div className="absolute inset-0 w-1/2" style={{ backgroundColor: colors[0] }} />
                    <div className="absolute inset-0 w-1/2 left-1/2" style={{ backgroundColor: colors[1] }} />
                </>
            )}
            {boardCount === 4 && (
                <>
                    <div className="absolute inset-0 w-1/2 h-1/2" style={{ backgroundColor: colors[0] }} />
                    <div className="absolute inset-0 w-1/2 h-1/2 top-1/2" style={{ backgroundColor: colors[2] }} />
                    <div className="absolute inset-0 w-1/2 h-1/2 left-1/2" style={{ backgroundColor: colors[1] }} />
                    <div className="absolute inset-0 w-1/2 h-1/2 left-1/2 top-1/2" style={{ backgroundColor: colors[3] }} />
                </>
            )}
            <Button
                variant="ghost"
                className={cn(
                    "absolute inset-0 p-0",
                    "text-[clamp(0.85rem,2.4vw,1.4rem)] font-bold touch-manipulation",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    "hover:bg-transparent"
                )}
                onClick={() => onKey(letter)}
            >
                {letter}
            </Button>
        </div>
    );
}
