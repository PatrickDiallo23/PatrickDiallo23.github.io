const WORDS_PER_MINUTE = 200;

/** Reading time in whole minutes (minimum 1) from raw Markdown/MDX body text. */
export function readingTime(body: string): number {
  const words = body
    .replace(/```[\s\S]*?```/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
