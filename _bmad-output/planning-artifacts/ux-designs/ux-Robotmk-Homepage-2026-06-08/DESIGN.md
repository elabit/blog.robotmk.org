---
name: Robotmk — Precision Dark
status: final
created: 2026-06-08
updated: 2026-06-08
colors:
  # Surfaces
  background: '#1e262e'
  surface: '#2C3843'
  surface-low: '#253039'
  surface-high: '#354552'
  surface-border: '#3d4f5c'
  # Accent
  primary: '#15D1A0'
  on-primary: '#0d1a14'
  primary-dim: '#0fa87e'
  # Text
  on-surface: '#e8edf2'
  on-surface-variant: '#8fa3b1'
  on-surface-muted: '#5a7183'
  # Semantic
  error: '#ff6b6b'
  on-error: '#ffffff'
  success: '#15D1A0'
  # Light mode overrides
  background-light: '#f4f6f8'
  surface-light: '#ffffff'
  surface-border-light: '#d1dae3'
  on-surface-light: '#1e262e'
  on-surface-variant-light: '#4a6070'
typography:
  display:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.05'
    letterSpacing: '-0.03em'
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: '-0.02em'
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: '-0.01em'
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0.08em'
    textTransform: uppercase
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
rounded: 0px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  3xl: 96px
  section: 120px
  max-width: 1280px
  content-width: 1100px
components:
  button-primary:
    background: '{colors.primary}'
    color: '{colors.on-primary}'
    fontFamily: Inter
    fontWeight: '600'
    fontSize: 15px
    padding: '12px 24px'
    borderRadius: 0
    border: none
    hover-background: '{colors.primary-dim}'
    transition: background 150ms ease
  button-ghost:
    background: transparent
    color: '{colors.primary}'
    border: '1px solid {colors.primary}'
    padding: '11px 23px'
    borderRadius: 0
    hover-background: 'rgba(21,209,160,0.08)'
  button-dark:
    background: '{colors.on-surface}'
    color: '{colors.background}'
    padding: '12px 24px'
    borderRadius: 0
    border: none
  card:
    background: '{colors.surface}'
    border: '1px solid {colors.surface-border}'
    padding: '{spacing.xl}'
    borderRadius: 0
    hover-border: '1px solid {colors.primary}'
    transition: border-color 150ms ease
  badge:
    background: transparent
    border: '1px solid {colors.primary}'
    color: '{colors.primary}'
    padding: '4px 12px'
    fontSize: 12px
    fontWeight: '600'
    letterSpacing: '0.04em'
    borderRadius: 0
  input:
    background: '{colors.background}'
    border: '1px solid {colors.surface-border}'
    color: '{colors.on-surface}'
    padding: '12px 16px'
    fontSize: 15px
    borderRadius: 0
    focus-border: '1px solid {colors.primary}'
    outline: none
  nav:
    background: '{colors.background}'
    border-bottom: '1px solid {colors.surface-border}'
    height: 64px
    position: sticky
    top: 0
    z-index: 100
  section-divider:
    border-top: '1px solid {colors.surface-border}'
---

# Brand & Style

**Design Ethos:** Precision over decoration. Every element earns its place. The site communicates authority through restraint — not through noise.

