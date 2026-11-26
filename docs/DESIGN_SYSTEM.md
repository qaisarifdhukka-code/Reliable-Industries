# Design System & 1:1 Prototype Visual Specification

> **Rule:** When `index.html` inline styles override `style.css`, the **rendered browser output** wins. Every value below is verified directly against `index.html` and `style.css`.

---

## 1. Color Palette

| Token Name | Hex / Value | Usage in Prototype |
| :--- | :--- | :--- |
| `--color-primary-navy` | `#003B6D` | Utility bar bg, primary headings (`h2`, `h3`), nav links, highlight card bg, footer bg, dark hero CTA, industry prev/next buttons |
| `--color-primary-dark` | `#002038` | Footer bottom bar bg (`footer-bottom`), Slide 2 yellow button text |
| `--color-accent-cyan` | `#009FE3` | Kickers, primary buttons (`.btn-primary`, `.btn-cyan`), active nav top border & hover text, checkmarks, Slide 2 hero overlay |
| `cyan-hover-primary` | `#007BB5` | Hover on `.btn-primary` |
| `cyan-hover-card` | `#0085be` | Hover on `.btn-cyan` |
| `--color-accent-lime` | `#FFE600` | Hero Slide 2 button (`View Products`), Highlight card button (`Inquire now`) |
| `lime-hover` | `#E6D000` | Hover on `.btn-accent` |
| `--bg-light-grey` | `#F4F6F8` | Products section bg, Industries section bg, product card border divider |
| `--bg-white` | `#FFFFFF` | Page body bg, Header bg, Why Choose Us section bg, Engineering & Resources section bg (inline override), cards bg |
| `--text-main` | `#334155` | Body text, paragraph copy |
| `--text-light` | `#94A3B8` | Inactive industry links, contact card kicker, nav caret span, footer bottom text, search border/placeholder |
| `text-muted-on-dark` | `#cbd5e1` | Highlight card paragraph, footer links, footer brand paragraph |
| `border-card` | `#e2e8f0` | `.product-card` 1px border |
| `innov-paragraph` | `#555555` | `.innov-content p` text color |

---

## 2. Typography

- **Font Family:** `'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` (self-hosted `@fontsource/inter`: weights `400`, `600`, `700`, `800`).
- **Base Line Height:** `1.6` (`body`), `-webkit-font-smoothing: antialiased`.

### Exact Element Type Scale (Rendered)

| Element | Font Size | Weight | Line Height | Letter Spacing | Extra |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Logo Title (`Reliable` / `Industries`)** | `1.5rem` (24px) | `700` (bold) | `0.9` | `-0.5px` (`Reliable`) | `font-style: italic` |
| **Logo Tagline (`PIONEER IN SEALING`)** | `0.55rem` | `700` | normal | `2px` | `italic`, uppercase, `border-top: 1px solid #003B6D`, `padding-top: 2px`, `margin-top: 4px` |
| **Utility Bar** | `0.8rem` | `400` | `1.6` | normal | White text on `#003B6D` |
| **Main Nav Links** | `0.95rem` | `600` | normal | normal | Caret span `0.7rem`, `#94A3B8` |
| **Hero Kicker** | `0.75rem` *(inline override)* | `700` | normal | `2px` | Uppercase, `#003B6D` (Slides 1 & 3) / `#FFFFFF` (Slide 2) |
| **Hero Title** | `clamp(2.5rem, 4vw, 3.2rem)` *(inline override; mobile adjusts cleanly)* | `800` | `1.1` *(inline)* | `-1.5px` | `#003B6D` (Slides 1 & 3) / `#FFFFFF` (Slide 2) |
| **Hero Subtitle** | `1rem` *(inline override)* | `600` | `1.5` *(inline)* | normal | `max-width: 600px`, `#003B6D` (Slides 1 & 3) / `#FFFFFF` (Slide 2) |
| **Section Kicker (`.kicker`)** | `0.85rem` | `700` | normal | `1.5px` | Uppercase, `#009FE3` (Industries kicker overrides color to `#003B6D`, `letter-spacing: 1px`, `margin-bottom: 1rem`) |
| **Section Title (`h2`)** | `2.2rem` | `700` | `1.2` | normal | `#003B6D`; Industries title `2.5rem` |
| **Card Title (`h3`)** | `1.25rem` | `700` | normal | normal | `#003B6D`; Innovation `h3` is `1.1rem`, `line-height: 1.3`; Industry text `h3` is `1.4rem` |
| **Why Sub-title** | `1.4rem` | `700` | normal | normal | `#003B6D` |
| **Contact Card Title** | `1.8rem` | `700` | `1.2` | normal | `#003B6D` |

