# Portfolio architecture overview: app structure and runtime

All paths relative to `C:\Users\FDiallo\Desktop\Desktop\portofolio-commit` (root). Source = local files (no web sources). Line refs are from files read this session.

## 1. Directory layout (annotated file tree)

### Takeaway
Single-package static Astro 7 site (no framework islands, no SSR adapter). Content lives in `src/content/**` validated by Zod collections; one config object `src/config/site.ts` drives all pages; all interactivity is small vanilla-TS `<script>` blocks.

### Cited Findings
```
/ (root)
  package.json              scripts + deps (see Q5)
  astro.config.mjs          site URL, CSP, mdx + sitemap integrations, Shiki themes
  tsconfig.json             extends astro/tsconfigs/strict; include .astro/types.d.ts + src/**/*; exclude dist,node_modules. No paths aliases
  vitest.config.ts          vitest include: src/**/*.test.ts
  CNAME                     "diallofrancispatrick.com" (duplicate of public/CNAME)
  CLAUDE.md, AGENTS.md      identical Astro dev guidance (astro dev --background; docs links)
  README.md                 human docs (features, structure, "make it yours", content model, testing)
  PORTFOLIO-PLAN.md, PORTFOLIO-PLAN-v2.md   untracked planning docs
  LICENSE, .gitignore (dist/, .astro/, node_modules/, logs...)
  .github/workflows/deploy.yml   CI build+test, deploy to GitHub Pages
  .vscode/{extensions,launch}.json
  graphify-out/             knowledge graph (GRAPH_REPORT.md, graph.json, graph.html, cache, manifest.json) - generated, untracked
  reports/, research_notes/, .impeccable/, .superpowers/, .playwright-mcp/, .claude/   tooling dirs (not app code)
public/                     copied verbatim to dist/
  CNAME                     custom domain for GitHub Pages
  favicon.svg, og-default.svg   icon + default OG image (BaseLayout references /og-default.svg)
  theme-init.js             pre-paint theme script (localStorage mode/accent/show-details -> data-* attrs on <html>); same-origin so CSP needs no hash
  cv/Francis-Patrick_Diallo_CV_2026_latest.pdf   downloadable CV (site.cv.file)
  images/diagram-canary.svg  image used by canary blog post
src/
  assets/profile.jpg        portrait; picked up by SectionAbout via import.meta.glob
  config/site.ts            single `site` object (name, role, tagline, url, sections[], cv, contact.formspreeId, socials, analytics, defaults...). `as const`; exports TintKey, Site types
  content.config.ts         6 collections (experience, projects, education, certifications, skills, blog)
  content/
    blog/*.mdx (3)          canary-deploys-that-roll-back-themselves, grounding-an-assistant-in-docs-that-change, what-a-data-pipeline-test-actually-needs
    experience/*.md (3)     dataloom, globex-bank, northwind-labs
    projects/*.md (2)       docs-assistant, pipeline-canary
    education.yaml, certifications.yaml, skills.yaml   loaded with file() loader
  layouts/BaseLayout.astro  only layout
  components/               Header, Footer, SectionAbout/Skills/Experience/Projects/Education/BlogPreview/Contact (.astro)
  pages/                    routes (see Q2)
  lib/jsonld.ts, readingTime.ts, similarPosts.ts, lib.test.ts   pure helpers + the only tests
  styles/tokens.css         global design tokens (270 lines), imported once in BaseLayout
```
Sources: `git ls-files` output; `package.json`; `tsconfig.json`; `vitest.config.ts`; `public/theme-init.js`; `src/config/site.ts`; `src/content.config.ts`.

- Content schemas (`src/content.config.ts`): `tintEnum` = crimson|cobalt|emerald|amber; experience/projects use `glob()` on `**/*.md`; blog uses `glob()` on `**/*.mdx`; education/certifications/skills use `file()` YAML. Constraints: `plain` <= 220 chars; blog `summary` <= 160; dates `YYYY-MM` regex; blog `date` coerced Date, `draft` default false, `cover: image().optional()`; projects `featured` default false, `image: image().optional()`.
- Exported: `collections = { experience, projects, education, certifications, skills, blog }`.

### Inferences
- `CLAUDE.md` and `AGENTS.md` are duplicated content; only `astro dev --background` is project-specific.

### Gaps
- Did not open the individual content files' bodies (only heads) nor tokens.css in full (only first lines and the tail).

## 2. Routes, layout, components, per-page composition

### Takeaway
9 page files -> static routes: `/`, `/cv/`, `/404`, `/blog/`, `/blog/[slug]/`, `/blog/tags/[tag]/`, `/projects/[slug]/`, plus 4 text/XML endpoints. Every HTML page = `BaseLayout` with `<Header slot="header">`, body content, `<Footer slot="footer">`. Only the homepage composes Section* components.

