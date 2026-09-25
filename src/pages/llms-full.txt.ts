import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

async function bodyText(entry: { body?: string }) {
  return entry.body ?? '';
}

export const GET: APIRoute = async () => {
  const experience = await getCollection('experience');
  const posts = (await getCollection('blog', (p) => !p.data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const parts: string[] = [`# ${site.name}\n\n${site.tagline}\n`];

  parts.push('## Experience\n');
  for (const job of experience) {
    parts.push(`### ${job.data.role} at ${job.data.company} (${job.data.start} – ${job.data.end ?? 'present'})`);
    parts.push(job.data.plain);
    parts.push(await bodyText(job));
    parts.push('');
  }

  parts.push('## Blog\n');
  for (const post of posts) {
    parts.push(`### ${post.data.title} (${post.data.date.toISOString().slice(0, 10)})`);
    parts.push(post.data.summary);
    parts.push(await bodyText(post));
    parts.push('');
  }

  return new Response(parts.join('\n'), { headers: { 'Content-Type': 'text/plain' } });
};
