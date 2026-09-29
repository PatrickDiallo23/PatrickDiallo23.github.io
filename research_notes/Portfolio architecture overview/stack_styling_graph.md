# Portfolio stack, styling system, graphify graph, plans and gotchas

(Local codebase research; all sources are repo files under C:\Users\FDiallo\Desktop\Desktop\portofolio-commit, cited by relative path. No web sources used.)

## 1. Tech stack and dependencies

### Takeaway
Static Astro 7 site, TypeScript, plain CSS (no Tailwind, no UI framework), npm, deployed to GitHub Pages via Actions on a custom domain.

### Cited Findings
- package.json: name `portfolio`, version 0.0.1, `"type": "module"`, `engines.node >=22.12.0`. — `package.json`
- Scripts: `dev`=`astro dev`; `build`=`astro check && astro build`; `preview`=`astro preview`; `astro`; `test`=`vitest run`. — `package.json`
- dependencies: `astro ^7.3.5`, `@astrojs/mdx ^8.0.2`, `@astrojs/rss ^4.0.19`, `@astrojs/sitemap ^3.7.4`, `@fontsource-variable/atkinson-hyperlegible-mono ^5.3.0`, `@fontsource-variable/atkinson-hyperlegible-next ^5.3.0`, `@fontsource-variable/cormorant-garamond ^5.3.0`. — `package.json`
- devDependencies: `@astrojs/check ^0.9.10`, `typescript ^6.0.3`, `vitest ^3.2.4`. Also `allowScripts: { esbuild: true }`. — `package.json`
- Lockfile manager: npm (`package-lock.json`; CI uses `npm ci`, `cache: npm`). Note plan v2 said pnpm; actually npm used (graph node "npm used instead of pnpm"). — `.github/workflows/deploy.yml`, `PORTFOLIO-PLAN-v2.md`
- tsconfig extends `astro/tsconfigs/strict`. Vitest config includes only `src/**/*.test.ts`; single test file `src/lib/lib.test.ts`. — `vitest.config.ts`, `src/lib/`
- astro.config.mjs: `site: 'https://diallofrancispatrick.com'`; integrations `mdx()` and `sitemap({filter: exclude '/tags/'})`; Shiki dual themes `github-light`/`github-dark`; built-in `security.csp` (see gotchas). No `base`. — `astro.config.mjs`
- Source layout: `src/components` (Header, Footer, Section{About,Skills,Experience,Projects,Education,BlogPreview,Contact}), `src/layouts/BaseLayout.astro`, `src/pages` (index, 404, cv, blog/, projects/, llms.txt.ts, llms-full.txt.ts, robots.txt.ts, rss.xml.ts), `src/lib` (jsonld.ts, readingTime.ts, similarPosts.ts, lib.test.ts), `src/config/site.ts` (single config: identity, sections order/visibility, cv, contact, socials, analytics), `src/content.config.ts` (Zod schemas for experience, projects, education, certifications, skills, blog), `src/content/*`, `src/assets/profile.jpg`. — directory listing
- Content model: content changes go through `site.ts` + `src/content/**`; schema failures fail the build (e.g. `plain` max 220 chars, `summary` max 160, dates YYYY-MM). — `src/content.config.ts`, `README.md`
- CI: `.github/workflows/deploy.yml` — on push to main/PR/manual; Node 22; `npm ci`, `npm run build` (includes astro check), `npm test`; artifact upload + `actions/deploy-pages@v4` only on main push; concurrency group `pages` with cancel-in-progress. — `.github/workflows/deploy.yml`
- Project instructions: dev server via `astro dev --background`; manage with `astro dev stop|status|logs`. — `CLAUDE.md` (AGENTS.md mirrors it)

### Inferences
- Plan v2's stack list (astro-icon, Pagefind, satori/resvg OG images, Playwright, axe, prettier, lint-staged, Lighthouse CI) is NOT in package.json, so those are unimplemented/dropped (see section 5).

### Gaps
- Did not run `npm ls`; installed versions in `node_modules` not verified (ranges only).

## 2. Styling and design system

