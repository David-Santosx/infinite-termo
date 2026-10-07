import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const WORD_LENGTH = 5;
const ALLOWED = /^[a-záàâãéêíóôõúüç]+$/;

const normalize = (word: string) =>
  word.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

interface Input {
  answers: string[];
  lexicon: string[];
  banned: string[];
}

export function buildWordLists({ answers, lexicon, banned }: Input) {
  const bannedSet = new Set(banned.map(normalize));
  const rejected: string[] = [];
  const answerForms = new Map<string, string>();

  for (const raw of answers) {
    const word = raw.trim().normalize("NFC");
    const key = normalize(word);
    if (!ALLOWED.test(word) || key.length !== WORD_LENGTH || bannedSet.has(key) || answerForms.has(key)) {
      rejected.push(word);
      continue;
    }
    answerForms.set(key, word);
  }

  const guessForms = new Map(answerForms);
  for (const raw of lexicon) {
    const word = raw.trim().normalize("NFC");
    const key = normalize(word);
    if (ALLOWED.test(word) && key.length === WORD_LENGTH && !guessForms.has(key)) {
      guessForms.set(key, word);
    }
  }

  return {
    answers: [...answerForms.values()],
    guesses: [...guessForms.values()].sort((a, b) => normalize(a).localeCompare(normalize(b))),
    rejected,
  };
}

function readList(path: string) {
  return readFileSync(path, "utf8").split("\n").map((l) => l.trim()).filter(Boolean);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const result = buildWordLists({
    answers: readList(join(root, "data/words/answers.txt")),
    lexicon: readList(join(root, "data/words/lexico.txt")),
    banned: readList(join(root, "data/words/negativas.txt")),
  });
  const out = join(root, "features/game/server/data");
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, "answers.json"), JSON.stringify(result.answers) + "\n");
  writeFileSync(join(out, "guesses.json"), JSON.stringify(result.guesses) + "\n");
  console.log(`answers: ${result.answers.length} · guesses: ${result.guesses.length}`);
  if (result.rejected.length) console.log(`rejected answers: ${result.rejected.join(", ")}`);
}
