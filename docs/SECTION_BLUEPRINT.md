# Section-by-Section Development Blueprint

Develop strictly in order from **Phase 0** through **Section 8**.
Every editorial content slot (headings, kickers, card titles/descriptions, why-choose-us items, industry names/descriptions, footer blurb) uses **length-matched Lorem Ipsum** (preserving the exact word/line length of the prototype so layout & card proportions stay 1:1), while brand labels, nav items, and CTA button text stay as shown in the prototype (**Option A**).

---

## Phase 0: Project Setup, Prototype Archive & SEO Shell
- **Deliverables:**
  1. Archive original `index.html`, `style.css`, and `images/` into `_prototype/` for side-by-side reference.
  2. Initialize Astro + TypeScript (strict) + Tailwind CSS + `@astrojs/react` + `@astrojs/sitemap` + `@fontsource/inter` + `lucide-react` / `@lucide/astro`.
  3. Set up `src/config/site.ts` (central metadata & JSON-LD config with `TBD` placeholders for real domain/company data).
  4. Set up `src/components/seo/SeoHead.astro` (title, description, canonical, OG, Twitter, JSON-LD `Organization` + `WebSite`), `public/robots.txt`, and `src/layouts/BaseLayout.astro`.
  5. Copy used images into `src/assets/images/` for Astro `<Image />` optimization.
- **Done When:** Empty shell page builds cleanly with zero errors, self-hosted Inter loads locally, SEO head + `robots.txt` + sitemap generate properly.

---

## Section 1: Utility Bar
- **Type:** Static Astro (`src/components/UtilityBar.astro`)
- **Prototype Ref:** `index.html:18–31`, `style.css:182–203`
- **Desktop 1:1 Spec:**
  - Full-width `#003B6D` bar, `0.8rem` white text, `0.5rem 0` padding.
  - Flex `justify-between items-center` inside `.container`.
  - Left: 1 short brand label (3 words). Right: 4 inline links (`margin-left: 1.5rem`, hover `#009FE3`).
- **Mobile Spec (`<= 768px`):**
  - Hidden on top bar (`display: none`), matching prototype. *(Links accessible inside Mobile Nav Drawer in Section 2 if confirmed by user.)*

---

## Section 2: Main Header & Mobile Navigation
- **Type:** Static Astro Header (`src/components/Header.astro`) + React Island (`src/components/MobileNav.tsx` with `client:media="(max-width: 768px)"`)
- **Prototype Ref:** `index.html:33–60` & `493–500`, `style.css:147–180`, `205–265`, `1162–1195`
- **Desktop 1:1 Spec:**
  - Sticky header (`top: 0; z-index: 100`), white bg, `0.8rem 0` padding (`0.5rem 0` when scrolled > 40px), shadow `0 2px 10px rgba(0,0,0,0.05)`.
  - Logo uses `<span>`/`<div>` (NOT `<h1>`) styled identically: two italic `1.5rem` words side-by-side (`gap: 6px`), `1px` navy top border on `0.55rem` italic uppercase tagline.
  - Right nav: 4 links (`gap: 2rem`), active item cyan (`#009FE3`) with `4px` top bar spanning its width (`top: -12.8px`). Carets via Lucide `ChevronDown` sized `0.7rem`.
  - Search box: minimal bottom border (`1px solid #94A3B8`), Lucide `Search` (`16px`), `80px` input expanding to `130px` on focus.
- **Mobile Spec (`<= 768px`):**
  - Hamburger button (`44x44px` touch target, `aria-expanded`, `aria-controls`) toggles slide-down/slide-over drawer (`MobileNav.tsx` Island).
  - Drawer includes mobile nav items, search input, and utility bar links cleanly stacked, with `Escape` key & backdrop close + focus management.
  - Placeholder `href="#"` links remain non-invented until real pages exist.

---