### Takeaway
Plain CSS. One global `src/styles/tokens.css` (custom properties + base element styles + a few shared classes) imported in BaseLayout; 16 files use scoped `<style>` blocks consuming `var(--*)`. No Tailwind.

### Cited Findings
- Tailwind: none (no dependency; grep of package.json). Plan states "Plain CSS: tokens.css plus scoped styles" and "No React/Vue/Svelte". — `PORTFOLIO-PLAN-v2.md` section 2, `package.json`
- Only stylesheet file: `src/styles/tokens.css` (~5.9 KB). Imported in `src/layouts/BaseLayout.astro` line 7, after the font imports. — `src/layouts/BaseLayout.astro`
- Header comment rule: "no component should ever hardcode a color, font size, or spacing value." Component usage counts (var refs across .astro): `--space-3` 36, `--ink-muted` 33, `--text-sm` 30, `--accent` 29, `--space-2` 28, `--rule` 23, `--radius` 23. Few hardcoded hex values in src (`#000`, `#fff` print, one `#1D4ED8`). — `src/styles/tokens.css`, grep of `src/**/*.astro`
- Color tokens (light): `--bg #f4f6f9`, `--surface #fff`, `--ink #132033`, `--ink-muted #4a5568`, `--rule #d5dbe3`; tints `--tint-crimson #c8102e`, `--tint-cobalt #1d4ed8`, `--tint-emerald #047857`, `--tint-amber #a34d06`; `--accent: var(--tint-cobalt)` default.
- Dark: `--bg #0e1621`, `--surface #152131`, `--ink #e6edf5`, `--ink-muted #9fb0c3`, `--rule #26364a`, tints `#ff7a7a / #7ab0ff / #34d399 / #fbbf24`.
- Dark-mode mechanism: `:root[data-mode='dark']` explicit; `@media (prefers-color-scheme: dark)` applies to `:root:not([data-mode='light']):not([data-mode='dark'])` (system default); `color-scheme` set. Values are duplicated in the two dark blocks (must edit both). — `src/styles/tokens.css`
- Accent theming: `:root[data-accent='crimson|cobalt|emerald|amber']` sets `--accent`; category tint via `[data-tint='...']` exposing `--tint` to children. `prefers-contrast: more` sets `--rule` to `--ink-muted`. — `src/styles/tokens.css`
- No-flash theme: `public/theme-init.js` (same-origin `<script is:inline src>`, so CSP needs no hash) reads localStorage `mode`, `accent`, `show-details` and sets `data-mode`, `data-accent`, `data-details="open"` on `<html>`. — `public/theme-init.js`, `src/layouts/BaseLayout.astro`
- Typography tokens: `--font-body` Atkinson Hyperlegible Next; `--font-display` 'Cormorant Garamond Variable' (falls back to body); `--font-mono` Atkinson Hyperlegible Mono. Scale (ratio 1.25): `--text-sm 0.8rem`, `--text-base 1.125rem` (18px), `--text-md 1.25`, `--text-lg 1.563`, `--text-xl 1.953`, `--text-2xl 2.441`, `--text-3xl 3.052`. Body line-height 1.6; `p, li` max-width `--measure: 66ch`. h1/h2 use display font (weight now 900, uncommitted; was 600); h1 `clamp(2.5rem,8vw,4rem)`, h2 `clamp(2rem,5.5vw,2.8rem)`; h3/h4 use scale tokens, weight 750.
- Fonts are self-hosted via `@fontsource-variable/*` npm imports in BaseLayout (Cormorant also imports `wght-italic.css`); no CDN. The plan mentioned Astro Fonts API, but code uses fontsource. — `src/layouts/BaseLayout.astro`, `package.json`
- Spacing/layout tokens: `--space-1..6` = 0.5, 1, 1.5, 2, 3, 4.5rem; `--gutter clamp(1.25rem,5vw,2rem)`; `--radius 6px`; `--focus-ring` two-ring box-shadow.
- Shared classes in tokens.css: `.skip-link`, `.visually-hidden`, `.plate` (framed card, 2px top border in `--tint`/`--accent`; `a.plate` hover lift only under `(hover:hover)`), section divider (`main > * + section::before/::after` hairline + fleuron U+2766 in `--accent`), `::selection`, print rules (hides header, footer, `.no-print`, `.back-to-top`), `@view-transition { navigation: auto }`, `prefers-reduced-motion` kill-switch, `html {scroll-behavior:smooth}`.
- Design intent ("Career line", transit-map with per-discipline colors Java/Python/DevOps/AI): tints map to those lines. Current visual has moved toward "classic typography" / parchment (commit e01d462 message; favicon now parchment monogram). — `PORTFOLIO-PLAN-v2.md` section 4, `git log`

