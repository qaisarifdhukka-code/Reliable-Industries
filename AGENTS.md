# AGENTS.md — Operating Contract & Hard Guardrails

> **This file is automatically loaded on every turn.**
> Follow every rule here strictly. Never improvise, redesign, or skip ahead.

---

## 1. Project Identity & Mission

Maintain and expand the **Reliable Industries** website (**Astro + TypeScript + Tailwind CSS + React Islands**) from the completed Phase 1 prototype rebuild and Phase 2 section buildout into **Phase 3: Production Data & Multi-Page Integration**.

**Non-negotiable pillars:**
1. **Strict UI Consistency (Our Reliable Industries Design System):** Phase 1 sections match the prototype 1:1 on desktop. All Phase 2/3 sections, pages, and product views must follow **our exact Reliable Industries UI** (`docs/DESIGN_SYSTEM.md`) — never introduce foreign/legacy UI, styling, or AI slop.
2. **Full Responsiveness (Mandatory):** Every section, page, and product view must work cleanly across **all viewports** (`375px`, `576px`, `768px`, `1024px`, `1280px`, `1440px`) with zero horizontal overflow and touch-friendly controls.
3. **Keep `docs/` Synchronized:** Always update `docs/SECTION_BLUEPRINT.md` and `docs/PROGRESS.md` (plus `docs/DESIGN_SYSTEM.md` if needed) whenever building new sections/pages or migrating real data.

---

## 2. Mandatory Turn-Start Protocol

Before writing or editing ANY code, ALWAYS read:
1. [`docs/PROGRESS.md`](docs/PROGRESS.md) — identify the **single currently active section**.
2. [`docs/SECTION_BLUEPRINT.md`](docs/SECTION_BLUEPRINT.md) — read the exact spec for that active section only.
3. [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — verify exact colors, spacing, radii, and inline overrides.

---

## 3. Hard Behavioral Rules (Never Violate)

### Rule 1 — Zero Assumptions
- Never guess missing requirements, link destinations, dropdown menu items, modal behavior, contact details, or SEO company data.
- If a detail is ambiguous or not locked in `docs/`, **STOP and ask the user** before implementing it.
- Keep unknown business data (production domain, address, phone, social links) explicitly marked as `TBD` in a centralized config (`src/config/site.ts`). Never fabricate fake contact info.

### Rule 2 — Content Policy (Option A → Phase 3 Verified Data Extraction)
- **Baseline (Option A):** Unmigrated sections retain length-matched **Lorem Ipsum** for editorial slots while keeping prototype brand/nav/CTA chrome (`Reliable Industries`, `PIONEER IN SEALING`, etc.).
- **Phase 3 Source-Repo Data Extraction:** When replacing placeholders with real production data from the user's existing Git repository (built previously with poor UI/UX):
  1. **Extract Data Only — Never Copy Legacy UI/UX:** Harvest strictly factual content (headings, copy, technical specs, categories, products, industries, certificates, company/contact metadata, routes, validated media). Strictly **reject and never copy** the source repository's HTML structure, CSS styling, layout patterns, UI components, or dependencies.
  2. **Zero Fabrication:** Use only verified data present in the supplied repository or explicitly confirmed by the user. Never invent missing specs, testimonials, or business info — mark any missing fields as `TBD`.
  3. **Respect UI Chrome & Brand Fit:** Integrate extracted content strictly into **our Reliable Industries UI** (`#003B6D`, `#009FE3`, `#FFE600`, `#F4F6F8`, `#FFFFFF`, Inter, crisp `0px`/`2px`/`4px` corners) without bloating card heights or breaking responsive grids.

### Rule 3 — Zero UI Drift & Phase 2 Input Scenarios
- **Phase 1 Lock:** Replicate what rendered in Chrome for `_prototype/index.html` (including inline overrides documented in `docs/DESIGN_SYSTEM.md`). Never alter existing approved sections unless requested.
- **Phase 2 Scenario 1 (Reference Screenshot):** When the user provides a screenshot of a new section, page, or component, use it **strictly as a layout/format reference** — do **not** copy its literal colors, fonts, shadows, or third-party aesthetics. Translate that layout structure into **our Reliable Industries UI** (`#003B6D`, `#009FE3`, `#FFE600`, `#F4F6F8`, `#FFFFFF`, Inter typography, `.site-container` `1280px`, `0px`/`2px`/`4px` radii).
- **Phase 2 Scenario 2 (Name Only):** When the user provides only a section or page name, design and build its layout from scratch strictly following **our Reliable Industries UI**, tech stack, and Option A content rules.
- **Full Responsiveness:** Every new section and page must adapt cleanly across mobile (`375px`, `576px`), tablet (`768px`, `1024px`), and desktop (`1280px+`) without breaking desktop spacing.
- **Semantic HTML:** Keep one `<h1>` per page (logos use `<span>`/`<div>` with identical visual styles) and use proper landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) and per-page SEO metadata (`<SeoHead />`).

