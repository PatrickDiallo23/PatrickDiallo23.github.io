import { describe, it, expect } from 'vitest';
import { readingTime } from './readingTime';
import { similarPosts } from './similarPosts';

describe('readingTime', () => {
  it('rounds to whole minutes at 200 words/minute', () => {
    expect(readingTime(Array(400).fill('word').join(' '))).toBe(2);
  });

  it('is at least 1 minute for very short text', () => {
    expect(readingTime('a few words')).toBe(1);
  });

  it('strips fenced code blocks before counting', () => {
    const withCode = `${Array(200).fill('word').join(' ')}\n\`\`\`\n${Array(1000).fill('code').join(' ')}\n\`\`\``;
    expect(readingTime(withCode)).toBe(1);
  });
});

describe('similarPosts', () => {
  const posts = [
    { slug: 'a', tags: ['ai', 'python'] },
    { slug: 'b', tags: ['ai', 'devops'] },
    { slug: 'c', tags: ['java'] },
    { slug: 'd', tags: ['ai', 'python', 'devops'] },
  ];

  it('ranks by tag overlap, excluding the post itself', () => {
    const result = similarPosts(posts[0], posts);
    expect(result.map((p) => p.slug)).toEqual(['d', 'b']);
  });

  it('excludes posts with zero overlap', () => {
    const result = similarPosts(posts[0], posts);
    expect(result.find((p) => p.slug === 'c')).toBeUndefined();
  });

  it('respects the limit', () => {
    const result = similarPosts(posts[0], posts, 1);
    expect(result).toHaveLength(1);
  });
});