### Cited Findings
**Layout** `src/layouts/BaseLayout.astro`
- Props: `title: string; description: string; ogImage?: string; jsonLd?: object|object[]; noindex?: boolean` (default false) (lines 10-16).
- Imports fonts (`@fontsource-variable/atkinson-hyperlegible-next`, `...-mono`, `cormorant-garamond` + `wght-italic.css`) and `../styles/tokens.css`, `site` (lines 2-8).
- Head: canonical from `new URL(Astro.url.pathname, site.url)`; page title `"{title} — {site.name}"` unless title equals site.name; OG/Twitter meta; `theme-color #1D4ED8`; favicon; RSS alternate `/rss.xml`; `text/plain` alternate `/llms.txt`; HTML comment addressed to LLM crawlers (via `Fragment set:html`); JSON-LD `<script type=application/ld+json>` per entry (with `<` escaped to `\u003c`); `<script is:inline src="/theme-init.js">`; conditional Cloudflare Web Analytics beacon (`site.analytics.provider==='cloudflare' && id`).
- Body: skip link `#main`, `<slot name="header">`, `<main id="main"><slot/></main>`, `<slot name="footer">`. `<html lang="en">` hardcoded.

**Components** (all `.astro`, none take props; all read `site` or content collections directly)
| Component | Data source | Used by | Notes |
|---|---|---|---|
| `Header.astro` | `site.sections` (visible), `site.cv` | every page (index, 404, cv, blog/index, blog/[slug], blog/tags/[tag], projects/[slug]) | sticky "station" nav of `#section` anchors, `#details-toggle`, theme/accent menu, CV download link. Nav links are hash anchors (`#about`...) so only meaningful on `/`. Script: IntersectionObserver marks `aria-current`/`.visited`; details toggle sets `data-details` and opens all `details.tech-details`, persisted in `localStorage['show-details']`; theme menu persists `mode`/`accent`, uses `document.startViewTransition` on mode change (respects reduced-motion) |
| `Footer.astro` | `site.name`, build date (`new Date()` at build) | every page | links `/blog/` (target=_blank) and `/cv/`; `#back-to-top` button (script: rAF-throttled scroll listener, shown after 1 viewport) |
| `SectionAbout.astro` | `site`, `import.meta.glob('../assets/profile.{jpg,jpeg,png,webp,avif,svg}')` | index | `astro:assets` `<Image>` 176x176, densities [1,2] for raster; SVG sorted last so a photo wins |
| `SectionSkills.astro` | `skills` collection | index | grouped `plate` cards, level labels daily/comfortable/learning |
| `SectionExperience.astro` | `experience` collection, `render(job)` | index | sorted by `start` desc; `<ol class="transit-line">`; each job has `<details class="tech-details">` with stack + rendered markdown body |
| `SectionProjects.astro` | `projects` collection | index | category chips (script filters `li[data-category]` via `hidden`); cards link `/projects/{id}/` with `target=_blank`; `<Image>` 480x270 lazy |
| `SectionEducation.astro` | `education`, `certifications` | index | certs expired logic vs `new Date()` YYYY-MM |
| `SectionBlogPreview.astro` | `blog` collection (drafts hidden in PROD), `readingTime` | index | 3 latest posts, links `/blog/{id}/` target=_blank, "View all posts" `/blog/` |
| `SectionContact.astro` | `site.contact`, `site.socials`, `site.availability` | index | Formspree form (`https://formspree.io/f/{formspreeId}`), honeypot `_gotcha`, inline validation script + `fetch` POST JSON; fallback "being set up" note if formspreeId empty; inline SVG icons for github/linkedin/goodreads |

