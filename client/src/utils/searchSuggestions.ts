export const POPULAR_KEYWORDS = [
  "portfolio",
  "frontend",
  "backend",
  "full stack",
  "react",
  "node",
  "python",
  "javascript",
  "typescript",
  "developer",
  "engineer",
  "designer",
  "ui/ux",
  "remote",
  "devops",
  "cloud",
  "data scientist",
  "product manager",
  "intern",
  "software",
  "golang",
  "java",
  "nextjs",
  "docker",
  "kubernetes",
];

export const POPULAR_TOPICS = [
  "Frontend",
  "Backend",
  "Full Stack",
  "React",
  "Remote",
  "Python",
  "UI/UX",
  "DevOps",
];

export function getDidYouMeanSuggestion(
  query: string,
  corpus: string[] = POPULAR_KEYWORDS
): string | null {
  if (!query || query.trim().length < 2) return null;
  const q = query.toLowerCase().trim();

  // If already exact match in corpus, no typo correction needed
  if (corpus.includes(q)) return null;

  let bestMatch: string | null = null;
  let minDistance = Infinity;

  for (const word of corpus) {
    const w = word.toLowerCase();

    // Direct startsWith / endsWith typo heuristic
    if (w.length >= 4 && (w.startsWith(q) || q.startsWith(w))) {
      return word;
    }

    const dist = levenshteinDistance(q, w);
    const threshold = Math.max(2, Math.floor(w.length / 3));

    if (dist < minDistance && dist <= threshold) {
      minDistance = dist;
      bestMatch = word;
    }
  }

  return bestMatch;
}

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

