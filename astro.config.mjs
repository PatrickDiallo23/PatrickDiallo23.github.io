// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://diallofrancispatrick.com',
  // Content-Security-Policy <meta> on every page. Astro hashes its own inlined
  // scripts, so no 'unsafe-inline' for scripts. Styles keep 'unsafe-inline'
  // because Shiki (blog code blocks) writes inline styles.
  security: {
    csp: {
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "connect-src 'self' https://formspree.io https://cloudflareinsights.com",
        "form-action 'self' https://formspree.io",
        "base-uri 'self'",
        "object-src 'none'",
      ],
      styleDirective: { resources: ["'self'", "'unsafe-inline'"] },
      scriptDirective: { resources: ["'self'", "https://static.cloudflareinsights.com"] },
    },
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/tags/'),
    }),
  ],
  markdown: {
    // Leave mermaid fences as plain code; src/scripts/renderMermaid.ts draws them client-side.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