## Section 3: Hero Carousel
- **Type:** React Island (`src/components/HeroCarousel.tsx`, `client:load`) + Astro `<Image />` pre-optimized backgrounds passed as URLs/sources
- **Prototype Ref:** `index.html:62–184` & `511–537`, `style.css:266–409`
- **Desktop 1:1 Spec:**
  - `min-height: 85vh`, horizontal `translateX(-N * 100%)` track (`0.5s ease-in-out`), auto-advance every 5s (pauses on hover/focus and respects `prefers-reduced-motion`).
  - **Slide 1:** `hero_pharma_light.jpg`, white gradient overlay (`100% -> 95% at 30% -> 0%`), `#003B6D` text, dark navy sharp-corner button (`border-radius: 0`), outline circular shield badge (`35x35px`). Note: Slide 1 title uses `<h1>`; Slides 2 & 3 use `<h2>` with identical styling.
  - **Slide 2:** `product_seal_2_1790081868989.jpg`, cyan gradient overlay (`rgba(0,159,227,1) -> 0.9 at 45% -> 0`), white text, yellow `#FFE600` sharp-corner button (`#002038` text), solid white circular `+` badge.
  - **Slide 3:** `mission_hero_bg.jpg`, white gradient overlay (`100% -> 0.9 at 60% -> 0.2`), `#003B6D` text, dark navy sharp-corner button, outline circular star badge.
  - Prev/Next circular `40x40px` buttons (`left: 20px`, `right: 20px`) + bottom center dot indicators (`10x10px`).
- **Mobile Spec (`<= 768px` / `<= 576px`):**
  - Adjust `min-height` (e.g. `540px`–`600px`) and add safe horizontal padding (`px-12` or move prev/next arrows cleanly to bottom or smaller side offsets) so arrows never overlap hero text!
  - Strengthen gradient overlay on small viewports (cover `85%–100%`) so text contrast remains WCAG-compliant over the background photo.
  - Scale `hero-title` smoothly down to `1.85rem–2.2rem` on `375px` screens; support touch swipe left/right.

---

## Section 4: Products Section
- **Type:** Static Astro (`src/components/ProductsSection.astro`) + Astro `<Image />`
- **Prototype Ref:** `index.html:186–238`, `style.css:410–499`
- **Desktop 1:1 Spec:**
  - `#F4F6F8` bg, `5rem 0` padding.
  - Section header: cyan kicker + `2.2rem` navy `h2` (`margin-bottom: 3rem`).
  - `4-column` grid (`gap: 1.5rem`):
    - Cards 1–3: white bg, `1px solid #e2e8f0`, `border-radius: 2px`, `220px` white image box (`object-fit: contain`, `padding: 2rem`), `border-top: 1px solid #F4F6F8` info box (`1.5rem` padding), `h3`, short paragraph, cyan `Learn more ->` link. Images: `product_seal_1_1790081847592.jpg`, `product_seal_2_1790081868989.jpg`, `product_seal_1_1790081847592.jpg`.
    - Card 4 (Highlight): `#003B6D` bg, centered vertically, `2rem` padding, white `h3`, `#cbd5e1` paragraph, yellow `.btn-accent` (`border-radius: 4px`).
- **Mobile Spec:**
  - `<= 1024px`: `grid-template-columns: repeat(2, 1fr)`.
  - `<= 640px`: `grid-template-columns: 1fr`, reduce image box height slightly (`180px`–`200px`) and section padding (`3.5rem 0`).

---

## Section 5: Why Choose Us
- **Type:** Static Astro (`src/components/WhyChooseUs.astro`)
- **Prototype Ref:** `index.html:240–308`, `style.css:500–642`
- **Desktop 1:1 Spec:**
  - White bg, `4rem 0` padding.
  - Flex split (`gap: 4rem`, `align-items: flex-start`): Left (`flex: 2`), Right Contact Card (`flex: 1`).
  - Left: `2.2rem` title, `1.05rem` intro (`max-width: 800px`), `1.4rem` sub-heading, `2x2` grid (`gap: 1.5rem`) of 4 feature items (each with `24x24px` cyan circular checkmark, bold navy title, cyan `->`, and description indented `padding-left: 2.5rem`).
  - Right Contact Card: white bg, `3rem 2.5rem` padding, `shadow: 0 10px 40px rgba(0,0,0,0.08)`, `border-radius: 4px`, decorative top-right `100x100px` partial cyan gradient circle (`top: -30px; right: -30px; opacity: 0.8`), light-grey kicker, `1.8rem` title, `0.95rem` desc, full-width cyan `.btn-primary`.
- **Mobile Spec:**
  - `<= 960px` / `<= 768px`: stack split vertically (`flex-direction: column`, `gap: 2.5rem`), contact card full-width (`max-width: 100%`).
  - `<= 576px`: collapse the 4-item `.why-list` grid from `2 cols` to `1 col`; adjust contact card padding (`2rem 1.5rem`).

---