### Inferences
- Tint names were renamed from plan's `--line-java/python/devops/ai` to `--tint-crimson/cobalt/emerald/amber` (content schemas use `tint` enum rather than `line`).
- An `h1, h2 {}` rule overlapping `h1, h2, h3, h4 {}` and `font-weight:900` typo-style spacing suggest minor tidy-up debt.

### Gaps
- Per-component scoped style details not enumerated; Header.astro theme/accent menu JS not read.

## 3. graphify knowledge graph (graphify-out/)

### Takeaway
Graph built 2026-09-29 covers 272 nodes / 359 edges / 28 communities from 54 files (~20.6k words); report itself says corpus fits in one context so the graph adds limited value. Mostly captures docs/content/config, not deep code.

### Cited Findings
- Files in graphify-out: `GRAPH_REPORT.md` (11.8 KB), `graph.json`, `graph.html`, `manifest.json`, `cost.json`, `cache/` (contains `ast/`, `semantic/`, `stat-index.json`). No `wiki/`. — directory listing
- Stats: 85% EXTRACTED, 14% INFERRED (52 edges, avg conf 0.88), 0% AMBIGUOUS-by-count (but 1 ambiguous edge listed); 407,528 input tokens, 0 output; 54 files. No import cycles. — `graphify-out/GRAPH_REPORT.md`, `cost.json`
- God nodes (edges): `Site` 13; `astro` 8; `Francis Patrick Diallo (CV subject)` 8; `Luxoft (DXC)` 8; `Canary Deploy Toolkit (project)` 7; `scripts` 6; `readingTime()` 6; `Regular DevOps Engineer at ASML (via Luxoft)` 6; `What a data pipeline test actually needs (blog post)` 6; `Northwind Labs - Senior Engineer, Platform & AI` 6. Note `Site` = the `site.ts` config object, the real code hub.
- Communities (28; 17 shown) include: Layout/Site Config & OG Image; Homepage Section Components; Portfolio Plan & CV Career; Lib Utilities & Blog Pages (readingTime, similarPosts/jaccard, jsonld builders, vitest); Build Tooling & Scripts; Data Pipeline Testing Story; Canary Deploy Story; Deploy, Hosting & CSP; Grounded Docs Assistant; Content Collection Schemas; Runtime Dependencies; Luxoft Client Projects; Favicon Monogram Identity; Plan v2 References; Canary Diagram Flow; TypeScript Config; Contact Form Evolution. Layout/Site Config community has low cohesion 0.07.
- Bridge nodes (high betweenness): `astro` (0.057, links Build Tooling, Layout, Homepage, Content Schemas), `dependencies` (0.026), `@fontsource-variable/atkinson-hyperlegible-mono` (0.024).
- Surprising links: README "Make it yours" -> CV subject; AGENTS.md and CLAUDE.md dev-server/docs sections are semantically identical (duplicated); Formspree (README) ~ Web3Forms (PLAN v1); career-line transit design ~ CV.
- Hyperedges show content "stories": contact form evolution (Web3Forms -> mailto/FormSubmit -> Formspree); timetable-scheduling research line (thesis, MDPI paper, Timefold talk); GitHub Pages CI build/deploy; self-rolling-back canary deploys (blog + project + Northwind role); grounded docs assistant (blog + project + role + RAG skill); data-pipeline-check triad; canary diagram flow.
- Knowledge gaps: 115 isolated nodes (mostly package.json keys); 11 thin communities omitted. Suggested questions center on the ambiguous edge, `astro` bridge role, and splitting the low-cohesion Layout community.
- Content is largely placeholder/fictional (Northwind Labs, DataLoom, Globex Bank) mixed with real Luxoft/ASML/Avaya/Daikin/Vodafone Ziggo entries from the CV — indicates seed data not fully replaced. — `GRAPH_REPORT.md`

