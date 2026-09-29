# Portfolio data flow: content, config, integrations (Astro static site)

Scope: local code research (no web sources). All citations are repo-relative paths under C:\Users\FDiallo\Desktop\Desktop\portofolio-commit. Stack from package.json: astro ^7.3.5, @astrojs/mdx, @astrojs/sitemap, @astrojs/rss, three @fontsource-variable fonts, vitest; Node >=22.12; static output deployed to GitHub Pages. Note: git status showed many files modified/uncommitted, so notes reflect the working tree, not HEAD. The graphify-out files were not consulted (code read directly).

## 1. Content collections (src/content.config.ts) and content files

### Takeaway
Six collections are defined in `src/content.config.ts`: three glob-loaded Markdown/MDX collections (experience, projects, blog) and three file()-loaded YAML collections (education, certifications, skills). Zod schemas validate frontmatter/YAML at build time and fail the build on violations. Content is split between `src/content/**` files.

### Cited Findings
Shared enums (src/content.config.ts): `tint` = crimson|cobalt|emerald|amber (color only); `level` = daily|comfortable|learning. Date-like strings use regex `^\d{4}-\d{2}$` (YYYY-MM).

- experience: loader `glob('**/*.md', base ./src/content/experience)`. Fields: company (str), role (str), tint (enum), start (YYYY-MM), end (YYYY-MM or null, required nullable), location (str), url (url, optional), plain (str max 220), highlights (str[] max 4), stack (str[]). Files: dataloom.md, globex-bank.md, northwind-labs.md. Markdown body = long description, rendered via `render()`.
- projects: loader `glob('**/*.md', base ./src/content/projects)`; schema is a function `({image}) =>`. Fields: title, tint, category (free str; drives filter chips), plain (max 220), stack (str[]), image (`image()` optional; local asset, processed by astro:assets), repo (url opt), live (url opt), start (YYYY-MM), end (YYYY-MM opt), featured (bool default false). Files: docs-assistant.md, pipeline-canary.md. (Placeholder repo url "your-username" in pipeline-canary.md.) `featured` is defined but no consumer was found in the components I read (grep of pages/components showed no use; unverified for all files).
- education: loader `file('./src/content/education.yaml')`. Each YAML item needs an `id`. Fields: degree, school, start (plain str), end (plain str), location opt, notes opt. Current data is placeholder ("Technical University Example").
- certifications: loader `file('./src/content/certifications.yaml')`. Fields: name, issuer, issued (YYYY-MM), expires (YYYY-MM opt), credentialId opt, url opt, tint opt. Items have `id`.
- skills: loader `file('./src/content/skills.yaml')`. Fields: name, tint, plain, items[] of {name, level(enum), icon opt}. Items carry `id` (e.g. "backend", "data", "platform").
- blog: loader `glob('**/*.mdx', base ./src/content/blog)` (only .mdx, not .md). Fields: title, summary (max 160), date (`z.coerce.date()`), updated (coerce date opt), tags (str[]), draft (bool default false), cover (`image()` opt). Files: canary-deploys-that-roll-back-themselves.mdx, grounding-an-assistant-in-docs-that-change.mdx, what-a-data-pipeline-test-actually-needs.mdx. Frontmatter example: title, summary, date: 2025-03-10, tags: [...]. Body can use markdown images pointing to /images/... (public/images/diagram-canary.svg) and fenced code (Shiki).
- Entry `id` for glob loaders = filename slug without extension (used as URL slug: `params: { slug: post.id }`, `project.id`).
- Empty directories src/content/{certifications,education,skills} exist but are unused (data lives in the .yaml files).
- Config lives at `src/content.config.ts` (Astro 5+/7 location), exports `collections`.

### Inferences
- Because schema failure stops the build and `npm run build` = `astro check && astro build`, bad frontmatter (e.g. summary >160 chars, plain >220) is caught in CI (.github/workflows/deploy.yml runs build then vitest).

### Gaps
- Did not verify `featured` usage exhaustively or whether `icon` in skills is rendered.