## Section 6: Industries Interactive Section
- **Type:** React Island (`src/components/IndustriesSection.tsx`, `client:visible`) + Astro `<Image />` optimized URLs
- **Prototype Ref:** `index.html:310–342` & `540–660`, `style.css:644–795`
- **Desktop 1:1 Spec:**
  - `#F4F6F8` bg, `6rem 0` padding.
  - Top header: `#003B6D` kicker (`letter-spacing: 1px`, `margin-bottom: 1rem`), `2.5rem` `h2` (`max-width: 600px`), `1.1rem` intro (`max-width: 800px`, `margin-bottom: 3rem`).
  - Split flex (`gap: 4rem`, `align-items: flex-start`):
    - Left image window (`flex: 1.3; max-width: 60%; aspect-ratio: 16/10; overflow: hidden`) with sliding `translateX` image track (`0.5s ease-in-out`).
    - Right content (`flex: 1; max-width: 45%`): `40x40px` square dark-navy prev/next buttons (`gap: 2px`, hover `#009FE3`), sliding text track (`h3`, `p`, sharp-corner outline button `.btn-outline-dark`), and `3-column` grid of 9 clickable industry links (`#94A3B8` inactive, `#003B6D` bold active).
- **Mobile Spec:**
  - `<= 960px` / `<= 768px`: stack split vertically (`gap: 2rem`), left image `max-width: 100%; width: 100%;`, right content `max-width: 100%; width: 100%;`.
  - Collapse 9-item `.industry-links-grid` to `2 cols` on tablet/mobile (`1 col` on `<= 400px` if needed) with comfortable touch tap height (`min-height: 36px` / generous padding).
  - Ensure all 9 slide heights don't clip or jump awkwardly on narrow screens.

---

## Section 7: Engineering & Resources
- **Type:** Static Astro (`src/components/EngineeringSection.astro`) + Astro `<Image />`
- **Prototype Ref:** `index.html:344–432`, `style.css:1026–1160`
- **Desktop 1:1 Spec:**
  - `#FFFFFF` bg (inline override wins), `80px 0` padding.
  - Header: **left-aligned** (since `.text-center` has no CSS rule), cyan kicker, navy `h2`, `margin-bottom: 40px`.
  - `3-column` grid (`gap: 20px`) of 6 horizontal cards (`40%` image left, `60%` content right, `20px 15px` padding, sharp `0px` corners on `.btn-cyan` and `.btn-outline-cyan` buttons).
  - Card 3 (`Product video`): cyan `60x60px` circular play overlay centered on image.
  - Card 5 (`Quality Assurance`): image uses `object-fit: contain; padding: 10px;` instead of `cover`.
- **Mobile Spec:**
  - Already partially defined in prototype (`<= 1200px`: `2 cols`; `<= 768px`: `1 col`; `<= 576px`: horizontal card stacks image `200px` tall on top, content below). Preserve and refine spacing cleanly (`object-fit: contain` maintained on Card 5).

---

## Section 8: Footer
- **Type:** Static Astro (`src/components/Footer.astro`)
- **Prototype Ref:** `index.html:436–489`, `style.css:873–974`
- **Desktop 1:1 Spec:**
  - `#003B6D` bg, `padding-top: 5rem`.
  - 4-column grid (`2fr 1fr 1fr 1.5fr`, `gap: 3rem`, `margin-bottom: 4rem`):
    - Col 1: Vertical stacked white logo (`<span>`/`<div>`, no tagline), `#cbd5e1` paragraph, 3 circular `36x36px` social buttons (`in`, `yt`, `x`, `rgba(255,255,255,0.1)`, hover `#009FE3`).
    - Col 2 & Col 3: `1.1rem` heading with `30px x 2px` cyan underline (`::after`), 4 vertical links.
    - Col 4: Heading + 3 links + `.btn-primary` CTA (`margin-top: 15px`).
  - Bottom bar (`#002038` bg, `1.5rem 0` padding, `0.85rem`, `#94a3b8`): copyright left, 3 legal links right (`gap: 1.5rem`).
- **Mobile Spec:**
  - `<= 1024px`: `2 cols` tablet grid; `<= 768px`: `1 col` grid (`gap: 2rem`), stack bottom bar (`flex-direction: column; gap: 1rem; text-align: center;`), center/wrap `.legal-links`.

---

## Phase 2: New Sections & Pages Process

> All Phase 1 sections (`Phase 0` – `Section 8`) are complete and approved. Every new section or page added from here follows the workflow below and must be appended here as a numbered spec.

### Input Scenarios
1. **Scenario 1 — Reference Screenshot:** User provides a screenshot of a new section, page, or component. Extract **layout format and structure only** (never copy literal colors, fonts, or outside styling) and build it using **our Reliable Industries UI** (`docs/DESIGN_SYSTEM.md`), Option A Lorem Ipsum (unless real copy is provided), and full responsiveness across all viewports.
2. **Scenario 2 — Name Only:** User provides a section or page name. Design and build it from scratch matching **our Reliable Industries UI**, semantic HTML (one `<h1>` per page + `<SeoHead>` metadata/JSON-LD on new pages), Astro static-first architecture (React Islands only when interactive state is genuinely needed), and full responsiveness.