### Inferences
- graphify-out is untracked (`??`) so it is not yet committed; decide whether to gitignore it (cache/ and graph.html are large/generated).

### Gaps
- graph.json not parsed directly; relied on the report.

## 4. Git state, uncommitted changes

### Takeaway
Branch `main`, 6 commits total; working tree has 14 modified files (+147/-20) plus untracked plans and graphify-out. Changes are: Cloudflare analytics + CSP, image pipeline for project/blog covers, `target=_blank` links, new favicon, heading weight.

### Cited Findings
- `git log`: 08fe2ad Merge; e01d462 "feat: redesign portfolio with classic typography, Formspree contact and working CSP"; 9ac17e1 Create CNAME; b35fb26 Merge; a07fbdd "Implement development version of the personal website"; 935fe8a Initial commit.
- Uncommitted (unstaged unless noted): README.md (docs for `image`/`cover` frontmatter); astro.config.mjs (CSP: add `https://cloudflareinsights.com` to connect-src, and `scriptDirective` allowing `https://static.cloudflareinsights.com`); public/favicon.svg (staged + unstaged; replaced blue rounded-square with 3-dot line mark by parchment circle "FPD" script monogram carrying a C2PA content-credentials `<metadata>` blob, font Dancing Script); Footer.astro (Blog link opens new tab); SectionBlogPreview.astro, SectionProjects.astro, index.astro, blog/[slug].astro, projects/[slug].astro (render cover/image thumbnails and hero); SectionContact.astro (socials `target=_blank rel="me noopener noreferrer"`); site.ts (staged + unstaged; analytics provider now `'cloudflare'` with a token id; 8/8 line changes incl. staged part); content.config.ts (`image`/`cover` changed from `z.string()` to `image()` helper; schema becomes function `({image}) => ...`); BaseLayout.astro (injects Cloudflare beacon script when provider cloudflare and id set); tokens.css (h1/h2 weight 600 -> 900). Git warns LF->CRLF on many files.
- Untracked: `PORTFOLIO-PLAN.md`, `PORTFOLIO-PLAN-v2.md`, `graphify-out/`. `research_notes/` and `reports/` dirs also exist (reports empty).

### Inferences
- The Cloudflare beacon needs the CSP change in astro.config.mjs, so these two must be committed together.

### Gaps
- Did not diff-read the section component changes line by line beyond stat.

## 5. Plans: PORTFOLIO-PLAN.md (v1) and PORTFOLIO-PLAN-v2.md, status

### Takeaway
v2 supersedes v1 (self-contained, plan + build prompt). Core site, content model, theming, SEO endpoints and CI are done; several nice-to-haves (search, OG PNGs, Playwright/Lighthouse, Pages CMS, station bar polish) are unverified/pending.

### Cited Findings
- v2 decisions: Astro + TS strict; no UI framework; plain CSS; GitHub Pages via Actions; contact via mailto default (FormSubmit optional, "links"); Pagefind search; analytics off by default (GoatCounter/Cloudflare optional); English only; edit via github.dev or optional Pages CMS. Corrected v1 claim on GitHub Pages commercial use. Design "Career line" transit map; a sticky scroll-progress "station" bar; two-layer content (plain summary + `<details>`, "Show technical details" switch); word-based skill levels. — `PORTFOLIO-PLAN-v2.md`
- v2 parity matrix vs two reference repos (nextjs-portofolio-website, radualexandrub.github.io): Apply/Adapt/Drop per feature. Perf budget: Lighthouse mobile Perf>=95, A11y 100, BP>=95, SEO 100; home JS<=15 KB gzip, CSS<=25 KB. Note no 'TODO' checkboxes exist in either plan.