**Pages** (`src/pages/`)
- `index.astro` -> `/`. Imports all Section* + Header/Footer. Fetches `skills` collection for `personJsonLd(knowsAbout)`. `componentMap` maps section id -> component; renders `site.sections.filter(visible)` in config order (`<Comp />`). Hero (h1, role, motto, interests pills, "Currently" block that hides rows that are empty or start with `TODO`, CV download + `#contact` buttons) is inline in page with scoped CSS and `hero-enter` animation.
- `cv.astro` -> `/cv/`. Printable CV from experience/education/certifications/skills collections; title "CV"; `.no-print` action; print CSS hides header/footer (tokens.css `@media print`).
- `404.astro` -> `/404.html`. `noindex`; lists 3 latest posts + tag links (uses `getCollection('blog', p=>!p.data.draft)`; computes `tags` and `allTags` redundantly).
- `blog/index.astro` -> `/blog/`. All posts (drafts excluded in PROD via `import.meta.env.PROD`), tag chip filter script (`data-tag`, `li[data-tags]`).
- `blog/[slug].astro` -> `/blog/{post.id}/`. `getStaticPaths` from `blog` collection (drafts excluded in PROD), props `{post}`. Uses `render(post)` -> `Content`, `headings` (h2/h3 TOC); prev/next by date; `similarPosts()` (Jaccard tag overlap, limit 3); `readingTime`; JSON-LD `blogPostingJsonLd` + `breadcrumbJsonLd`; cover `<Image>` 960x540 eager/fetchpriority high. Client script: heading `#` anchors, copy-button wrapper for every `.prose pre`, IntersectionObserver TOC highlighting, native `<dialog>` image lightbox with download, Share button (Web Share API -> clipboard fallback).
- `blog/tags/[tag].astro` -> `/blog/tags/{tag}/`. `getStaticPaths` over unique tags, props `{posts}`. No scripts. Excluded from sitemap (`astro.config.mjs` filter on `/tags/`).
- `projects/[slug].astro` -> `/projects/{project.id}/`. `getStaticPaths` returns `[]` if `site.sections` projects entry not visible; else all projects. Renders markdown body, image, repo/live links.
- Endpoints: `rss.xml.ts` (`@astrojs/rss`, non-draft posts, always drafts excluded), `llms.txt.ts` (experience, skills, certifications, blog links, CV, contact), `llms-full.txt.ts` (experience + blog full markdown bodies), `robots.txt.ts` (allow all, points at `/sitemap-index.xml`). All `GET: APIRoute`, `text/plain` except rss.

**Composition trees**
- `/`: BaseLayout > [Header(slot header), (hero div), Section* in site.sections order, Footer(slot footer)]
- `/cv/`, `/404`, `/blog/`, `/blog/[slug]/`, `/blog/tags/[tag]/`, `/projects/[slug]/`: BaseLayout > [Header, page-specific div/article, Footer]

**Lib** (`src/lib/`): `jsonld.ts` (personJsonLd, breadcrumbJsonLd, blogPostingJsonLd; read `site`), `readingTime.ts` (200 wpm, strips fenced code, min 1), `similarPosts.ts` (`similarPosts<T extends TaggedPost>(post, all, limit=3)`), `lib.test.ts` (vitest tests for readingTime and similarPosts only).

### Inferences
- Draft handling is inconsistent: blog pages/preview use `!PROD || !draft`, but `404.astro`, `rss.xml.ts`, `llms*.txt.ts` always exclude drafts. Harmless in production.
- `blog` uses `.mdx` glob (needs `@astrojs/mdx`); experience/projects use `.md`.

### Gaps
- Scoped `<style>` blocks and `tokens.css` mid-section not reviewed in detail.

## 3. Client-side JS, integrations, build/render model

### Takeaway
Fully static (`output` default = `static`, no adapter) with zero UI-framework islands; all client JS is bundled vanilla TS from `<script>` tags plus one public inline-tag file. Astro CSP feature hashes scripts. Cross-page animation uses native CSS view transitions, not Astro's ClientRouter.

### Cited Findings
- `astro.config.mjs`: `site: 'https://diallofrancispatrick.com'`; no `output`, `adapter`, `base`, or `trailingSlash` set (defaults: static output). Integrations: `mdx()`, `sitemap({ filter: page => !page.includes('/tags/') })`. `markdown.shikiConfig.themes = { light: 'github-light', dark: 'github-dark' }`.
- CSP via `security.csp` (Astro built-in, emitted as `<meta>` on every page): directives `default-src 'self'`, `img-src 'self' data:`, `connect-src 'self' https://formspree.io https://cloudflareinsights.com`, `form-action 'self' https://formspree.io`, `base-uri 'self'`, `object-src 'none'`; `styleDirective` allows `'self' 'unsafe-inline'` (Shiki inline styles); `scriptDirective` allows `'self' https://static.cloudflareinsights.com`. Comment in config says Astro hashes its own inlined scripts.
- No React/Vue/Svelte, no `client:*` directives: grep of `client:` not performed exhaustively but `package.json` has no framework integrations (deps: astro, @astrojs/mdx, @astrojs/rss, @astrojs/sitemap, 3 fontsource packages; dev: @astrojs/check, typescript, vitest).
- Client scripts (all `<script>` in .astro, bundled by Astro): Header.astro (nav observer, details toggle, theme menu, view transition), Footer.astro (back to top), SectionProjects (filter), SectionContact (form validation + fetch to Formspree), blog/index (tag filter), blog/[slug] (anchors, copy, TOC, lightbox, share). Plus `public/theme-init.js` (is:inline, blocking in head) and Cloudflare beacon `https://static.cloudflareinsights.com/beacon.min.js` (deferred, external).
- View transitions: `grep ClientRouter|transition:` in `src` found none; `src/styles/tokens.css` has `@view-transition { navigation: auto; }` (cross-document CSS view transitions) and Header calls `document.startViewTransition` for theme change.
- Theming: `tokens.css` `:root` variables; dark via `:root[data-mode='dark']` and `@media (prefers-color-scheme: dark)` for `:root:not([data-mode=light|dark])`; accent via `:root[data-accent=crimson|cobalt|emerald|amber]`; `prefers-contrast: more`, `prefers-reduced-motion`, `@media print` blocks; `html { scroll-behavior: smooth }`.
- Build-time data: `Footer.astro` "Last updated" = build date (`new Date().toISOString()` at build); `SectionEducation` computes cert expiry at build.
- Images: `astro:assets` `<Image>` with local imports (`profile.jpg`, schema `image()` for cover/project images) -> optimized at build (sharp default; not verified installed explicitly).
- `site.analytics`: Cloudflare Web Analytics token set in `src/config/site.ts` (lines 73-78).

