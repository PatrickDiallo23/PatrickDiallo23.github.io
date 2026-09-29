# One config object drives this static Astro portfolio

This portfolio is a **fully static Astro 7 site** (TypeScript strict, plain CSS, no UI framework, no SSR adapter) that builds to `dist/` and deploys to GitHub Pages at `diallofrancispatrick.com`. Two inputs drive everything: a single typed object in `src/config/site.ts` (identity, section order and visibility, contact, socials, analytics) and six Zod-validated content collections in `src/content.config.ts` (three glob-loaded Markdown/MDX, three YAML `file()`-loaded). Pages query collections at build time with `getCollection`, compose them inside one `BaseLayout`, and emit plain HTML plus four text/XML endpoints. Schema violations or type errors fail `npm run build` (`astro check && astro build`), which is also the CI gate. Client JS is small vanilla TypeScript in `<script>` blocks, and a built-in Astro CSP (delivered as a `<meta>` tag) blocks any third-party origin not explicitly whitelisted. The main things a new developer trips over are the CSP, the duplicated domain and dark-mode values, uneven draft handling, and a working tree that is still mid-change with placeholder content. Sources are local repo files (paths in backticks), read against the working tree, not HEAD; several claims were re-verified directly (see gotchas).

## System architecture: files in, static HTML out

The runtime has no server. Source files flow through Astro's content layer into pages, and the output is uploaded as a Pages artifact. Diagram-ready nodes and edges follow.

**Nodes.** S1 `src/content/blog/*.mdx` (3 posts); S2 `src/content/projects/*.md` (2); S3 `src/content/experience/*.md` (3); S4-S6 `education.yaml`, `certifications.yaml`, `skills.yaml`; S7 `src/config/site.ts`; S8 `astro.config.mjs` (site URL, CSP, mdx, sitemap, Shiki); S9 `src/assets/*` (profile.jpg, cover images); S10 `public/*` (theme-init.js, images, CV PDF, favicon, og-default.svg, CNAME); L content layer `src/content.config.ts`; H helpers `src/lib/{readingTime,similarPosts,jsonld}.ts`; B `BaseLayout.astro`; C `Header`, `Footer`, `SectionAbout/Skills/Experience/Projects/Education/BlogPreview/Contact`; P pages and endpoints; O `dist/`; X1 Formspree; X2 Cloudflare Web Analytics; X3 GitHub Actions + Pages.

**Edges.** S1-S6 flow through glob/file loaders and Zod validation into L. L feeds `getCollection` to C and P, and `render()` to `blog/[slug]`, `projects/[slug]` and `SectionExperience`. S9 feeds `astro:assets` `<Image>` (and `import.meta.glob` for the profile photo) into About, Projects, BlogPreview and the two detail pages. S7 is imported by B, Header, Footer, About, Contact, `index.astro`, `cv.astro`, `jsonld.ts`, the endpoints and `projects/[slug]`. H feeds P and B (JSON-LD via the `jsonLd` prop). `index.astro` uses `site.sections` plus a `componentMap` to pick and order C. C and P fill B's slots into static HTML, and B links S10. S8 produces the CSP `<meta>` on every page, the sitemap, and the MDX/Shiki rendering. In the browser, `theme-init.js` reads localStorage into `<html data-*>`, the contact script POSTs to X1, and the beacon calls X2. A push to `main` triggers X3 (npm ci, check+build, vitest) and publishes O.

The site has no framework islands and no `client:*` directives; `package.json` carries no React/Vue/Svelte integration. Cross-page animation uses native CSS `@view-transition { navigation: auto }` in `tokens.css`, not Astro's `ClientRouter`.

## Tech stack, layout, routes and composition

The stack is deliberately small, and versions below are declared ranges from `package.json` (installed versions were not checked).

