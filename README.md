# Career Line

A personal website built as a transit map of a career: each discipline (Java, Python, DevOps, AI) is
a colored line, each job is a station, and the sticky progress bar at the top of the page *is* the
line. Static, fast, free to host, and editable entirely through plain files — no CMS, no database,
no backend.

Built with [Astro](https://astro.build), plain CSS, and small vanilla TypeScript `<script>` blocks.
Deployed for free on GitHub Pages.

---

## Table of contents

- [Features](#features)
- [Design](#design)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Make it yours](#make-it-yours)
- [Content model & validation](#content-model--validation)
- [Contact form modes](#contact-form-modes)
- [Testing](#testing)
- [Deploying](#deploying)
- [Decisions and deviations from the spec](#decisions-and-deviations-from-the-spec)
- [Feature parity with the two reference repos](#feature-parity-with-the-two-reference-repos)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Features

**Content & pages**
- Home page assembled from independent sections (About, Skills, Experience, Projects, Education &
  certifications, Blog, Contact) — order and visibility controlled from one config file
- Blog with MDX, tag filtering, tag pages (`/blog/tags/[tag]`), reading time, a collapsible table of
  contents with active-heading tracking, heading anchor links, syntax-highlighted code blocks with a
  copy button, an image lightbox with a download link, previous/next links, "similar posts" ranked
  by tag overlap, share button (Web Share API with a copy-link fallback), and breadcrumbs
- Optional Projects section with category filter chips and detail pages — turned on with one line in
  `site.ts`
- Printable `/cv` page generated from the same content as the Experience/Education/Skills sections,
  plus a real downloadable PDF
- Custom 404 page ("This station doesn't exist") that suggests existing tags and the latest posts

**Design & interaction**
- The "career line": a sticky scroll-progress bar that doubles as section navigation, with one
  station dot per section, an active-section indicator, and a hero SVG line that draws itself once
  on load (skipped entirely under `prefers-reduced-motion`)
- Light / dark / system theme, and an accent picker (all four line colors together, or any single
  line color everywhere), both via a keyboard-accessible menu, persisted in `localStorage`, applied
  before first paint (no flash)
- Two-layer content: every experience entry and project shows a plain-language outcome first, with
  technical detail behind a native `<details>` that a single header toggle can open everywhere at
  once
- Skip link, visible focus rings, 44px touch targets, no horizontal scroll at 320px, custom
  `::selection`, print stylesheet, back-to-top button

**SEO & discovery**
- Per-page meta, canonical URLs, Open Graph/Twitter tags, JSON-LD (`Person`, `BlogPosting`,
  `BreadcrumbList`)
- Generated `sitemap-index.xml`, `robots.txt`, `rss.xml`, and `/llms.txt` + `/llms-full.txt` (the
  [llms.txt](https://llmstxt.org) convention) — all built from content at build time, so nothing goes
  stale
- A `<meta http-equiv="Content-Security-Policy">` (GitHub Pages can't send real HTTP headers)

**Engineering**
- Zod-validated frontmatter: a bad content file fails the build and names the exact file and field
- Zero client-side JS framework — every interactive piece is a small `<script>` in the component that
  needs it; the home page ships about 2 KB of JS gzipped
- Vitest unit tests for the logic that's easy to get subtly wrong (reading time, similar-post
  ranking, the `mailto:` builder)
- GitHub Actions workflow: type-check, build, test on every push/PR; deploy to GitHub Pages on `main`

## Design

The idea: a career drawn as a transit map. Reasoning and full token tables are in
`PORTFOLIO-PLAN.md` / `PORTFOLIO-PLAN-v2.md` (kept in the repo root as design history). In short:

- Four line colors (`--line-java`, `--line-python`, `--line-devops`, `--line-ai`), each meeting WCAG
  AA contrast in both light and dark mode.
- Body text at 18px / 1.6 line-height / ≤66ch, sentence case, no all-caps labels, no `→` on buttons,
  no card grids with identical shadows, no percentage skill bars.
- Exactly one animated moment (the hero line drawing itself); everything else responds to a user
  action, and all of it is disabled under `prefers-reduced-motion`.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) 7, TypeScript strict |
| UI | Plain `.astro` components, vanilla TS `<script>` blocks — no React/Vue/Svelte |
| Styling | Plain CSS (`src/styles/tokens.css` + Astro scoped styles) — no Tailwind |
| Fonts | [Atkinson Hyperlegible Next](https://www.brailleinstitute.org/freefont/) + Mono, self-hosted via [Fontsource](https://fontsource.org) |
| Content | Astro content collections, Zod schemas, Markdown + MDX |
| Integrations | `@astrojs/mdx`, `@astrojs/sitemap`, `@astrojs/rss` |
| Tests | [Vitest](https://vitest.dev) |
| Hosting | GitHub Pages via GitHub Actions |

## Project structure

```
src/
  config/site.ts          # identity, section order/visibility, contact mode, socials, CV, theme defaults
  content.config.ts       # Zod schemas — a bad content file fails the build here
  content/
    experience/*.md       # one file per job
    projects/*.md          # optional — only rendered if the "projects" section is visible
    education.yaml
    certifications.yaml
    skills.yaml
    blog/*.mdx
  components/              # one file per home-page section, header, footer
  layouts/BaseLayout.astro # <head>, meta, no-flash theme script, CSP
  lib/                     # pure logic: readingTime, similarPosts, mailto builder, JSON-LD builders
  pages/                   # routes — see astro.build/en/guides/routing
public/
  cv/cv.pdf                # replace this file to update the CV download
  images/, favicon.svg, og-default.svg
.github/workflows/deploy.yml
```

## Getting started

Requires Node 22+.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # astro check + astro build -> dist/
npm run preview   # serve the production build locally
npm test          # vitest
```

> The plan called for `pnpm`. `pnpm` needs `corepack`, which needed elevated permissions this
> environment didn't have, so the project was built and is documented with `npm`. Nothing here is
> npm-specific — `pnpm install` / `pnpm dev` etc. work identically once `pnpm` is available.

## Make it yours

1. **Identity, sections, contact, socials, theme defaults, CV filename** — all in `src/config/site.ts`.
2. **Reorder or hide a home section** — reorder or toggle `visible` in `site.sections`. The nav, the
   station progress bar, and the page all update automatically.
3. **Jobs** — one Markdown file per job in `src/content/experience/`. `plain` is the one-liner
   everyone sees; the Markdown body is the technical detail behind "Show technical details".
4. **Projects** (optional) — Markdown files in `src/content/projects/`, then set the `projects`
   section's `visible: true` in `site.ts`.
5. **Education / certifications / skills** — edit the three YAML files in `src/content/`.
6. **Blog posts** — add an `.mdx` file to `src/content/blog/`. Set `draft: true` to hide a post in
   production while still previewing it in `npm run dev`.
7. **CV** — replace `public/cv/cv.pdf` and update `cv.updated` in `site.ts`. `/cv` is a printable page
   generated from the same content, in case someone wants a browser-print version.
8. **Contact form** — set `site.contact.mode` to `"mailto"` (default, no third party), `"formsubmit"`
   (free form backend, [sign up here](https://formsubmit.co) and paste the ID it gives you), or
   `"links"` (no form at all). The email address, copy button, and mailto link always show regardless
   of mode.
9. **Theme** — default mode/accent in `site.defaults`; visitors can still override from the theme
   menu, saved in their browser.
10. **Deploy** — see [Deploying](#deploying) below.

All of this can be edited directly on GitHub: press `.` on the repo page to open the
[github.dev](https://github.dev) editor, or use the pencil icon on any file. Commit, and the site
redeploys automatically.

## Content model & validation

Every collection has a Zod schema in `src/content.config.ts`. If a file doesn't match — a missing
field, a date in the wrong format, a `plain` summary over 220 characters — `npm run build` (or
`npm run dev`) fails with the file name and the exact field, for example:

```
[InvalidContentEntryDataError] experience → globex-bank data does not match collection schema.
  start: start must be YYYY-MM
```

The live site is never affected by a bad edit: the deploy workflow won't publish a build that fails,
so the last good version stays up.

## Contact form modes

| Mode | What happens | Setup |
|---|---|---|
| `mailto` (default) | JS builds a `mailto:` link from the form fields and opens the visitor's email app. Falls back to a plain `mailto:` form action with no JS. | None |
| `formsubmit` | Form posts to [FormSubmit](https://formsubmit.co) with a hidden honeypot field. | Confirm your address with FormSubmit once, then set `formsubmitId` |
| `links` | No form — just the email address, copy button, and socials. | None |

The email address, a **Copy email** button, and a plain `mailto:` link are always shown, so contact
still works even if a mode's backend is unavailable.

## Testing

```bash
npm run build   # astro check (types + content schemas) + astro build
npm test        # vitest — reading time, similar-post ranking, mailto builder
```

Manual checks worth running before you rely on this for real:

- **Keyboard pass** — tab through the whole page: skip link, station nav, theme menu (closes on Esc),
  "Show technical details" toggle, project filter chips, contact form, blog TOC, image lightbox.
- **All three contact modes** — set `site.contact.mode` to each value in turn and submit the form.
- **320px width** — no horizontal scroll (checked in DevTools' responsive mode).
- **`prefers-reduced-motion`** — the hero line should render fully drawn with no animation.
- **Lighthouse** (Chrome DevTools → Lighthouse, mobile) — this project was built to hit Performance
  ≥ 95, Accessibility 100, Best Practices ≥ 95, SEO 100, but wasn't run through an actual headless
  Chrome in this environment, so treat those as a target to verify rather than a guarantee.

## Deploying

**GitHub Pages (primary):**

1. Create a repo named `<your-username>.github.io` and push this code to it.
2. In **Settings → Pages → Source**, choose **GitHub Actions**.
3. Update `site: 'https://your-username.github.io'` in `astro.config.mjs` and `url` in
   `src/config/site.ts` to your real URL.
4. Push to `main`. `.github/workflows/deploy.yml` type-checks, builds, tests, and deploys.

**Cloudflare Pages (plan B / preview URLs on every PR):** connect the same GitHub repo in the
Cloudflare dashboard — build command `npm run build`, output directory `dist`. No code changes
needed.

**Custom domain:** add a `public/CNAME` file containing your domain, then point its DNS at GitHub
Pages per [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Acknowledgements

This site's design and feature set were shaped by two open-source reference projects — thank you to
both maintainers for sharing their work:

- [**Alexandru Moraru**](https://github.com/alemoraru/nextjs-portofolio-website) —
  Next.js personal site template.
- [**Radu Alexandru**](https://github.com/radualexandrub/radualexandrub.github.io) —
  React portfolio and blog.

Also built on [Astro](https://astro.build), [Fontsource](https://fontsource.org), and
[Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) (designed by the Braille
Institute for maximum legibility).

## License

Released under the [MIT license](./LICENSE).