### Inferences
- Because `security.csp` is used, any new inline script must be in `<script>` (hashed) or in `public/`; external hosts need adding to `astro.config.mjs` directives.

### Gaps
- Did not run `astro build` to confirm output listing or CSP behavior.

## 4. Deployment target and workflow

### Takeaway
GitHub Pages at custom domain diallofrancispatrick.com, deployed by GitHub Actions on push to `main`.

### Cited Findings
- `.github/workflows/deploy.yml`: triggers `push` to main, `pull_request`, `workflow_dispatch`; permissions contents:read, pages:write, id-token:write; concurrency group `pages` with cancel-in-progress. Job `build` (ubuntu-latest): checkout@v4, setup-node@v4 (node 22, npm cache), `npm ci`, `npm run build`, `npm test`, then `actions/upload-pages-artifact@v3` (path `./dist`) only on push to main. Job `deploy` (needs build, main+push only) uses `actions/deploy-pages@v4`, environment `github-pages`.
- `CNAME` and `public/CNAME` both contain `diallofrancispatrick.com`; `site.ts` line 14 comment says `site.url` must match `public/CNAME`. Repo remote (git log): `PatrickDiallo23.github.io`.
- Node requirement: `package.json` `engines.node >=22.12.0`.

### Inferences
- PRs run build + tests but do not deploy.

### Gaps
- No CI for lint; no e2e tests.

## 5. Commands, conventions, TypeScript

### Takeaway
`npm run dev|build|preview|test`; build runs type-check first. Strict TS, relative imports (no aliases), PascalCase `.astro` components with `Section` prefix, lib in camelCase files.

### Cited Findings
- `package.json` scripts: `dev` = `astro dev`; `build` = `astro check && astro build`; `preview` = `astro preview`; `astro` = `astro`; `test` = `vitest run`. `"type": "module"`, `allowScripts: {esbuild: true}`. Versions: astro ^7.3.5, typescript ^6.0.3, vitest ^3.2.4, @astrojs/mdx ^8.0.2, @astrojs/check ^0.9.10.
- Project CLAUDE.md/AGENTS.md: start dev with `astro dev --background`; manage with `astro dev stop|status|logs`.
- `tsconfig.json`: extends `astro/tsconfigs/strict`; no `paths`/baseUrl aliases; all imports are relative (`../config/site`, `../../lib/...`).
- Conventions observed: components `PascalCase.astro`, homepage sections named `Section<Name>`; pages use `[slug].astro` / `[tag].astro`; lib files camelCase `.ts` with co-located tests `*.test.ts` under `src`; content ids used as URL slugs (`post.id`, `project.id`); design tokens only in `tokens.css` ("no component should hardcode a color, font size, or spacing" - header comment); scoped `<style>` in each component/page; accessibility idioms (aria-labelledby on sections, 44px targets, skip link, `role="list"`); `data-tint` attribute for category colors.
- Tests: only `src/lib/lib.test.ts` (readingTime x3, similarPosts x3).
- Git state at start: many modified tracked files (site.ts, content.config.ts, layouts, pages, components) and untracked PORTFOLIO-PLAN*.md, graphify-out/ (from task context gitStatus).
- graphify-out/GRAPH_REPORT.md (2026-09-29): 272 nodes, 359 edges, 28 communities; god nodes `Site` (13 edges), `astro`, etc.; consistent with `site.ts` being the central hub.

### Inferences
- Adding a new homepage section requires: component in `src/components`, entry in `site.sections`, and an entry in `componentMap` in `src/pages/index.astro`.

### Gaps
- README's documented structure/commands not diffed against actual files.
