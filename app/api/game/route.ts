import { NextRequest, NextResponse } from 'next/server';
import words from '@/words/playable_words.json';
import { getSession, saveSession } from '@/lib/session';
import { GameMode } from '@/types/Game';

const MODES: Record<GameMode, number> = {
    termo: 1,
    dueto: 2,
    quarteto: 4
};

function getRandomWords(wordList: string[], count: number): string[] {
    const result: string[] = [];

    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * wordList.length);
        result.push(wordList[index]);
    }

    return result;
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        let modeParam = searchParams.get('mode');

        // Buscar sessão atual
        const session = await getSession();

        // Se não especificar modo, usar o nível atual da sessão
        if (!modeParam) {
            modeParam = session.currentLevel;
        }

        if (!(modeParam in MODES)) {
            return NextResponse.json(
                { error: 'Modo inválido. Use: termo, dueto ou quarteto' },
                { status: 400 }
            );
        }

        const mode = modeParam as GameMode;
        const wordCount = MODES[mode];

        if (words.length < wordCount) {
            return NextResponse.json(
                { error: 'Não há palavras suficientes disponíveis' },
                { status: 500 }
            );
        }

        // Verificar se já existem índices na sessão para o modo atual
        let selectedWords: string[];
        let selectedIndexes: number[];

        if (session.currentGameWordIndexes &&
            session.currentGameWordIndexes.length === wordCount) {
            // Usar índices da sessão se existirem e tiverem o tamanho correto
            selectedIndexes = session.currentGameWordIndexes;
            selectedWords = selectedIndexes.map(index => words[index]);
        } else {
            // Gerar novas palavras e salvar índices na sessão
            selectedIndexes = [];
            for (let i = 0; i < wordCount; i++) {
                const index = Math.floor(Math.random() * words.length);
                selectedIndexes.push(index);
            }
            selectedWords = selectedIndexes.map(index => words[index]);
            session.currentGameWordIndexes = selectedIndexes;
            await saveSession(session);
        }

        return NextResponse.json({
            mode,
            words: selectedWords,
            count: selectedWords.length
        });

    } catch (error) {
        console.error('Erro ao buscar palavras:', error);

        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}