**Visual Character:** Engineering precision meets human credibility. The palette is dark and focused; the accent (#15D1A0) is used sparingly as a signal — not a fill. Sharp corners throughout reinforce the technical identity without resorting to console/terminal aesthetics.

**Brand Voice (visual):** Simon Meggle is the founder and the authority. The site's visual hierarchy always leads with the problem (the Monitoring Gap), then the solution, then the person. Trust is built through specificity and clarity — numbers, credentials, and named products — not through warmth or decoration.

**Anti-patterns:**
- No heavy console/terminal aesthetics (no green-on-black matrix vibes, no blinking cursors as decoration)
- No excessive monospace typography outside code blocks
- No rounded cards or pill shapes
- No hero carousels or auto-advancing banners
- No stock photography — use diagrams, technical illustrations, and Simon's real portrait

---

# Colors

## Dark Mode (Default)

| Role | Token | Hex |
|---|---|---|
| Page background | `background` | `#1e262e` |
| Card / surface | `surface` | `#2C3843` |
| Surface low | `surface-low` | `#253039` |
| Surface high | `surface-high` | `#354552` |
| Borders | `surface-border` | `#3d4f5c` |
| Accent / Primary | `primary` | `#15D1A0` |
| On-primary text | `on-primary` | `#0d1a14` |
| Accent hover | `primary-dim` | `#0fa87e` |
| Body text | `on-surface` | `#e8edf2` |
| Secondary text | `on-surface-variant` | `#8fa3b1` |
| Muted text | `on-surface-muted` | `#5a7183` |
| Error / danger | `error` | `#ff6b6b` |

## Light Mode

| Role | Token | Hex |
|---|---|---|
| Page background | `background-light` | `#f4f6f8` |
| Card / surface | `surface-light` | `#ffffff` |
| Borders | `surface-border-light` | `#d1dae3` |
| Body text | `on-surface-light` | `#1e262e` |
| Secondary text | `on-surface-variant-light` | `#4a6070` |
| Accent unchanged | `primary` | `#15D1A0` |

**Accent usage rule:** `{colors.primary}` appears on interactive elements (CTAs, links, active states, icon accents), semantic highlights (checkmarks, success states), and the eyebrow labels above headlines. Never as a large background fill except the Newsletter CTA section.

---

# Typography

**Font stack:**
- Headlines: `Space Grotesk` (Google Fonts) — geometric, tight, precise
- Body: `Inter` (Google Fonts) — neutral, highly readable
- Code: `JetBrains Mono` (Google Fonts) — used exclusively for code snippets, never for UI chrome

**Scale:** See YAML frontmatter. Key rules:
- Display (56px / -0.03em) — Hero headline only
- Headline-LG (40px) — Section H2 headings
- Labels always in ALL CAPS with `letter-spacing: 0.08em` — used for eyebrow text and category chips
- No italic except the tagline: *"And the monitoring said: everything is green."* — rendered in `Inter italic`, `on-surface-variant` color

---

# Layout & Spacing

**Base grid:** 8px. All spacing is a multiple of 8.

**Max content width:** 1280px, centered with `auto` horizontal margins.

**Section padding:** `{spacing.section}` (120px) top and bottom for full-width sections. 80px on mobile.

**Section separation:** Always a hard `1px solid {colors.surface-border}` rule between sections — never a blur, gradient fade, or overlap. This is the visual spine of the "Precision" aesthetic.

**Alternating backgrounds:**
- Dark sections: `{colors.background}` (#1e262e)
- Surface sections: `{colors.surface}` (#2C3843)
- Accent section: `{colors.primary}` (#15D1A0) — Newsletter CTA only

---

# Elevation & Depth

**No shadows.** The Precision design system uses borders and background-level contrast to create depth, not box-shadows. The exception is a subtle `inset 0 1px 0` highlight on the top edge of elevated cards in light mode only.

**Z-axis layers:**
1. Page background
2. Surface cards (border only)
3. Navigation (sticky, `z-index: 100`)
4. Modals / drawers (not in v1)

---

# Shapes

**Border radius: 0px everywhere.** No exceptions for v1. Sharp corners are the visual signature of the Precision system. If a future design iteration introduces radius, it must be a deliberate system-level decision, not component-level drift.

---

# Components

See YAML frontmatter for token-level specs. Behavioral specs live in EXPERIENCE.md.

## Navigation
Solid dark bar (`{colors.background}`), `64px` height, sticky. Bottom border `1px {colors.surface-border}`. Logo left (asset TBD, placeholder until delivered). Center nav links in `Inter 15px / {colors.on-surface-variant}`, active state `{colors.on-surface}` with `2px solid {colors.primary}` underline. Right: "Clarity Call buchen →" as `button-primary`.

## The Gap Visualization (Hero right panel)
A two-panel technical diagram with an explicit gap between panels:
- **Top panel** (`surface` bg): "INFRASTRUCTURE MONITORING" label, status items in accent/green
- **Gap bar**: `2px dashed {colors.error}`, label in `error` color
- **Bottom panel** (`surface-low` bg): "USER EXPERIENCE" label, failure states in `error`
This is a purpose-built SVG or HTML diagram — not a screenshot, not a stock image.

## Stat Chips (Stats Bar)
Number in `display` scale, `{colors.primary}` or `{colors.error}` depending on valence. Label in `body-sm / {colors.on-surface-variant}`. Separated by `1px solid {colors.surface-border}` vertical rules.

## Product Cards (Learn / Services)
`card` component. Icon placeholder circle `48px`. Title in `headline-sm`. Body in `body-md`. Optional level badge (Beginner / Advanced) in `badge` component with secondary color. CTA at bottom.

## Founder Badges
`badge` component: sharp border, `{colors.primary}` text and border. Prefix with emoji icon (🔧 / 📋). Used exclusively in the Founder section.

---

# Do's and Don'ts

**Do:**
- Use `{colors.primary}` for the single most important action per screen
- Use hard borders to separate sections — always
- Use `label` typography for eyebrows, category chips, and metadata
- Put the person (Simon) in the design — real photo, real quotes, real credentials
- Let the Monitoring Gap visualization do the explaining — resist adding more words to the hero

**Don't:**
- Use rounded corners on any interactive element or card
- Use monospace fonts for anything that is not code
- Fill large areas with `{colors.primary}` (except Newsletter CTA)
- Add decorative elements (waves, blobs, gradients) between sections
- Use stock photography
- Animate anything that does not carry information (no spinning logos, no particle effects)