## 2. Site config (src/config/site.ts)

### Takeaway
`site` is a single `as const` TypeScript object imported directly (no runtime fetch) by layouts, components, pages, and endpoints; it is the single source for identity, section order/visibility, contact, analytics and SEO base URL.

### Cited Findings (field -> consumers)
- name, role, motto, tagline, interests, currently{building,learning,reading{title,url}}, cv{file,downloadName,updated}: `src/pages/index.astro` hero (name/role/motto/interests/currently/cv download); "TODO"-prefixed or empty `currently` rows are hidden by a `filled()` filter in index.astro. Currently `reading.title` is 'TODO: ...' so that row is hidden.
- name/role/tagline/location: `src/pages/cv.astro`; `src/lib/jsonld.ts` (personJsonLd: name, jobTitle=role, url, sameAs=socials urls); `src/pages/rss.xml.ts` (title/description); `llms.txt.ts`, `llms-full.txt.ts`.
- url ('https://diallofrancispatrick.com'; comment says must match public/CNAME): `BaseLayout.astro` (canonical via `new URL(Astro.url.pathname, site.url)`, og:url, og:image absolute), `robots.txt.ts` (sitemap URL `/sitemap-index.xml`), llms endpoints, blog `[slug].astro` JSON-LD URLs. Note `astro.config.mjs` separately hardcodes `site:` to the same value (duplicate, must be kept in sync manually).
- location, languages, availability{open,text}: `SectionAbout.astro`; availability also `SectionContact.astro`.
- sections[] {id,title,visible}: `index.astro` (filters visible, maps id -> component via `componentMap` about/skills/experience/projects/education/blog/contact; order = array order); `Header.astro` (nav links `#id`, `data-station`); `projects/[slug].astro` `getStaticPaths` returns [] if 'projects' hidden (so hiding removes detail pages).
- contact{formspreeId, replyTime}: `SectionContact.astro` (form action `https://formspree.io/f/${formspreeId}`; empty id -> "being set up" placeholder).
- socials[] {platform,url}: `SectionContact.astro` (icons map github/linkedin/goodreads, fallback link icon), `jsonld.ts` sameAs, `llms.txt.ts`.
- links[], clientLogos[] (both empty arrays): defined; no consumer found in my greps.
- defaults{mode,accent}: defined; the theme actually reads localStorage via `public/theme-init.js` and Header.astro script, not `site.defaults` (grep found no consumer) — inference, not exhaustively verified.
- analytics{provider: null|'goatcounter'|'cloudflare', id}: `BaseLayout.astro` renders Cloudflare beacon only when provider==='cloudflare' && id; goatcounter has no branch in BaseLayout (type allows it, not implemented).
- Footer.astro uses site.name plus build date (`new Date().toISOString().slice(0,10)` evaluated at build).

### Gaps
- `site.cv.updated` consumer not found.

## 3. How pages query collections and index.astro assembles

### Takeaway
All queries are build-time `getCollection` calls in frontmatter; dynamic routes use `getStaticPaths` with entry `id` as slug and `render(entry)` for MDX/MD bodies. `index.astro` composes hero + config-ordered section components, each self-fetching its own collection.