---

## 3. Layout, Spacing, Radii & Shadows

### Container & Grid
- `.container`: `max-width: 1280px`, `width: 100%`, `margin: 0 auto`, `padding: 0 2rem` (reduce horizontal padding cleanly on mobile, e.g. `1.25rem` at `<= 768px`, `1rem` at `<= 480px`).

### Section Vertical Padding (Desktop)
- Utility Bar: `0.5rem 0`
- Main Header: `0.8rem 0` (`0.5rem 0` when `.scrolled`)
- Hero: `min-height: 85vh` (desktop)
- Products Section: `5rem 0`
- Why Choose Us: `4rem 0`
- Industries Section: `6rem 0`
- Engineering & Resources: `6rem 0` (set by line 664 `.innovation-section`; later rule at line 1028 sets `80px 0` = `5rem 0` — use `80px 0` since line 1028 overrides line 664 in CSS cascade!)
- Main Footer: `padding-top: 5rem`, bottom bar `1.5rem 0`

### Exact Border Radii (Strict — No AI Slop Rounding!)
- **Hero CTA buttons & Innovation card buttons:** `border-radius: 0px`
- **Product cards:** `border-radius: 2px`
- **Standard `.btn` (`Inquire now`, `Contact an expert`, `Get in touch`) & Contact card:** `border-radius: 4px`
- **Industries nav buttons (`<-`, `->`) & `Read more` outline button:** `border-radius: 0px` (sharp corners)
- **Carousel prev/next controls, indicators, hero badge, checkmarks, play button, social links:** `border-radius: 50%`

### Exact Shadows
- Header: `0 2px 10px rgba(0, 0, 0, 0.05)`
- Carousel control: `0 2px 10px rgba(0, 0, 0, 0.1)`
- Product card: `0 4px 20px rgba(0, 43, 73, 0.05)` (hover: `0 12px 30px rgba(0, 43, 73, 0.1)` + `translateY(-5px)`)
- Contact card: `0 10px 40px rgba(0, 0, 0, 0.08)`
- Innovation card: `0 4px 15px rgba(0, 0, 0, 0.05)`
- Play button overlay: `0 4px 10px rgba(0, 0, 0, 0.2)`

---

## 4. Prototype Inline Overrides & Dead Code Audit

### Inline Overrides in `index.html` That MUST Be Preserved Visually
1. **Header Logo (`index.html:38`):** `Reliable` and `Industries` sit side-by-side (`display: flex; gap: 6px; align-items: baseline;`). In Footer (`index.html:440`), they stack vertically and have NO tagline.
2. **Hero Slides (`index.html:70–172`):** Inline styles set `hero-title` to `clamp(2.5rem, 4vw, 3.2rem)`, `hero-subtitle` to `1rem; line-height: 1.5; margin-bottom: 1.5rem`, and buttons to `border-radius: 0; padding: 0.8rem 2.5rem`.
3. **Hero Slide 2 (`index.html:104–133`):** Cyan gradient overlay `linear-gradient(90deg, rgba(0, 159, 227, 1) 0%, rgba(0, 159, 227, 0.9) 45%, rgba(0, 159, 227, 0) 100%)`, white text, yellow button (`#FFE600`) with `#002038` text, solid white circular badge.
4. **Hero Slide 3 (`index.html:142–171`):** White gradient overlay `linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 60%, rgba(255, 255, 255, 0.2) 100%)`.
5. **Engineering & Resources (`index.html:345–347`):** Inline `background-color: #ffffff;` overrides CSS `#f4f5f7`. Also `.text-center` has no CSS definition, so the heading renders **left-aligned** — preserve left alignment + `#FFFFFF` background.
6. **Card 5 Image (`index.html:409`):** `certificate_iso_1790083146225.jpg` uses `object-fit: contain; padding: 10px;` instead of `object-fit: cover`.
7. **Footer CTA (`index.html:476`):** Uses `.btn-sm` (not defined in CSS, falls back to `.btn` `0.8rem 1.8rem` padding) with `margin-top: 15px`.