### Standard Page Shell for New Pages
- Reuse `<BaseLayout>` (`<SeoHead />` with unique title, description, canonical path, and Schema.org JSON-LD), `<UtilityBar />`, `<Header />`, `<main id="main-content">...</main>`, and `<Footer />` (extract shared page chrome cleanly or compose identically).

*(New Phase 2 section/page specs will be added below as requested.)*

---

## Phase 2 — Section 9: Advantages Split & 8-Point Capability Grid (`AdvantagesSection.astro`)
- **Scenario:** Scenario 1 (Reference Screenshots adapted strictly into Reliable Industries UI)
- **Type:** Static Astro (`src/components/AdvantagesSection.astro`) + Lucide `ChevronRight` (`@lucide/astro`), zero client JS.
- **Placement:** Home page (`src/pages/index.astro`), directly between `<EngineeringSection />` (`#FFFFFF`) and `<Footer />` (`#003B6D`).
- **Desktop Adaptation (`>= 961px`):**
  - `#F4F6F8` light-grey background (`py-[3.5rem] min-[769px]:py-[5rem]`) to alternate cleanly between `#FFFFFF` Engineering section and `#003B6D` Footer.
  - Asymmetric 2-column grid (`grid-cols-[300px_1fr]` at `961px–1200px`, `grid-cols-[350px_1fr]` at `>=1201px`, `gap-[2.5rem]` / `gap-[4rem]`).
  - **Left Featured Card:** Solid `#003B6D` navy panel (`rounded-[2px]`, `p-[2.5rem_2rem]`), bold uppercase white `<h2>` (`1.6rem`), two `#e2e8f0` paragraphs using length-matched Lorem Ipsum (Option A), and bottom `#FFE600` `.btn-accent` (`rounded-[4px]`, `#003B6D` text) `Read More` CTA with Lucide `ChevronRight`.
  - **Right 2×4 Capability Grid:** 8 open borderless items (`grid-cols-2`, `gap-x-[3rem] gap-y-[2.25rem]`). Each item has a `28×6px` brand-palette top accent bar (alternating `#009FE3`, `#FFE600`, `#003B6D`), `1.1rem` bold `#003B6D` `<h3>`, `0.95rem` `#334155` length-matched Lorem Ipsum description, and `#009FE3` `Details` link with Lucide `ChevronRight`.
- **Responsive Spec:**
  - `<= 960px` (Tablet): Stack left `#003B6D` card above the 2-column right grid (`gap-[2.5rem]`).
  - `<= 576px` (`375px` Mobile): Collapse right grid to `1-col` (`gap-[1.75rem]`), tighten left card padding (`p-[1.75rem]`), keep touch-friendly button/link sizing.

---

## Phase 2 — Section 10: Certificates Checklist & Stacked Deck (`CertificatesSection.astro` + `CertificatesCarousel.tsx`)
- **Scenario:** Scenario 1 (Reference Screenshot adapted strictly into Reliable Industries UI)
- **Type:** Static Astro wrapper (`src/components/CertificatesSection.astro`) + React Island (`src/components/CertificatesCarousel.tsx` with `client:visible`), Lucide `ArrowLeft` / `ArrowRight` icons.
- **Placement:** Home page (`src/pages/index.astro`), directly below `<AdvantagesSection />` (`#F4F6F8`) and above upcoming `<FeaturedProductsSection />`.
- **Desktop Adaptation (`>= 1025px`):**
  - `#FFFFFF` background (`py-[3.5rem] min-[769px]:py-[5rem]`) with 2-column asymmetric split (`grid-cols-[360px_1fr] min-[1201px]:grid-cols-[380px_1fr] gap-[3rem]`).
  - **Left Checklist Card:** `#F4F6F8` solid card (`border border-[#e2e8f0] border-t-4 border-t-[#009FE3] rounded-[2px] p-[2.25rem]`) — zero glassmorphism/blur — containing bold uppercase `#003B6D` `<h2>` and 14 length-matched Lorem Ipsum compliance items with `#009FE3` circular dot markers.
  - **Right Interactive 5-Card Deck:** Fanned stacked deck of 5 sharp `#FFFFFF` certificate cards (`rounded-[2px]`, `border border-[#e2e8f0]`, top accent bar `#003B6D` / `#009FE3`, rectangular category tag, title, registration code, divider, `Reliable Industries` certified org label, standard code in `#009FE3`, short Lorem description, circular compliance seal + signatory name/role). Circular `40×40px` prev/next controls centered below + click-any-card-to-focus + keyboard left/right support.
