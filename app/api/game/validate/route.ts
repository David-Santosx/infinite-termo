import { NextRequest, NextResponse } from 'next/server';
import words from '@/words/playable_words.json';
import { getSession } from '@/lib/session';

type LetterStatus = 'correct' | 'present' | 'absent';

interface ValidationResult {
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

function validateAttempt(attempt: string, secretWords: string[]): ValidationResult[] {
    const attemptNormalized = normalizeString(attempt.trim());

    // Verificar se a tentativa normalizada é uma palavra válida
    const isValidWord = normalizedWordsMap.has(attemptNormalized);

    // Usar a palavra acentuada para feedback se existir
    const attemptWord = normalizedWordsMap.get(attemptNormalized) || attemptNormalized;

    // Validar contra cada palavra secreta
    return secretWords.map(secret => {
        const secretNormalized = normalizeString(secret.trim());

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
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { attempt } = body;

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

        // Buscar palavras da sessão
        const session = await getSession();
        if (!session.currentGameWords || session.currentGameWords.length === 0) {
            return NextResponse.json(
                { error: 'Nenhuma palavra secreta encontrada na sessão' },
                { status: 400 }
            );
        }

        const results = validateAttempt(attempt, session.currentGameWords!);

        return NextResponse.json(results);

    } catch (error) {
        console.error('Erro ao validar tentativa:', error);
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
}