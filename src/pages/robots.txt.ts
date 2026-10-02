import type { APIRoute } from 'astro';
import { site } from '../config/site';

export const GET: APIRoute = () => {
  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# AI agents and LLM crawlers: welcome. A plain-text summary of this site lives at',
    `# ${new URL('/llms.txt', site.url)} (full text: ${new URL('/llms-full.txt', site.url)}).`,
    '',
    `Sitemap: ${new URL('/sitemap-index.xml', site.url)}`,
    `Sitemap: ${new URL('/sitemap-0.xml', site.url)}`,
    '',
  ].join('\n');
  return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
};
