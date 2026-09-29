# Graph Report - portofolio-commit  (2026-09-29)

## Corpus Check
- Corpus is ~20,643 words - fits in a single context window. You may not need a graph.

## Summary
- 272 nodes · 359 edges · 28 communities (17 shown, 11 thin omitted)
- Extraction: 85% EXTRACTED · 14% INFERRED · 0% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.88)
- Token cost: 407,528 input · 0 output

## Community Hubs (Navigation)
- Layout, Site Config & OG Image
- Homepage Section Components
- Portfolio Plan & CV Career
- Lib Utilities & Blog Pages
- Build Tooling & Scripts
- Data Pipeline Testing Story
- Canary Deploy Story
- Deploy, Hosting & CSP
- Grounded Docs Assistant
- Content Collection Schemas
- Runtime Dependencies
- Luxoft Client Projects
- Favicon Monogram Identity
- Plan v2 References
- Canary Diagram Flow
- TypeScript Config
- Contact Form Evolution
- Astro Dev Server Mode
- Astro Docs Guides
- Performance Budget
- SEO & Discovery
- Typography Choice
- Pages CMS Option
- Profile Photo
- Copilot Certification
- B.Sc. Education Entry
- M.Sc. Education Entry

## God Nodes (most connected - your core abstractions)
1. `Site` - 13 edges
2. `astro` - 8 edges
3. `Francis Patrick Diallo (CV subject)` - 8 edges
4. `Luxoft (DXC)` - 8 edges
5. `Canary Deploy Toolkit (project)` - 7 edges
6. `scripts` - 6 edges
7. `readingTime()` - 6 edges
8. `Regular DevOps Engineer at ASML (via Luxoft)` - 6 edges
9. `What a data pipeline test actually needs (blog post)` - 6 edges
10. `Northwind Labs - Senior Engineer, Platform & AI` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Make it yours customization steps` --references--> `Francis Patrick Diallo (CV subject)`  [INFERRED]
  README.md → public/cv/Francis-Patrick_Diallo_CV_2026_latest.pdf
- `Astro dev --background server mode` --semantically_similar_to--> `Astro dev --background server mode`  [INFERRED] [semantically similar]
  AGENTS.md → CLAUDE.md
- `Astro documentation guides (routing, components, content collections, styling, i18n)` --semantically_similar_to--> `Astro documentation guides (routing, components, content collections, styling, i18n)`  [INFERRED] [semantically similar]
  AGENTS.md → CLAUDE.md
- `Formspree contact form (formspreeId)` --semantically_similar_to--> `Web3Forms contact form (v1)`  [INFERRED] [semantically similar]
  README.md → PORTFOLIO-PLAN.md
- `Career line transit-map design (v1)` --conceptually_related_to--> `Francis Patrick Diallo (CV subject)`  [INFERRED]
  PORTFOLIO-PLAN.md → public/cv/Francis-Patrick_Diallo_CV_2026_latest.pdf

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Evolution of contact form approach (Web3Forms -> mailto/FormSubmit -> Formspree)** — portfolio_plan_web3forms_contact, portfolio_plan_v2_mailto_contact_mode, portfolio_plan_v2_formsubmit_contact_mode, readme_formspree_contact [INFERRED 0.85]
- **Timetable scheduling research line (thesis, MDPI paper, Timefold talk)** — public_cv_francis_patrick_diallo_cv_2026_latest_master_thesis_timetable, public_cv_francis_patrick_diallo_cv_2026_latest_teaching_scheduling_paper, public_cv_francis_patrick_diallo_cv_2026_latest_timefold_conference_talk, public_cv_francis_patrick_diallo_cv_2026_latest_timefold [INFERRED 0.85]
- **GitHub Pages CI build-and-deploy flow** — _github_workflows_deploy_build_job, _github_workflows_deploy_deploy_job, readme_github_pages_deploy, portfolio_plan_v2_deploy_pipeline [INFERRED 0.85]
- **Self-rolling-back canary deploys (blog, toolkit, Northwind role)** — src_content_blog_canary_deploys_that_roll_back_themselves, src_content_blog_canary_deploys_that_roll_back_themselves_shouldpromote, src_content_projects_pipeline_canary, src_content_experience_northwind_labs_canary_release_pipeline [INFERRED 0.85]
- **Grounded internal docs assistant (blog, project, Northwind role, RAG skill)** — src_content_blog_grounding_an_assistant_in_docs_that_change, src_content_projects_docs_assistant, src_content_experience_northwind_labs_rag_search_assistant, src_content_skills_retrieval_augmented_generation [INFERRED 0.85]
- **Three minimal pipeline checks run at the write boundary** — src_content_blog_what_a_data_pipeline_test_actually_needs_schema_check, src_content_blog_what_a_data_pipeline_test_actually_needs_row_count_sanity, src_content_blog_what_a_data_pipeline_test_actually_needs_null_rate_check, src_content_blog_what_a_data_pipeline_test_actually_needs_boundary_checks [EXTRACTED 1.00]
- **Canary deploy decision flow** — public_images_diagram_canary_stable_v1, public_images_diagram_canary_canary_v2, public_images_diagram_canary_compare_metrics, public_images_diagram_canary_promote, public_images_diagram_canary_roll_back [EXTRACTED 1.00]

## Communities (28 total, 11 thin omitted)

### Community 0 - "Layout, Site Config & OG Image"
Cohesion: 0.07
Nodes (22): Default Open Graph Image (og-default.svg), Commit/Branch Graph Motif (3 colored nodes on baseline), Dark Navy Palette (#0E1621 bg, coral/blue/green accents), Placeholder Identity Text ('Your Name' / 'Software engineer'), ref_astro_content, @astrojs/rss, @fontsource-variable/cormorant-garamond, buildDate (+14 more)

### Community 1 - "Homepage Section Components"
Cohesion: 0.09
Nodes (13): ref_astro_assets, [profilePath], posts, status, string, jobs, categories, projects (+5 more)

### Community 2 - "Portfolio Plan & CV Career"
Cohesion: 0.08
Nodes (27): Part B build prompt (v1), Career line transit-map design (v1), Content model: site.ts + content collections with Zod schemas, Station scroll-progress bar / section nav, Two-layer content (plain summary + technical details), Career line transit-map design (v2), Portfolio plan v2, site.sections order/visibility config (+19 more)

### Community 3 - "Lib Utilities & Blog Pages"
Cohesion: 0.10
Nodes (18): vitest, blogPostingJsonLd(), breadcrumbJsonLd(), personJsonLd(), readingTime(), jaccard(), similarPosts(), TaggedPost (+10 more)

### Community 4 - "Build Tooling & Scripts"
Cohesion: 0.08
Nodes (24): allowScripts, esbuild, devDependencies, @astrojs/check, typescript, vitest, engines, node (+16 more)

### Community 5 - "Data Pipeline Testing Story"
Cohesion: 0.15
Nodes (18): What a data pipeline test actually needs (blog post), Run checks at the write boundary, Null-rate check, Row-count sanity check, Schema check, DataLoom - Software Engineer, Data Platform, Tested pipeline framework with schema checks and staging, Globex Bank - Backend Engineer (+10 more)

### Community 6 - "Canary Deploy Story"
Cohesion: 0.24
Nodes (13): Canary Deploy Flow Diagram, Canary Deploy, Canary deploys that roll back themselves (blog post), Automatic canary rollback with Slack report, Canary error-budget check, Northwind Labs - Senior Engineer, Platform & AI, GitHub Actions canary release pipeline with automatic rollback, Canary Deploy Toolkit (project) (+5 more)

### Community 7 - "Deploy, Hosting & CSP"
Cohesion: 0.15
Nodes (13): Deploy workflow: build job, Deploy workflow: deploy job (actions/deploy-pages), Pages concurrency group (cancel-in-progress), Astro static framework choice (v1), GitHub Pages hosting via GitHub Actions (v1), Meta http-equiv Content-Security-Policy, Cloudflare Pages plan B, Planned deploy pipeline (astro check, vitest, build, pagefind, deploy-pages) (+5 more)

### Community 8 - "Grounded Docs Assistant"
Cohesion: 0.29
Nodes (10): Grounding an assistant in docs that change weekly (blog post), Always show the source, Re-index on write (webhook re-embed), Claude Certified Associate - Foundations (Anthropic), Internal retrieval-augmented search assistant, Internal Docs Assistant (project), Skill group: AI & search, Claude / Anthropic API (+2 more)

### Community 9 - "Content Collection Schemas"
Cohesion: 0.20
Nodes (9): blog, certifications, collections, education, experience, levelEnum, projects, skills (+1 more)

### Community 10 - "Runtime Dependencies"
Cohesion: 0.25
Nodes (8): dependencies, astro, @astrojs/mdx, @astrojs/rss, @astrojs/sitemap, @fontsource-variable/atkinson-hyperlegible-mono, @fontsource-variable/atkinson-hyperlegible-next, @fontsource-variable/cormorant-garamond

### Community 11 - "Luxoft Client Projects"
Cohesion: 0.32
Nodes (8): Avaya CE CRM Connector (Junior Java Developer), Avaya Workplace Client Windows-to-Linux migration, Daikin CRM Connector (SAP API integration), GenAI Platform (RAG, ChromaDB, FastAPI), JAIG Java AI-powered Code Generator, Luxoft (DXC), Luxoft Internship Programme mentor, Vodafone Ziggo Message Converter (Python)

### Community 12 - "Favicon Monogram Identity"
Cohesion: 0.33
Nodes (6): favicon.svg (DFP Monogram Favicon), C2PA Content Credentials Manifest, Classic Parchment Visual Identity, Dancing Script Font, DFP Script Monogram, parch1d Parchment Radial Gradient

### Community 13 - "Plan v2 References"
Cohesion: 0.40
Nodes (5): Part B build prompt (v2) with skills per phase, Feature parity matrix (Apply/Adapt/Drop), nextjs-portofolio-website reference repo, radualexandrub.github.io reference repo, npm used instead of pnpm

### Community 14 - "Canary Diagram Flow"
Cohesion: 0.40
Nodes (5): Canary v2 (5% traffic), Compare Metrics, Promote, Roll Back, Stable v1

### Community 15 - "TypeScript Config"
Cohesion: 0.40
Nodes (4): astro/tsconfigs/strict, exclude, extends, include

### Community 16 - "Contact Form Evolution"
Cohesion: 0.67
Nodes (4): FormSubmit contact mode (optional), mailto compose contact mode (default), Web3Forms contact form (v1), Formspree contact form (formspreeId)

## Ambiguous Edges - Review These
- `site.ts` → `Placeholder Identity Text ('Your Name' / 'Software engineer')`  [AMBIGUOUS]
  public/og-default.svg · relation: conceptually_related_to

## Knowledge Gaps
- **115 isolated node(s):** `name`, `type`, `version`, `node`, `dev` (+110 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **11 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `site.ts` and `Placeholder Identity Text ('Your Name' / 'Software engineer')`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `astro` connect `Build Tooling & Scripts` to `Layout, Site Config & OG Image`, `Homepage Section Components`, `Content Collection Schemas`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Runtime Dependencies` to `Build Tooling & Scripts`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **Why does `@fontsource-variable/atkinson-hyperlegible-mono` connect `Build Tooling & Scripts` to `Layout, Site Config & OG Image`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Francis Patrick Diallo (CV subject)` (e.g. with `Career line transit-map design (v1)` and `Make it yours customization steps`) actually correct?**
  _`Francis Patrick Diallo (CV subject)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `name`, `type`, `version` to the rest of the system?**
  _115 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Layout, Site Config & OG Image` be split into smaller, more focused modules?**
  _Cohesion score 0.07087486157253599 - nodes in this community are weakly interconnected._