- **Responsive Spec:**
  - `577px–1024px` (Tablet): Stack checklist card full-width above deck; checklist items switch to `2-col` grid; deck scales cleanly with `overflow-hidden`.
  - `<= 576px` (`375px` Mobile): Checklist `1-col`; deck card width `max-w-[295px]` with compact `±16px` peek offsets (no horizontal overflow), touch swipe left/right, `44×44px` touch buttons, and `1 / 5` counter.

---

## Phase 2 — Section 11: Featured Products (`FeaturedProductsSection.astro`)
- **Scenario:** Scenario 1/2 Hybrid (Compact upright portrait product card format adapted strictly into Reliable Industries UI per user reference screenshot)
- **Type:** Static Astro (`src/components/FeaturedProductsSection.astro`) + Astro `<Image />` + Lucide `ArrowRight` (`@lucide/astro`), zero client JS.
- **Placement:** Home page (`src/pages/index.astro`), directly below `<CertificatesSection />` (`#FFFFFF`) and above `<TestimonialsSection />` (`#FFFFFF`).
- **Desktop Design (`>= 1025px`):**
  - `#F4F6F8` light-grey background (`py-[3rem] min-[769px]:py-[4.5rem]`).
  - Header row: cyan kicker, `2.2rem` navy `<h2>`, and sharp `0px` `.btn-outline-dark` `View Products` link.
  - **4-Column Compact Portrait Product Cards** (`grid-cols-4`, `gap-[1.5rem]`, `~286px` wide upright portrait proportions):
    - Each card (`bg-white rounded-[2px] border border-[#dce4ec] p-[1.25rem] pb-[1.5rem] flex flex-col items-center text-center shadow-[0_4px_20px_rgba(0,43,73,0.06)] hover:-translate-y-[4px]`):
      - **Inset Image Box:** `aspect-[4/3] w-full bg-[#F4F6F8] border border-[#e6ebf1] rounded-[2px] p-[0.65rem] overflow-hidden` framing WebP `<Image />` (`scale-[1.2] object-contain mix-blend-multiply`) so seals sit naturally without white studio margins.
      - **Centered Typography & CTA:** bold uppercase `#003B6D` `<h3>` (`0.98rem`), short muted `#64748b` 2–3 word Lorem Ipsum subtitle (`0.9rem`), and bold uppercase `#009FE3` `Learn more` link with `ArrowRight` icon.
- **Responsive Spec:**
  - `577px–1024px` (Tablet): Clean `2×2` grid (`min-[577px]:grid-cols-2`, `gap-[1.5rem]`) with upright portrait proportions and zero orphan cells.
  - `<= 576px` (`375px` Mobile): `1-col` stack; header stacks cleanly with comfortable touch targets.

---

## Phase 2 — Section 12: Testimonials (`TestimonialsSection.astro`)
- **Scenario:** Scenario 2 (Name-only designed strictly in Reliable Industries UI)
- **Type:** Static Astro (`src/components/TestimonialsSection.astro`) + Lucide `Quote` (`@lucide/astro`), zero client JS.
- **Placement:** Home page (`src/pages/index.astro`), directly below `<FeaturedProductsSection />` (`#F4F6F8`) and directly above `<Footer />` (`#003B6D`).
- **Desktop Design (`>= 1025px`):**
  - `#FFFFFF` background (`py-[3.5rem] min-[769px]:py-[5rem]`).
  - Header: cyan kicker (`LOREM IPSUM`), `2.2rem` `#003B6D` `<h2>`, concise `#334155` intro (`max-w-[650px]`).
  - **3-Column Testimonial Cards** (`gap-[1.5rem]`):
    - White cards (`rounded-[2px]`, `border border-[#e2e8f0]`, `border-t-4 border-t-[#009FE3]` / `#003B6D`, `shadow-[0_4px_20px_rgba(0,43,73,0.05)]`, `p-[1.75rem]`).
    - Top row: Lucide `Quote` (`22px`, `#009FE3`) + `#94A3B8` uppercase sector tag.
    - Quote body (`<blockquote>`): `0.95rem` `#334155` Lorem Ipsum quote (`leading-[1.65]`).
    - Author footer (`border-t border-[#e2e8f0]`): `40×40px` `#003B6D` monogram initials badge (`rounded-[2px]`) + bold `#003B6D` name & `#64748b` role/company (Lorem Ipsum).