| Layer | Choice |
|---|---|
| Framework | `astro ^7.3.5`, `"type": "module"`, Node `>=22.12.0` |
| Content | `@astrojs/mdx ^8.0.2`, Shiki dual themes `github-light` / `github-dark` |
| SEO/feeds | `@astrojs/sitemap ^3.7.4` (excludes `/tags/`), `@astrojs/rss ^4.0.19`, JSON-LD helpers |
| Language/checks | `typescript ^6.0.3` (extends `astro/tsconfigs/strict`, no path aliases), `@astrojs/check ^0.9.10` |
| Tests | `vitest ^3.2.4`, only `src/lib/lib.test.ts` (readingTime x3, similarPosts x3) |
| Fonts | self-hosted `@fontsource-variable` Atkinson Hyperlegible Next, Atkinson Hyperlegible Mono, Cormorant Garamond |
| Styling | plain CSS: one global `src/styles/tokens.css` plus scoped `<style>` blocks; no Tailwind |
| Hosting | GitHub Pages, custom domain via `CNAME` |

Top-level layout: `src/config/site.ts`, `src/content.config.ts`, `src/content/**`, `src/assets/profile.jpg`, `src/layouts/BaseLayout.astro` (the only layout), `src/components/`, `src/pages/`, `src/lib/`, `src/styles/tokens.css`; `public/` is copied verbatim to `dist/`. Tooling folders (`graphify-out/`, `research_notes/`, `reports/`, `.impeccable/`, `.claude/`) are not app code. Empty `src/content/{education,certifications,skills}/` directories exist but are unused because the data lives in the YAML files.

Routes: `/` (`index.astro`), `/cv/` (printable), `/404.html`, `/blog/`, `/blog/{id}/`, `/blog/tags/{tag}/` (not in the sitemap), `/projects/{id}/`, plus endpoints `/rss.xml`, `/llms.txt`, `/llms-full.txt`, `/robots.txt`. Every HTML page is `BaseLayout` with `<Header slot="header">`, page content in the default slot, and `<Footer slot="footer">`. Only the homepage composes `Section*` components: the hero is inline in `index.astro`, then `site.sections.filter(visible)` is mapped through `componentMap` (id to component) in array order, each rendered as `<Comp />` with no props. Section components query their own collections and are decoupled from the page; only `index.astro` itself calls `getCollection('skills')`, for the Person JSON-LD `knowsAbout`. `BaseLayout` takes `title`, `description`, `ogImage?`, `jsonLd?`, `noindex?`, builds the canonical URL from `site.url`, emits OG/Twitter meta, RSS and `llms.txt` alternates, JSON-LD scripts (with `<` escaped), `<script is:inline src="/theme-init.js">` and the optional Cloudflare beacon. `<html lang="en">` is hardcoded.

## Data flow: content schemas, site config and external services

The six collections and their contracts are the most useful reference when adding content. Shared enums: `tint` = crimson | cobalt | emerald | amber (colour only), skill `level` = daily | comfortable | learning; month fields use the regex `^\d{4}-\d{2}`.

| Collection | Loader | Key fields |
|---|---|---|
| experience | `glob('**/*.md')` | company, role, tint, start, `end` (YYYY-MM or `null`, required), location, url?, plain (max 220), highlights (max 4), stack[] |
| projects | `glob('**/*.md')`, schema is `({image}) =>` | title, tint, category (free text, drives filter chips), plain (max 220), stack[], image? (`image()`), repo?, live?, start, end?, featured (default false) |
| blog | `glob('**/*.mdx')` (MDX only) | title, summary (max 160), date (coerced), updated?, tags[], draft (default false), cover? (`image()`) |
| education | `file(education.yaml)` | id, degree, school, start, end (plain strings), location?, notes? |
| certifications | `file(certifications.yaml)` | id, name, issuer, issued, expires?, credentialId?, url?, tint? |
| skills | `file(skills.yaml)` | id, name, tint, plain, items[] {name, level, icon?} |