### Rule 4 — Zero "AI Slop" UI (Strictly Banned)
Do **NOT** introduce any of the following anywhere in the codebase:
- Glassmorphism (`backdrop-blur`), frosted overlays, or translucent floating bars.
- Soft glowing shadows, colored shadows, or overly heavy drop shadows beyond `docs/DESIGN_SYSTEM.md`.
- Mesh gradients, decorative gradient blobs, or floating pill tags/badges not requested.
- Rounded pill buttons (`rounded-full`) or rounded cards (`rounded-xl`, `rounded-2xl`). Respect exact radii: `0px` (Hero/Innovation/Industries buttons), `2px` (Product cards), `4px` (`.btn`, `.contact-card`), `50%` (strictly circular controls/icons/social badges).
- Unrequested extra sections, widgets, stats bars, newsletters, or filler blocks that the user did not ask for.
- Dark mode toggles, gratuitous hover bounce/scale animations, or unrequested CSS sparkle effects.

### Rule 5 — Section-by-Section / Page-by-Page / Product-by-Product Gate & Docs Sync
- Work strictly **one requested section, page, or product batch at a time** (do not bulk-dump the entire site in one unreviewed sweep).
- Before/while building any new section/page or migrating Phase 3 data, **update `docs/SECTION_BLUEPRINT.md` and `docs/PROGRESS.md`** with its spec/migration record and active status.
- After completing the active item:
  1. Run typecheck/build (`npx astro check` and `npm run build` with `ASTRO_TELEMETRY_DISABLED=1` — zero errors/warnings/hints).
  2. Verify desktop (`1440px` & `1280px`), tablet (`768px` & `1024px`), and mobile (`375px`) responsiveness.
  3. Update `docs/PROGRESS.md` to `Awaiting Approval` (and `docs/` with final implementation details).
  4. **STOP and wait for the user's explicit approval** before moving to the next section, page, or product.

### Rule 6 — Tech Stack Discipline
Follow [`docs/TECH_STACK.md`](docs/TECH_STACK.md) strictly:
- **Astro** is the default rendering layer (static HTML first).
- **React Islands (`.tsx`)** are used **ONLY** for components requiring genuine client-side state/interactivity (Mobile Navigation Drawer, Hero Carousel, Industries Interactive Carousel). Never wrap static sections in React.
- Use **TypeScript** (strict), **Tailwind CSS**, **Lucide** icons, **Astro `<Image />`**, and **self-hosted Inter font** (`@fontsource/inter`).
- **Forbidden unless explicitly requested:** Next.js, Redux, Zustand, Express/Node backend, Firebase, MongoDB, PostgreSQL, GraphQL, heavy UI frameworks, heavy animation libraries.

---

## 4. Reference Documentation Index

| File | What It Governs |
| :--- | :--- |
| [`docs/TECH_STACK.md`](docs/TECH_STACK.md) | Core stack, Astro Islands boundary, SEO/JSON-LD, Cloudflare readiness, banned tech |
| [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) | Exact colors, fonts, spacing, radii, buttons, breakpoints, inline-override audit |
| [`docs/SECTION_BLUEPRINT.md`](docs/SECTION_BLUEPRINT.md) | Section-by-section spec (Phase 0 + Sections 1–8), desktop 1:1 & mobile layout rules |
| [`docs/PROGRESS.md`](docs/PROGRESS.md) | Active section lock, approval status, `TBD` decisions, build verification log |