- **Responsive Spec:**
  - `641px–1024px` (Tablet): `2-col` grid; 3rd card spans 2 columns (`min-[641px]:max-[1024px]:col-span-2`) so there is no orphan cell.
  - `<= 640px` (`375px` Mobile): `1-col` stack with compact padding (`p-[1.5rem]`).

---

## Phase 3: Production Data Extraction & Page-by-Page Migration Process

> Goal: Transition from **Option A (`Lorem Ipsum` / `TBD`)** to a **production-ready multi-page website** by extracting verified real data from the user's legacy Git repository (`junior developer` build) strictly **section by section, page by page, and product by product**.

### Strict Migration Rules
1. **Data Extraction Only — Zero Legacy UI/UX Copied:**
   - Read and collect **only factual content/data** from the legacy Git repository: copy, headings, product specifications, series details, category structures, industries, certificates, contact details, legal copy, routes, and approved image assets.
   - Never import the legacy repo's HTML templates, stylesheets, CSS utility frameworks, layout grids, interactive hacks, or UI styling into production code. Every component stays built with **our Reliable Industries UI** (`docs/DESIGN_SYSTEM.md`) and **Astro + TypeScript + Tailwind + React Islands** (`docs/TECH_STACK.md`).
2. **Quarantined Reference Source:**
   - Inspect or clone the reference Git repository outside `src/` (or in a non-bundled `_reference/` location excluded from Astro build if stored locally) so legacy code never enters the production bundle.
3. **Granular Migration Gate (`Section -> Page -> Product`):**
   - **Step A (`Site Config & Global Chrome`):** Populate `src/config/site.ts` (company contact, domain, social links, SEO metadata, JSON-LD), Header nav & dropdowns, Utility Bar, and Footer with real data.
   - **Step B (`Homepage Sections 1–12`):** Replace Lorem Ipsum section by section (`Hero`, `Products`, `Why Choose Us`, `Industries`, `Engineering`, `Advantages`, `Certificates`, `Featured Products`, `Testimonials`) using real extracted content and images.
   - **Step C (`Inner Pages & Product Catalog`):** Build and populate remaining routes **page by page and product by product** using the Standard Page Shell (`BaseLayout` + `<SeoHead />` + `UtilityBar` + `Header` + `<main>` + `Footer`) and verified Astro `<Image />` assets.
4. **Per-Item Verification:**
   - Run `npx astro check` (`0 errors, 0 warnings, 0 hints`) + `npm run build` (`ASTRO_TELEMETRY_DISABLED=1`).
   - Verify full responsiveness (`375px`, `576px`, `768px`, `1024px`, `1280px`, `1440px`) and card alignment against the real extracted text.
   - Sync `docs/SECTION_BLUEPRINT.md` and `docs/PROGRESS.md` and stop for user approval after each item.

### Phase 3 — Batch 1: Site Config & Global Chrome (Home Step 1)
- **Files Updated:** `src/config/site.ts`, `src/components/seo/SeoHead.astro`, `public/brochures/product_brochure.pdf`, `src/components/UtilityBar.astro`, `src/components/Header.astro`, `src/components/MobileNav.tsx`, `src/components/Footer.astro`.
- **Extracted Data Applied:**
  - Verified SEO defaults (`Reliable Industries - Pioneer in Sealing`), email (`info@reliableseal.com`), phones (`+91- 78880 65557 / 65558 / 65559`), WhatsApp link, Mumbai address, JSON-LD `Organization` `PostalAddress` / `email` / `telephone`, and `Download Center` PDF link. *(Production domain URL & social URLs remain `TBD`.)*
  - Footer populated with real brand blurb, compact Mumbai contact block (Lucide `MapPin`, `Mail`, `Phone`), updated product/industry/quick link labels (`Single Spring Seals`..`Supply Systems`, `Oil & Gas`..`Mining & Minerals`, `About Us`..`Contact & Support`), `Request a Quote` sharp-`4px` `.btn-primary`, and 4 legal labels (`Privacy Policy`, `Terms & Conditions`, `Shipping Policy`, `Disclaimer`), keeping `#` targets for unbuilt Step 2 routes so zero dead links exist.