For glob collections the entry `id` is the filename without extension and becomes the URL slug (`post.id`, `project.id`). The `site` object is `as const` and imported directly; its `sections[]` entries (`about`, `skills`, `experience`, `projects`, `education`, `blog`, `contact`) control nav links, homepage order and, for `projects`, whether detail pages exist at all (`getStaticPaths` returns `[]` when hidden). Other consumers: `contact.formspreeId` (form action `https://formspree.io/f/{id}`; empty shows a "being set up" note), `socials` (contact icons, JSON-LD `sameAs`, `llms.txt`), `analytics`, `currently` (rows that are empty or start with `TODO` are hidden), and `url` (canonical, OG, robots, llms).

Blog pages add derived data: `render(post)` yields `Content` and `headings` (h2/h3 table of contents), prev/next by date, `similarPosts` (Jaccard tag overlap, top 3), `readingTime` (200 wpm, code fences stripped), and BlogPosting plus BreadcrumbList JSON-LD. Only three third parties are contacted at runtime. The contact script intercepts submit and `fetch`-POSTs `FormData` to Formspree, with fields name/email/message, length limits and a `_gotcha` honeypot; without JS the native POST still works because `form-action` allows Formspree. The Cloudflare Web Analytics beacon loads from `static.cloudflareinsights.com` only when `provider === 'cloudflare'` and an id is set. Everything else (fonts, images, scripts) is same-origin. Draft handling is inconsistent: `blog/index`, `blog/[slug]`, `tags/[tag]` and `SectionBlogPreview` show drafts in dev and hide them in production (`!import.meta.env.PROD || !draft`), while `rss.xml.ts`, `404.astro` and `llms*.txt.ts` always hide drafts.

## Styling, CSP and CI/CD

`tokens.css` (about 270 lines) is imported once in `BaseLayout` after the font imports, and its header rule is that no component hardcodes a colour, font size or spacing value. Light tokens include `--bg #f4f6f9`, `--ink #132033`, tints `--tint-crimson #c8102e`, `--tint-cobalt #1d4ed8`, `--tint-emerald #047857`, `--tint-amber #a34d06`, and `--accent` defaulting to cobalt. Dark mode applies through `:root[data-mode='dark']` and, for the system default, `@media (prefers-color-scheme: dark)` on `:root:not([data-mode='light']):not([data-mode='dark'])`; the dark values are duplicated in these two blocks. Accent comes from `:root[data-accent=...]`, and content colours from `data-tint` on an element, which exposes `--tint` to children. The type scale runs at ratio 1.25 (`--text-sm 0.8rem` to `--text-3xl 3.052rem`, base 1.125rem), spacing is `--space-1..6`, `--gutter` is `clamp(1.25rem,5vw,2rem)`, and prose is capped at `--measure: 66ch`. Shared classes are `.skip-link`, `.visually-hidden` and `.plate` (framed card), and the file also holds print rules, a reduced-motion kill switch and `prefers-contrast: more`. `public/theme-init.js` runs before paint, reads localStorage keys `mode`, `accent`, `show-details` and sets `data-mode`, `data-accent`, `data-details` on `<html>`; it sits in `public/` so the CSP needs no hash for it.

The CSP comes from Astro's `security.csp` in `astro.config.mjs` because GitHub Pages cannot send headers. It sets `default-src 'self'`, `img-src 'self' data:`, `connect-src` self + `formspree.io` + `cloudflareinsights.com`, `form-action` self + `formspree.io`, `base-uri 'self'`, `object-src 'none'`, script sources self + `static.cloudflareinsights.com` (Astro auto-hashes its own inline scripts), and style sources self + `'unsafe-inline'` for Shiki. Any new external script, image, font or embed is blocked until added there.

CI (`.github/workflows/deploy.yml`) triggers on push to `main`, pull requests and manual dispatch, using Node 22 on ubuntu-latest: `npm ci`, `npm run build`, `npm test`. The Pages artifact upload (`./dist`) and `deploy-pages@v4` run only for pushes to `main`, so PRs build and test without deploying; concurrency group `pages` cancels in-progress runs. There is no lint, e2e or Lighthouse job.

## How-to recipes and gotchas

