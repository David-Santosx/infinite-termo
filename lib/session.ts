import { cookies } from 'next/headers';
import { GameSession } from '@/types/Game';
import words from '@/words/playable_words.json';

export async function getSession(): Promise<GameSession> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('game_session')?.value;

  if (!sessionCookie) {
    return {
      currentLevel: 'termo',
      completedLevels: [],
      totalGames: 0,
      wins: 0,
      losses: 0,
    };
  }

  try {
    const parsed = JSON.parse(sessionCookie) as GameSession;
    // Converter índices em palavras se existirem
    if (parsed.currentGameWordIndexes && Array.isArray(parsed.currentGameWordIndexes)) {
      parsed.currentGameWords = parsed.currentGameWordIndexes.map(index => words[index]);
    }
    return parsed;
  } catch {
    return {
      currentLevel: 'termo',
      completedLevels: [],
      totalGames: 0,
      wins: 0,
      losses: 0,
    };
  }
}

export async function saveSession(session: GameSession): Promise<void> {
  const cookieStore = await cookies();
  
  // Criar cópia da sessão
  const sessionToSave = { ...session };
  
  // Converter palavras em índices se existirem
  if (sessionToSave.currentGameWords && Array.isArray(sessionToSave.currentGameWords)) {
    sessionToSave.currentGameWordIndexes = sessionToSave.currentGameWords.map(word => words.indexOf(word));
    delete sessionToSave.currentGameWords; // Não salvar as palavras em texto plano
  }
  
  cookieStore.set('game_session', JSON.stringify(sessionToSave), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 30, // 30 dias
  });
}