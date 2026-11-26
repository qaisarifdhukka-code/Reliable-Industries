# Tech Stack & Production Architecture

This document defines the mandatory technical architecture for rebuilding the Reliable Industries prototype into a **production-ready** website.

---

## 1. Core Frontend Stack

| Layer | Technology | Rules & Usage |
| :--- | :--- | :--- |
| **Framework** | **Astro** (latest stable) | Default rendering layer. Static-first output (`.astro` components) for zero unnecessary client JS. |
| **Language** | **TypeScript** (`strict`) | All `.ts`, `.tsx`, and Astro component props must be strictly typed. |
| **Styling** | **Tailwind CSS** | Custom theme tokens mapped directly from `docs/DESIGN_SYSTEM.md`. No arbitrary design-breaking utility guesswork. |
| **Interactivity** | **React Islands** (`@astrojs/react`) | Used **ONLY** for genuine client-side interactivity (`HeroCarousel`, `IndustriesCarousel`, `MobileNavDrawer`). |
| **UI Primitives** | Custom UI + selective **shadcn/ui** | Build exact 1:1 custom components first; use shadcn/ui primitives (e.g., accessible Sheet/Dialog) only when complex ARIA/focus-trap behavior warrants it, styled strictly to match the prototype. |
| **Icons** | **Lucide** (`lucide-react` / `@lucide/astro`) | Crisp icons sized/stroked to match prototype SVGs and arrows accurately. |
| **Animations** | **CSS Transitions** + **Motion** (selectively) | Prefer pure CSS transitions (`0.3s ease`, `0.5s ease-in-out`) matching the prototype. Only use Motion if a complex transition requires it. |
| **Images** | **Astro `<Image />` / `<Picture />`** | Local assets stored in `src/assets/images/` for automatic WebP/AVIF optimization, explicit dimensions, and zero layout shift (CLS). |
| **Fonts** | **Self-hosted `@fontsource/inter`** | Weights `400`, `600`, `700`, `800` bundled locally (eliminates external Google Fonts network delay and fixes the prototype's missing `800` weight). |

---

## 2. Astro vs React Island Architecture

```text
Astro (Static HTML + Zero JS by default)
├── BaseLayout.astro       -> <head>, SEO meta, Open Graph, Canonical, JSON-LD, Fonts
├── UtilityBar.astro       -> Static HTML + Lucide icons
├── Header.astro           -> Static desktop nav + mounts <MobileNavIsland client:media="(max-width: 768px)" />
├── HeroCarousel.tsx       -> React Island (client:load) — 3 slides, auto-advance, keyboard + touch swipe
├── ProductsSection.astro  -> Static HTML + Astro <Image />
├── WhyChooseUs.astro      -> Static HTML + semantic list + contact card
├── IndustriesSection.tsx  -> React Island (client:visible) — split image/text slider + 9-item selector
├── EngineeringSection.astro -> Static HTML + 6 cards + Astro <Image />
└── Footer.astro           -> Static HTML + legal links
```

### Architecture Rule
- **Do NOT convert static sections into React components.**
- **Hydrate islands smartly:** `client:load` only for above-the-fold `HeroCarousel`; `client:visible` for below-the-fold `IndustriesSection`; `client:media` for `MobileNavDrawer` so desktop loads zero mobile-nav JS.

---

## 3. Production SEO, Performance & Accessibility

### SEO Requirements
- **Metadata Component (`src/components/seo/SeoHead.astro`):**
  - Dynamic `<title>` and `<meta name="description">`
  - `<link rel="canonical" href={canonicalUrl} />` on every indexable page
  - Full Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`) and Twitter Card (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- **Sitemap & Robots:**
  - `@astrojs/sitemap` configured with `site` URL
  - `public/robots.txt` pointing to `sitemap-index.xml`
- **Structured Data (JSON-LD / Schema.org):**
  - `Organization` and `WebSite` schema injected via `<script type="application/ld+json">`
  - Values sourced from `src/config/site.ts` (use explicit `TBD` markers where real company details haven't been provided yet).

### Performance Requirements
- Static-first output with minimal JS payload.
- All images optimized via `astro:assets` (`loading="eager"` + `fetchpriority="high"` for Slide 1 hero image; `loading="lazy"` for below-the-fold images).
- Zero layout shift: explicit width/height or `aspect-ratio` containers on images.
- Clean Lighthouse targets (Performance, Accessibility, Best Practices, SEO).

### Accessibility & Semantic HTML (WCAG-Conscious)
- **Single `<h1>` Rule:** The prototype placed `<h1>` in Header logo, Footer logo, and all 3 Hero slides. In Astro:
  - Header & Footer logos use `<span>` / `<div>` with identical CSS styling.
  - Only the primary visible Hero heading uses `<h1>` (or Slide 1 `<h1>`, Slides 2–3 `<h2>` with identical visual typography class) so screen readers and SEO crawlers see a clean heading hierarchy (`h1 -> h2 -> h3`).
- Semantic landmarks: `<header>`, `<nav aria-label="...">`, `<main>`, `<section>`, `<footer>`.
- Keyboard navigation & ARIA:
  - `aria-label` on icon-only buttons (carousel prev/next, indicators, hamburger button, close button).
  - `aria-live="polite"` or accessible region labels on carousels.
  - Proper `:focus-visible` outlines on all links, buttons, and inputs.
  - `prefers-reduced-motion: reduce` support for auto-advancing hero carousel and transitions.

---

## 4. Hosting, Version Control & Project Structure

- **Target Hosting:** Cloudflare Pages (pure static Astro output; zero backend server and zero external CMS such as Sanity required).
- **Local Data Architecture:** All company config (`src/config/site.ts`), products, industries, certificates, and page content live in static typed TypeScript / JSON data files bundled at build time.
- **Version Control:** Git + GitHub. Clean `.gitignore` (`node_modules/`, `dist/`, `.astro/`, `_reference/`, `.env*`).
- **Environment Variables:** Use `.env` / `.env.example` for environment-specific URLs (`PUBLIC_SITE_URL`) when required.
- **Prototype Archive:** During Phase 0 setup, move prototype files (`index.html`, `style.css`) into `_prototype/` for permanent visual side-by-side reference without interfering with Astro's `src/` or `public/`.

---

## 5. Forbidden Technologies (Never Introduce Unless Explicitly Approved)

- Next.js
- Redux / Zustand
- Express / Node.js backend or server-side APIs
- External headless CMS (`Sanity`, `@sanity/astro`, Contentful, Strapi)
- Firebase / MongoDB / PostgreSQL / GraphQL
- Heavy UI component libraries (MUI, Chakra, Ant Design, Bootstrap)
- Heavy animation libraries (GSAP, Three.js, Lottie unless explicitly requested)
- Unnecessary client-side JavaScript or SPA routing