### Cited Findings
- `src/pages/index.astro`: `getCollection('skills')` only, to build `knowsAbout` for `personJsonLd`; wraps content in `BaseLayout` with named slots header (`Header`) and footer (`Footer`); renders hero from `site`; then `visibleSections.map` -> `<Comp />` (no props; components query themselves).
- Section components' own queries: SectionSkills (`skills`, level labels); SectionExperience (`experience` sorted by start desc; `render` for body); SectionProjects (`projects` sorted by start desc; categories = 'All' + unique `category`; `<Image>` from `astro:assets` with `p.data.image`; links to `/projects/<id>/` presumably); SectionEducation (`education` sorted by end desc; `certifications` sorted by issued desc; computes today's YYYY-MM for expiry); SectionBlogPreview (`blog` filtered `!isProd || !draft`, sorted date desc, top 3, `readingTime`, optional cover `<Image>`); SectionAbout (no collection; `import.meta.glob('../assets/profile.{jpg,...,svg}', eager)` picks raster over SVG placeholder; `src/assets/profile.jpg` exists); SectionContact (site.contact, socials).
- Draft rule: `getCollection('blog', p => !import.meta.env.PROD || !p.data.draft)` in blog/index, blog/[slug], tags/[tag], SectionBlogPreview (drafts visible in dev, hidden in prod). But `rss.xml.ts`, `404.astro`, `llms.txt.ts`, `llms-full.txt.ts` use `!p.data.draft` unconditionally.
- `src/pages/blog/[slug].astro`: `getStaticPaths` -> one path per post (`params.slug = post.id`, `props.post`). Frontmatter: `render(post)` -> `{Content, headings}`; TOC = headings depth 2/3; prev/next from date-sorted list; `similarPosts` (`src/lib/similarPosts.ts`, Jaccard tag overlap, top 3); `readingTime(post.body)` (`src/lib/readingTime.ts`, 200 wpm, code fences stripped); JSON-LD BlogPosting + BreadcrumbList (`src/lib/jsonld.ts`) passed to BaseLayout `jsonLd` prop; optional cover via `<Image width=960 height=540>`.
- `src/pages/blog/index.astro`: lists all non-draft posts, tag chips with client-side filter (buttons with data-tag; li data-tags).
- `src/pages/blog/tags/[tag].astro`: `getStaticPaths` from unique tags, props.posts filtered. Sitemap excludes URLs containing `/tags/` (astro.config.mjs).
- `src/pages/projects/[slug].astro`: `getStaticPaths` from `getCollection('projects')`, slug = `project.id`; `render(project)`; shows image, tint-colored h1 (`data-tint` -> `--tint` in tokens.css), category, date range, stack, repo/live links. Description = `plain`.
- `src/pages/cv.astro`: experience, education, certifications, skills -> printable page.
- `src/pages/404.astro`: latest 3 posts + tags.
- Endpoints: `rss.xml.ts` (@astrojs/rss; items title/summary/date/tags, link `/blog/<id>/`), `llms.txt.ts` (experience, skills, certifications, posts, cv, contact, socials), `llms-full.txt.ts` (experience + blog raw `body`), `robots.txt.ts` (Allow all, Sitemap line).
- Layout: `src/layouts/BaseLayout.astro` props {title, description, ogImage?, jsonLd?, noindex?}; title format `"<title> — <site.name>"` unless title equals site.name; emits canonical, OG/Twitter meta (default og image `/og-default.svg`), theme-color, favicon `/favicon.svg`, RSS + llms.txt alternates, JSON-LD scripts (`<` escaped), `<script is:inline src="/theme-init.js">`, optional analytics, HTML comment addressed to AI crawlers; slots header/default/footer. Imports tokens.css and fonts.
- Tint system: frontmatter `tint` -> `data-tint` attribute -> `[data-tint='x'] { --tint: var(--tint-x) }` in `src/styles/tokens.css` (lines ~175-179); light/dark values differ; `data-mode`/`data-accent` attributes on `<html>` set by `theme-init.js` from localStorage keys `mode`, `accent`, `show-details`.

### Inferences
- Section components ignore props and are decoupled from index.astro; adding a section needs a component + `componentMap` entry + `site.sections` entry.

## 4. External integrations

### Takeaway
Only three third parties are contacted at runtime: Formspree (form POST), Cloudflare Web Analytics (beacon script + reporting). Fonts are self-hosted via npm. CSP is defined in `astro.config.mjs` and emitted as a `<meta>` tag by Astro.