### Dead CSS & Unused Prototype Assets (Exclude from Production Build)
- **Dead CSS classes in `style.css`:** `.certificates-section`, `.cert-grid`, `.cert-placeholder`, `.enquire-section`, `.enquire-box`, `.enquire-text`, `.btn-large`, `.industries-split`, `.industry-image`, `.industry-content`, `.stats-grid`, `.tab` JS listener.
- **Unused images in `images/`:** `clean_world_map.jpg`, `hero_industrial_new.jpg`, `world_map_bg.jpg` (keep archived in `_prototype/images/` or unused folder; only import used images into `src/assets/images/`).

---

## 5. Responsive Breakpoints Strategy

| Breakpoint | Target | Behavior |
| :--- | :--- | :--- |
| `>= 1025px` | **Desktop** | **100% locked 1:1 match with prototype.** |
| `<= 1024px` | **Tablet** | Product grid `2 cols`, Engineering grid `2 cols` (`<= 1200px`), tighten split section gaps (`2.5rem`). |
| `<= 768px` | **Mobile Landscape / Small Tablet** | Hide desktop utility bar & desktop horizontal nav; activate Hamburger button & Mobile Drawer; stack Why Choose Us split & Industries split vertically; Engineering grid `1 col`; Footer `1 col`; adjust Hero height & contrast overlay. |
| `<= 576px` | **Mobile Portrait** | Product grid `1 col`; Why Choose Us points list `1 col`; Industries links grid `2 cols` (or `1 col` at `<= 400px`); Innovation cards stack image above text (`height: 200px`). |

---

## 6. Phase 2 & Phase 3 UI Adaptation Rules (New Sections, Pages & Real Content)

When building new sections/pages from a **reference screenshot (Scenario 1)** or **name only (Scenario 2)**, OR when populating **Phase 3 extracted real content** from the source Git repo:

1. **Translate Format & Extract Data — Never Copy Foreign/Legacy Styling:** Take only layout structure from reference screenshots and strictly **data only** from the legacy Git repo. Never copy external/legacy colors, fonts, CSS, messy HTML, shadows, or rounded pill styles; render everything using **our exact tokens** (`#003B6D`, `#009FE3`, `#FFE600`, `#F4F6F8`, `#FFFFFF`, Inter, `.site-container` `1280px`).
2. **Reuse Established Patterns:**
   - Section vertical rhythm: alternating `#FFFFFF` / `#F4F6F8` backgrounds with `3.5rem–6rem` desktop padding (`3rem` mobile).
   - Kickers: `0.85rem`, bold, uppercase, `1.5px` tracking (`#009FE3` or `#003B6D`).
   - Section `h2`: `1.75rem` mobile → `2.2rem–2.5rem` desktop, bold `#003B6D`, `1.2` line-height.
   - Cards & shadows: sharp (`0px`) or subtle `2px`/`4px` corners with `border-[#e2e8f0]` and prototype-matched subtle shadows. When real data lengths vary slightly from Lorem Ipsum, keep card heights aligned cleanly with CSS grid stretch / consistent vertical rhythm.
   - Buttons: `.btn-primary` (`#009FE3`, `4px` or `0px` depending on context), `.btn-accent` (`#FFE600`), `.btn-outline-dark` (`1px solid #003B6D`, `0px`). Never `rounded-full` pill buttons.
3. **Full Responsive Coverage:** Every new or data-populated component/page must cleanly handle `375px`, `576px`, `768px`, `1024px`, `1280px`, and `1440px` with zero horizontal overflow.
