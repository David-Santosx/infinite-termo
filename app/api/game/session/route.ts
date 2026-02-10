import { NextRequest, NextResponse } from 'next/server';
import { getSession, saveSession } from '@/lib/session';
import { GameMode } from '@/types/Game';

const GAME_MODES: GameMode[] = ['termo', 'dueto', 'quarteto'];

export async function GET() {
    const session = await getSession();
    return NextResponse.json(session);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, mode } = body;

        const session = await getSession();

        switch (action) {
            case 'complete':
                if (mode && GAME_MODES.includes(mode as GameMode)) {
                    const completedMode = mode as GameMode;

                    // Adicionar aos níveis completados se não estiver já
                    if (!session.completedLevels.includes(completedMode)) {
                        session.completedLevels.push(completedMode);
                    }

                    // Avançar para o próximo nível
                    const currentIndex = GAME_MODES.indexOf(completedMode);
                    if (currentIndex < GAME_MODES.length - 1) {
                        session.currentLevel = GAME_MODES[currentIndex + 1];
                    } else {
                        // Completou todos os níveis, recomeçar
                        session.currentLevel = 'termo';
                        session.completedLevels = [];
                    }

                    session.totalGames++;
                    session.wins++;
                    // Limpar índices do jogo anterior
                    session.currentGameWordIndexes = undefined;
                    session.currentGameAttempts = undefined;
                }
                break;

            case 'fail':
                // Reset para termo
                session.currentLevel = 'termo';
                session.completedLevels = [];
                session.totalGames++;
                session.losses++;
                // Limpar índices do jogo anterior
                session.currentGameWordIndexes = undefined;
                session.currentGameAttempts = undefined;
                break;

            case 'reset':
                // Reset completo
                session.currentLevel = 'termo';
                session.completedLevels = [];
                session.totalGames = 0;
                session.wins = 0;
                session.losses = 0;
                session.currentGameWordIndexes = undefined;
                session.currentGameAttempts = undefined;
                break;

            default:
                return NextResponse.json(
                    { error: 'Ação inválida. Use: complete, fail ou reset' },
                    { status: 400 }
                );
        }

        await saveSession(session);
        return NextResponse.json(session);

    } catch (error) {
        console.error('Erro ao atualizar sessão:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}