### Cited Findings
- Formspree: `SectionContact.astro` form action `https://formspree.io/f/${site.contact.formspreeId}` (id currently 'xjykjknp'), fields name/email/message (client-validated, maxlength 100/200/5000, message minlength 10), honeypot input `_gotcha`. Inline `<script>` (bundled by Astro, hashed by CSP) intercepts submit, `fetch(form.action, {method:'POST', headers:{Accept:'application/json'}, body: FormData})`, shows status in `#form-status`; non-JS fallback is the native POST (allowed by `form-action`).
- CSP (`astro.config.mjs` `security.csp`): directives `default-src 'self'`, `img-src 'self' data:`, `connect-src 'self' https://formspree.io https://cloudflareinsights.com`, `form-action 'self' https://formspree.io`, `base-uri 'self'`, `object-src 'none'`; `styleDirective` resources `'self'` + `'unsafe-inline'` (because Shiki inline styles); `scriptDirective` resources `'self'` + `https://static.cloudflareinsights.com`. Astro auto-hashes its own inline scripts. Comment in config: delivered as `<meta>` on every page. `theme-init.js` is a same-origin file in /public precisely so no hash is needed. No `font-src` explicit, so fonts fall back to default-src 'self' (fonts are self-hosted, fine). `img-src` excludes external hosts: external images in markdown would be blocked.
- Analytics: Cloudflare beacon `https://static.cloudflareinsights.com/beacon.min.js` with `data-cf-beacon={"token": site.analytics.id}` in BaseLayout, gated by `site.analytics.provider==='cloudflare' && id`. Token in site.ts is '8808bcc4f06446aa95183cef8912eed5' (comment: public beacon id).
- Fonts: BaseLayout imports `@fontsource-variable/atkinson-hyperlegible-next`, `.../atkinson-hyperlegible-mono`, `.../cormorant-garamond` (+ `wght-italic.css`); referenced by `--font-body`, `--font-mono`, `--font-display` in tokens.css. Self-hosted, bundled by Vite.
- Images: `astro:assets` `<Image>` for profile (src/assets/profile.jpg), project `image`, blog `cover` (schema `image()` requires paths relative to the md file / asset imports, optimized at build). Static images in `public/images` (diagram-canary.svg), `public/og-default.svg`, `public/favicon.svg`. CV PDF `public/cv/Francis-Patrick_Diallo_CV_2026_latest.pdf`.
- Sitemap: `@astrojs/sitemap` with filter excluding `/tags/`; uses `site` from astro.config.mjs; `robots.txt.ts` points to `/sitemap-index.xml`.
- RSS: `/rss.xml` from `src/pages/rss.xml.ts`; advertised via `<link rel=alternate>` in BaseLayout.
- LLM files: `/llms.txt`, `/llms-full.txt`.
- Markdown: `markdown.shikiConfig.themes` light `github-light`, dark `github-dark`; MDX via `@astrojs/mdx`.
- Deploy: `.github/workflows/deploy.yml` — on push to main/PR: npm ci, `npm run build` (astro check + build), `npm test` (vitest, `src/lib/lib.test.ts`), upload `./dist` and deploy to GitHub Pages (push to main only). `CNAME` in repo root and `public/CNAME` for custom domain.

### Gaps
- graphify-out cross-check not done. goatcounter provider unimplemented.

## 5. Step-by-step: how to change things (derived from code)

### Takeaway
Almost everything is file-drop or single-object edits; validation is by zod at build.

### Cited Findings
- New blog post: create `src/content/blog/<slug>.mdx` (must be .mdx per glob) with frontmatter title, summary (<=160), date (coerced), tags[], optional updated, draft (true hides it in prod builds from listing/pages but RSS/404/llms ignore the PROD condition and still filter draft), optional `cover` (relative path to image inside src/, e.g. ../../assets/x.jpg). URL becomes `/blog/<slug>/`; tag pages auto-generated; appears in preview (top 3 by date), index, RSS, llms files, sitemap. Static images: put in `public/images/` and reference `/images/...`.
- New project: create `src/content/projects/<slug>.md` with title, tint, category, plain (<=220), stack[], start (YYYY-MM), optional end/repo/live/image/featured. Appears in SectionProjects (new category chips auto) and page `/projects/<slug>/` (only if 'projects' section visible).
- New job: `src/content/experience/<slug>.md` with required fields incl. `end: null` if current, highlights <=4.
- Skills/education/certs: append an item (with unique `id`) to the corresponding YAML file.
- Site-wide change: edit `src/config/site.ts` (toggle `sections[].visible`, reorder, Formspree id, analytics id, socials, currently, cv file). If changing domain: update `site.url`, `astro.config.mjs` `site`, and `CNAME`/`public/CNAME`.
- New third-party origin: add to CSP directives in `astro.config.mjs` (connect-src/script/img etc.), otherwise browser blocks.
- New section: create `src/components/SectionX.astro`, add to `componentMap` in `index.astro` and an entry in `site.sections`.
- Dev/verify: `astro dev` (project CLAUDE.md suggests `astro dev --background`); `npm run build`; `npm test`.