### Phase 3 — Batch 2: Section 3 Hero Carousel (Home Step 1)
- **File Updated:** `src/components/HeroSection.astro` (`HeroCarousel.tsx` layout/transitions/a11y unchanged).
- **Extracted Data Applied:**
  - Slide 1 (`light-pharma`): `RELY ON EXCELLENCE` / `High-Performance` / `Mechanical Seals.` + industrial sealing copy from `_reference/src/pages/index.astro`.
  - Slide 2 (`cyan-product`): `ADVANCED COMPONENTS` / `Comprehensive range of` / `mechanical seals.` + RM Series / Cartridge / Rotary Joints copy.
  - Slide 3 (`light-mission`): `OUR MISSION` / `Continuous innovations` / `in sealing applications.` + leak-free, maintenance-free quality mission copy.
  - Kept approved Phase 1 bright gradient hero photography (`hero_pharma_light.jpg`, `product_seal_2_1790081868989.jpg`, `mission_hero_bg.jpg`) and `#` CTA links until Step 2 inner routes exist.

### Phase 3 — Batch 3: Section 4 Products Section (Home Step 1)
- **File & Asset Updated:** `src/components/ProductsSection.astro`, `src/assets/images/waterrotatingunion.jpg`.
- **Extracted Data Applied:**
  - Header: `OUR PORTFOLIO` / `Reliable Sealing Solutions` (preserving Phase 1 4-col grid layout).
  - Cards 1–3: `Mechanical Seals` (`product_seal_1_1790081847592.jpg`), `Rotary Joints` (`waterrotatingunion.jpg`), `Seal Support Systems` (`product_seal_2_1790081868989.jpg`).
  - Highlight Card 4: `Custom Engineered Solutions` + `Inquire now` (`#003B6D` bg, `#FFE600` `.btn-accent`). Links kept as `#` until Step 2 product/contact routes are created.

### Phase 3 — Batch 4: Section 5 Why Choose Us (Home Step 1)
- **File Updated:** `src/components/WhyChooseUs.astro` (Phase 1 2:1 split layout & decorative circle unchanged).
- **Extracted Data Applied:**
  - Left column: `Comprehensive seal service for industrial facilities`, service overview paragraph, `This makes Reliable Industries unique:`, and 4 pillars (`Specialist`, `Reliable`, `Fast`, `Global`).
  - Right contact card: `CONTACT`, `We are happy to advise you`, consultation copy, and `Contact an expert` (`href="#"` until `/contact` page is built in Step 2).

### Phase 3 — Batch 5 (Full Home Completion): Sections 6, 7, 9, 10, 11, & 12
- **Assets Copied:** `src/assets/images/hero_industrial_new.jpg`, `src/assets/images/hero_rotary_joint_product.jpg`, and 4 real product photos in `src/assets/images/featured/` (`agiator_01.png`, `high_temp_seal_01.jpg`, `hydrolic_1.png`, `deofolwrotatingunion.png`).
- **Section 6 (`IndustriesSection.astro` + `IndustriesCarousel.tsx`):** Migrated header (`INDUSTRIES` / `Diverse solutions for numerous industries`), all **10 real industries** from `_reference` (`Oil & Gas` through `Textile`), and updated selector grid to `2-col` (`5 × 2`) so 10 items align cleanly without an orphan cell.
- **Section 7 (`EngineeringSection.astro`):** Migrated header (`INNOVATION & SUPPORT` / `Engineering & Resources`) and all 6 resource cards (`Meet our experts`, `Advanced Engineering`, `Precision Manufacturing` using `hero_industrial_new.jpg`, `Online Support`, `Quality Assurance`, `Global Network`).
- **Section 9 (`AdvantagesSection.astro`):** Migrated `WHY CHOOSE US` navy panel + 8 capability pillars (`Sealing Technology` through `Environmental, Health & Safety`).
- **Section 10 (`CertificatesSection.astro` + `CertificatesCarousel.tsx`):** Migrated all 14 certification standards and all 5 stacked deck certificates (`API Spec Q1`, `ASME U Stamp`, `ISO 9001:2015`, `ATEX 2014/34/EU`, `Integrated EHS Certificate`), including per-card `organizationLabel`.
- **Section 11 (`FeaturedProductsSection.astro`):** Migrated to compact portrait cards featuring `Agitator Seal`, `High Temp Seal Series`, `RMF-H-100 Hydraulic Union`, and `RDF-80 Duoflow Union` with real product photography (`object-contain` inside `#F4F6F8` inset frame, `View Specs ->` aligned via `mt-auto`).
- **Section 12 (`TestimonialsSection.astro`):** Migrated `VERIFIED CLIENT FEEDBACK` / `Trusted By Industrial Leaders Worldwide` and 3 customer testimonials (`Rajesh Singhania`, `Vikramaditya Rao`, `David Miller`) without legacy star/rating widgets.
- *(All internal route links across Home Page remain `#` until Step 2+ creates those inner pages so there are zero broken routes.)*