To add a blog post, create `src/content/blog/<slug>.mdx` (`.md` is not globbed) with title, summary of 160 characters or fewer, date and tags; it appears automatically at `/blog/<slug>/`, in the tag pages, homepage preview, RSS, llms files and sitemap. Static images go in `public/images/` and are referenced as `/images/...`; a `cover` must be a path relative to the file (for example `../../assets/x.jpg`). To add a project, create `src/content/projects/<slug>.md` with `plain` of 220 characters or fewer and `start` as YYYY-MM; new categories become filter chips. For a job, add `src/content/experience/<slug>.md` with `end: null` if current and at most 4 highlights. For skills, education or certifications, append an item with a unique `id` to the YAML. For site-wide changes edit `src/config/site.ts` (toggle or reorder `sections`, Formspree id, socials, analytics, CV file). To add a homepage section, create `SectionX.astro`, add it to `componentMap` in `index.astro`, and add an entry to `site.sections`. To add a third-party origin, extend the CSP in `astro.config.mjs`. To change domain, update `site.url`, `astro.config.mjs` `site`, and both CNAME files. Run `astro dev --background` (project `CLAUDE.md`), `npm run build`, `npm test`.

Known gotchas, with the ones I re-checked against source marked verified:

- **Domain duplication.** `site.url`, `astro.config.mjs` `site` and `public/CNAME` must be kept in sync by hand; root `CNAME` is redundant since only `public/CNAME` ships.
- **Unused config and schema (verified).** `featured` exists in the projects schema and both project files set it, but no page or component reads it. `site.defaults`, `links`, `clientLogos` and `cv.updated` have no consumer found. `goatcounter` is allowed by the type but has no branch in `BaseLayout`.
- **Image frontmatter.** `image` and `cover` use Astro `image()`, so old string paths fail the build; SVGs work but are not resized.
- **Dark palette duplicated** in two CSS blocks; edit both. `tokens.css` also has an `h1, h2` rule that overlaps `h1, h2, h3, h4`.
- **Placeholder content.** `public/og-default.svg` is an SVG, which is poorly supported by social crawlers (general knowledge, unverified here); seed content (Northwind Labs, DataLoom, Globex Bank, Docs Assistant) sits beside real CV history.

## Graphify insights: the graph confirms the hub, adds little else

The graphify run dated 2026-09-29 covers **272 nodes, 359 edges and 28 communities from 54 files** (`graphify-out/GRAPH_REPORT.md`); 85% of edges are extracted and 14% inferred (52 edges, average confidence 0.88). Its own report notes the corpus (about 20.6k words) fits in one context window, so the graph is a convenience, not a necessity. The top god node is `Site` with 13 edges, which is the `site.ts` config object and matches the real code hub; `astro` (8) is the main bridge node linking build tooling, layout, homepage and content schemas (betweenness 0.057). The other high-degree nodes are content or CV entities (CV subject, Luxoft/DXC, Canary Deploy Toolkit, Northwind Labs role) plus `readingTime()`. Relevant communities are Homepage Section Components, Lib Utilities and Blog Pages, Content Collection Schemas, Deploy/Hosting/CSP, Layout/Site Config (low cohesion 0.07, a candidate to split) and Contact Form Evolution. The one ambiguous edge links `site.ts` to the placeholder identity text in `og-default.svg`, and there are 115 isolated nodes, mostly `package.json` keys. The graph has no import cycles and is untracked, so decide whether to gitignore its generated `cache/` and `graph.html`.

## Conclusion

The codebase is small enough that its architecture reduces to one rule: configuration and content are data, and pages are pure build-time projections of that data, so nearly every change is a file drop or a single-object edit validated by Zod. The risk lives at the edges, not in the core, in the hand-synced domain, the CSP whitelist, the unused knobs that look functional but are not, and placeholder identity assets that would ship if the working tree were committed as is.

Unverified: nothing was built or run, installed versions were not checked, the Header/theme JS and per-component scoped styles were not read in full, and `graph.json` was not parsed (the report was used instead).