## 6. Data-flow diagram description (nodes and edges)

### Takeaway
Sources (files) -> loaders/schemas -> build-time queries -> pages/components -> static HTML/endpoints -> browser, with config as a cross-cutting input and three external services on the client side.

### Nodes
- S1 `src/content/blog/*.mdx`; S2 `src/content/projects/*.md`; S3 `src/content/experience/*.md`; S4 `education.yaml`; S5 `certifications.yaml`; S6 `skills.yaml`
- S7 `src/config/site.ts` (site object); S8 `astro.config.mjs` (site, csp, integrations, shiki); S9 `src/assets/*` (profile.jpg, cover images); S10 `public/*` (theme-init.js, images, cv pdf, favicon, og-default.svg, CNAME)
- L `astro:content` layer: `src/content.config.ts` (glob/file loaders + zod schemas) -> collections {blog, projects, experience, education, certifications, skills}
- H helpers: `src/lib/readingTime.ts`, `similarPosts.ts`, `jsonld.ts`
- P pages: `index.astro`, `blog/index.astro`, `blog/[slug].astro`, `blog/tags/[tag].astro`, `projects/[slug].astro`, `cv.astro`, `404.astro`; endpoints `rss.xml.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `robots.txt.ts`; generated sitemap-index.xml
- C components: Header, Footer, SectionAbout/Skills/Experience/Projects/Education/BlogPreview/Contact
- B `BaseLayout.astro` (head meta, JSON-LD, analytics, fonts, tokens.css)
- O output `dist/` -> GitHub Pages (custom domain)
- X1 Formspree, X2 Cloudflare Web Analytics, X3 GitHub Actions/Pages

### Edges
- S1..S6 --glob/file loader + zod validation--> L
- L --getCollection--> C (Skills, Experience, Projects, Education, BlogPreview) and P (index[skills], blog pages, projects/[slug], cv, 404, endpoints)
- L --render()--> P: blog/[slug], projects/[slug] (Content, headings), C: Experience (bodies)
- S9 --astro:assets Image / import.meta.glob--> C: About, Projects, BlogPreview; P: blog/[slug], projects/[slug]
- S7 --import--> B, Header, Footer, all Section* (About, Contact), index.astro (hero, section order), cv, jsonld, endpoints, projects/[slug] getStaticPaths
- H --> P: readingTime -> blog pages/BlogPreview; similarPosts -> blog/[slug]; jsonld -> index (Person), blog/[slug] (BlogPosting, Breadcrumb) -> B
- index.astro --site.sections order/visible--> C (componentMap) -> HTML
- C/P --slots--> B -> static HTML; B links S10 (theme-init.js, favicon, og image)
- S8 --csp--> `<meta http-equiv=Content-Security-Policy>` in every page; S8 --sitemap--> sitemap-index.xml; S8 --mdx/shiki--> S1 rendering
- Browser: theme-init.js reads localStorage(mode, accent, show-details) -> `<html data-*>`; tokens.css uses attributes + `data-tint`
- Browser (SectionContact script) --fetch POST FormData--> X1 Formspree (allowed by connect-src/form-action)
- Browser (BaseLayout beacon) --> X2 (allowed by script-src/connect-src) when site.analytics set
- Git push main --> X3 (npm ci, astro check + build, vitest) --> O