### Phase 3 — Navbar Mega-Dropdowns & Live Product Search
- **Files Created / Updated:** `src/data/navProducts.json`, `src/data/navigation.ts`, `src/components/DesktopNav.tsx`, `src/components/MobileNav.tsx`, `src/components/Header.astro`, `src/components/UtilityBar.astro`.
- **Desktop Architecture (`DesktopNav.tsx` `client:media="(min-width: 769px)"`):**
  - Resting bar preserves Phase 1 1:1 visual appearance (`Products` active cyan bar, `Services`, `Industries`, `Company`, underline `Search...`).
  - **Products Mega-Menu:** 3-tier selector (`5` Product Groups -> `16` Subcategories -> filtered catalog series with up to 2 compact spec tags + `Download Technical Catalogue (PDF)` footer) anchored flush below `#main-header` inside `.site-container`.
  - **Services, Industries & Company Dropdowns:** Promo panel (`#003B6D` bg, `#FFE600` `.btn-accent` CTA) + structured columns (`Maintenance` & `Consulting` under Services; `Primary Sectors` & `Specialized` all 10 sectors under Industries; `About Us` under Company).
  - **Live Product Search:** Filters 55 catalog + custom series items as you type (`>= 2` chars) in a compact anchored dropdown.
  - **Mobile Architecture (`MobileNav.tsx` `client:media="(max-width: 768px)"`):**
  - Slide-over drawer with live catalog search, nested 3-level accordion for `Products` + PDF brochure button, expandable link groups for `Services`/`Industries`/`Company`, and utility links.

### Phase 3 — Step 2: Full Multi-Page Buildout & Live Route Wiring
- **Shared Chrome & Data Layer:**
  - Added `src/data/productsCatalog.json` (46 cleaned catalog products) + copied 66 referenced WebP-optimizable product images to `src/assets/images/sealproduct/`, `src/data/catalog.ts`, `src/data/industries.json`, `src/data/industriesData.ts`, `src/data/companyData.ts`.
  - Created reusable `src/components/PageHeader.astro` (`#003B6D` navy header with `#009FE3` bottom rule, breadcrumbs, cyan kicker, single `<h1>`) and `src/components/LegalDocument.astro`.
- **Product Catalog Routes:**
  - `/products` (`src/pages/products/index.astro`): 3 core Super Category groups (`Mechanical Seal`, `Rotary Joints`, `Seal Support System`) in compact portrait cards + `Bearing Isolators` & `Spares` specification cards + catalogue PDF CTA.
  - `/products/[category]` (`src/pages/products/[category]/index.astro`): Category series listings across 15 category routes.
  - `/products/[category]/[slug]` (`src/pages/products/[category]/[slug].astro` + `src/components/ProductGallery.tsx` island): Product detail pages across all 46 models with sibling selector sidebar, WebP multi-image zoom/thumbnail gallery (`engineering_cad.jpg` fallback when single photo), `Overview`, `Key Features`, `Technical Specs` definition list, brochure download, and hotline CTA.
- **Industries Routes:**
  - `/industries` (`src/pages/industries/index.astro`): Balanced `2-col` (`5×2`) 10-sector overview grid + consultation banner.
  - `/industries/[slug]` (`src/pages/industries/[slug].astro`): 10 dedicated sector pages with split intro, Performance Statement callout, Operating Envelope grid, Rotating Equipment list, Recommended Sealing Systems links, and All-Industries sidebar.
- **Contact, Company & Legal Routes:**
  - `/contact` (`src/pages/contact.astro` + `ContactInquiryForm.tsx` island): HQ details, WhatsApp/Hotline buttons, static URL-prefilled inquiry form with formatted `mailto:` / WhatsApp / Clipboard dispatch, 4 department cards, and Google Map embed.
  - `/about`, `/certifications`, `/management-team`, `/news-press`, `/events-trade-fairs` rebuilt cleanly with Reliable UI, WebP `<Image />`, and Lucide icons.
  - `/privacy-policy`, `/terms-conditions`, `/shipping-policy`, `/disclaimer` via shared `<LegalDocument />`.
- **Route Wiring:** Connected Navbar mega-menus, Live Search, Home Hero/Products/WhyChooseUs/Industries/Engineering/Advantages/FeaturedProducts CTAs, Utility Bar `Contact`, and Footer links cleanly to all generated routes.