Status vs repo (inferred from files, not from plan checkboxes):
- DONE: Astro/TS/MDX/sitemap/RSS; `site.ts` + Zod collections; light/dark/accent tokens + no-flash script; `/cv` printable page; `/404`; `llms.txt`, `llms-full.txt`, `robots.txt`, `rss.xml`; JSON-LD helpers (`jsonld.ts`); reading time + similar posts (Jaccard) + vitest; deploy workflow; meta CSP; CNAME custom domain; per-section components; blog/project detail pages; cover images (uncommitted).
- CHANGED vs plan: contact = Formspree (`formspreeId: 'xjykjknp'` in site.ts) rather than mailto default (README calls it Formspree contact; v1 had Web3Forms); fonts via fontsource, not Astro Fonts API; npm not pnpm; tint naming; classic serif/parchment look on top of the plan's palette; analytics Cloudflare enabled.
- PENDING/not evident: Pagefind search (no dependency; grep found no pagefind/satori/playwright in src/package.json); per-page OG PNGs (BaseLayout defaults to `/og-default.svg`, an SVG with placeholder text "Your Name"; SVG OG images are poorly supported by social crawlers); Playwright/axe and Lighthouse CI in workflow (workflow only runs build+vitest); Prettier/lint-staged; `.pages.yml` Pages CMS; astro-icon; blog paginated `/blog/page/[n]` and `/blog/tags/[tag]` not verified (only `src/pages/blog/` dir seen); Search Console/Bing launch steps.

### Gaps
- Did not verify blog/ page files or Header behaviour (station bar) against the plan.

## 6. Gotchas for a new developer

### Cited Findings
- CSP is set by Astro `security.csp` as a `<meta>` tag (GitHub Pages cannot send headers): `default-src 'self'`, `img-src 'self' data:`, `connect-src` self + formspree.io + cloudflareinsights.com, `form-action` self + formspree.io, `base-uri 'self'`, `object-src 'none'`; script-src self + `static.cloudflareinsights.com` (Astro auto-hashes its own inline scripts); style keeps `'unsafe-inline'` for Shiki. New third-party scripts/images/fonts/embeds will be blocked until added; external images fail (`img-src`). Inline `<script is:inline>` without hash would be blocked: that is why `theme-init.js` lives in `public/`. — `astro.config.mjs`, `public/theme-init.js`
- Formspree: form id in `site.contact.formspreeId`; site does not publish the email address; changing CSP requires keeping formspree.io in `connect-src` and `form-action`. — `src/config/site.ts`
- Cloudflare Web Analytics token is in site.ts (public beacon id, safe to publish); set provider `null` to disable. — `src/config/site.ts`
- CNAME: `CNAME` (repo root) and `public/CNAME` both contain `diallofrancispatrick.com` (no trailing newline). Only `public/CNAME` ships in `dist`; the root one is redundant. `astro.config.mjs` `site` must match the domain (used by sitemap, canonical, OG). — files
- OG image is `public/og-default.svg`; social platforms generally need PNG/JPG (general knowledge, unverified for this site).
- `public/cv/Francis-Patrick_Diallo_CV_2026_latest.pdf` is the CV; `site.ts` `cv.file`/`cv.updated` must be kept in sync when replacing it.
- Build gate: `npm run build` runs `astro check` first, so type errors and Zod schema failures fail the deploy; PRs run the same build+tests but do not deploy.
- Image frontmatter (`image`/`cover`) now uses Astro `image()` — paths must be relative to the content file (e.g. `./cover.jpg`); old string-path values will fail the build. `.svg` works but is not resized. — `README.md`, `src/content.config.ts`
- Dark mode palette is duplicated in two CSS blocks (explicit `data-mode='dark'` and `prefers-color-scheme`); update both.
- Line endings: repo has LF files with git autocrlf warnings on Windows; expect CRLF churn in diffs.
- Content seeded with fictional entries (Northwind Labs, DataLoom, Globex Bank, Docs Assistant, Canary Deploy Toolkit) alongside real CV history; review before treating the site as final.
- AGENTS.md and CLAUDE.md contain duplicate instructions (graph flags them as semantically similar).
- graphify-out reports "Corpus ~20.6k words fits one context window" - graph not essential for this small repo.

### Gaps
- Did not test running the dev server or the build.
