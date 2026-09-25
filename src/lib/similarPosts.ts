export interface TaggedPost {
  slug: string;
  tags: string[];
}

/** Jaccard similarity of two tag sets: |intersection| / |union|. */
function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter((t) => setB.has(t)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}

/** Top N posts most similar to `post` by tag overlap, excluding itself, ties broken by input order. */
export function similarPosts<T extends TaggedPost>(post: T, all: T[], limit = 3): T[] {
  return all
    .filter((p) => p.slug !== post.slug)
    .map((p) => ({ post: p, score: jaccard(post.tags, p.tags) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
}
