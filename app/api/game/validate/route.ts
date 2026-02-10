import { NextRequest, NextResponse } from 'next/server';
import words from '@/words/playable_words.json';
import { getSession, saveSession } from '@/lib/session';

type LetterStatus = 'correct' | 'present' | 'absent';

interface ValidationResult {
    boardId: number;
    rowIndex: number;
    word: string;
    valid: boolean;
    feedback: LetterStatus[];
}

// Função para normalizar string removendo acentos
function normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Criar mapa de palavras normalizadas para acentuadas
const normalizedWordsMap = new Map<string, string>();
words.forEach(word => {
    normalizedWordsMap.set(normalizeString(word), word);
});

function validateAttempt(attempt: string, secretWord: string): { word: string; valid: boolean; feedback: LetterStatus[] } {
    const attemptNormalized = normalizeString(attempt.trim());

    // Verificar se a tentativa normalizada é uma palavra válida
    const isValidWord = normalizedWordsMap.has(attemptNormalized);

    // Usar a palavra acentuada para feedback se existir
    const attemptWord = normalizedWordsMap.get(attemptNormalized) || attemptNormalized;

    const secretNormalized = normalizeString(secretWord.trim());

    // Inicializar feedback
    const feedback: LetterStatus[] = new Array(5).fill('absent');

    // Contar letras na palavra secreta normalizada
    const secretLetterCount: { [key: string]: number } = {};
    for (const letter of secretNormalized) {
        secretLetterCount[letter] = (secretLetterCount[letter] || 0) + 1;
    }

    // Primeiro, marcar letras corretas (verde)
    for (let i = 0; i < 5; i++) {
        if (attemptNormalized[i] === secretNormalized[i]) {
            feedback[i] = 'correct';
            secretLetterCount[attemptNormalized[i]]--;
        }
    }

    // Depois, marcar letras presentes mas na posição errada (amarelo)
    for (let i = 0; i < 5; i++) {
        if (feedback[i] === 'absent' && secretLetterCount[attemptNormalized[i]] > 0) {
            feedback[i] = 'present';
            secretLetterCount[attemptNormalized[i]]--;
        }
    }

    return {
        word: attemptWord,
        valid: isValidWord,
        feedback
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { attempt, boards } = body as { attempt: string; boards: { boardId: number; rowIndex: number }[] };

        if (!attempt) {
            return NextResponse.json(
                { error: 'Tentativa é obrigatória' },
                { status: 400 }
            );
        }

        if (attempt.length !== 5) {
            return NextResponse.json(
                { error: 'Tentativa deve ter 5 letras' },
                { status: 400 }
            );
        }

        if (!Array.isArray(boards) || boards.length === 0) {
            return NextResponse.json(
                { error: 'boards é obrigatório' },
                { status: 400 }
            );
        }

        // Buscar palavras da sessão
        const session = await getSession();

        // Reconstruir palavras se necessário (ex.: sessão com apenas índices)
        if ((!session.currentGameWords || session.currentGameWords.length === 0) && session.currentGameWordIndexes) {
            session.currentGameWords = session.currentGameWordIndexes.map(index => words[index]);
        }

        const wordCount = session.currentGameWords?.length ?? 0;

        if (!session.currentGameWords || wordCount === 0) {
            return NextResponse.json(
                { error: 'Nenhuma palavra secreta encontrada na sessão' },
                { status: 400 }
            );
        }

        // Validar boardIds recebidos
        for (const { boardId } of boards) {
            if (boardId === undefined || boardId < 0 || boardId >= wordCount) {
                return NextResponse.json(
                    { error: 'boardId inválido' },
                    { status: 400 }
                );
            }
        }

        // Ensure attempts is initialized
        if (!session.currentGameAttempts) {
            session.currentGameAttempts = [];
        }

        // Verificar se a tentativa já foi usada neste modo
        if (session.currentGameAttempts.includes(attempt.toUpperCase())) {
            return NextResponse.json(
                { error: 'Palavra já tentada anteriormente' },
                { status: 400 }
            );
        }

        // Calcular feedback por board mantendo identidade
        const results: ValidationResult[] = boards.map(({ boardId, rowIndex }) => {
            const { word, valid, feedback } = validateAttempt(attempt, session.currentGameWords![boardId]);
            return {
                boardId,
                rowIndex,
                word,
                valid,
                feedback
            };
        });

        // Se válida, adicionar à lista de tentativas do modo
        if (results.every(r => r.valid)) {
            session.currentGameAttempts.push(attempt.toUpperCase());
            await saveSession(session);
        }

        return NextResponse.json(results);

    } catch (error) {
        console.error('Erro ao validar tentativa:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}