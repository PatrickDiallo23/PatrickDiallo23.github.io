import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config/site';

export const GET: APIRoute = async () => {
  const experience = await getCollection('experience');
  const skills = await getCollection('skills');
  const certifications = await getCollection('certifications');
  const posts = (await getCollection('blog', (p) => !p.data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.tagline}`,
    '',
    '## Experience',
    ...experience.map((e) => `- [${e.data.role} at ${e.data.company}](${site.url}/#experience)`),
    '',
    '## Skills',
    ...skills.map((s) => `- ${s.data.name}: ${s.data.items.map((i) => i.name).join(', ')}`),
    '',
    '## Certifications',
    ...certifications.map((c) => `- ${c.data.name} (${c.data.issuer}, ${c.data.issued})`),
    '',
    '## Blog',
    ...posts.map((p) => `- [${p.data.title}](${site.url}/blog/${p.id}/): ${p.data.summary}`),
    '',
    `## CV`,
    `- [Download CV](${site.url}${site.cv.file})`,
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain' } });
};
